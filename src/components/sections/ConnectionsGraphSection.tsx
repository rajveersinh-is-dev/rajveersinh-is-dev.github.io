import React, { useState, useMemo, useEffect, useRef } from 'react';
import { connectionsGraphData } from '../../data';
import type { GraphConnectionNode } from '../../types/content';
import { useIntersectionObserver } from '../../utils/intersectionObserver';
import { MaskedReveal } from '../common/MaskedReveal';
import { usePreferences } from '../../context';

interface NodePhysics {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export const ConnectionsGraphSection: React.FC = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('p-numlang');
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [sectionRef, isVisible] = useIntersectionObserver<HTMLElement>();
  const { playClick, theme } = usePreferences();
  const svgRef = useRef<SVGSVGElement | null>(null);

  const activeId = hoveredNodeId || selectedNodeId;
  const activeNode = connectionsGraphData.find((n) => n.id === activeId) || null;

  // Set of connected nodes in the incident subgraph of activeNode
  const incidentSubgraphNodeIds = useMemo(() => {
    if (!activeNode) return new Set<string>();
    const set = new Set<string>([activeNode.id, ...activeNode.connections]);
    // Also include any other node that connects to activeNode
    connectionsGraphData.forEach((node) => {
      if (node.connections.includes(activeNode.id)) {
        set.add(node.id);
      }
    });
    return set;
  }, [activeNode]);

  // Compute edges list
  const edges = useMemo(() => {
    const edgeList: { id: string; source: string; target: string }[] = [];
    const seen = new Set<string>();

    connectionsGraphData.forEach((source) => {
      source.connections.forEach((targetId) => {
        const edgeKey = [source.id, targetId].sort().join('---');
        if (!seen.has(edgeKey)) {
          seen.add(edgeKey);
          edgeList.push({
            id: edgeKey,
            source: source.id,
            target: targetId,
          });
        }
      });
    });

    return edgeList;
  }, []);

  // Initial circular layout
  const initialPositions = useMemo(() => {
    const total = connectionsGraphData.length;
    const positions: Record<string, { x: number; y: number }> = {};
    const centerX = 400;
    const centerY = 300;

    connectionsGraphData.forEach((node, idx) => {
      let radius = 210;
      if (node.type === 'concept') radius = 160;
      if (node.type === 'technology') radius = 240;
      if (node.type === 'project') radius = 185;
      if (node.type === 'research') radius = 220;

      const angle = (idx / total) * Math.PI * 2 - Math.PI / 2;
      positions[node.id] = {
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
      };
    });

    return positions;
  }, []);

  // Physics simulation state for nodes
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>(initialPositions);
  const physicsRef = useRef<Record<string, NodePhysics>>({});
  const isSimulatingRef = useRef<boolean>(true);

  // Initialize physics nodes
  useEffect(() => {
    const pNodes: Record<string, NodePhysics> = {};
    connectionsGraphData.forEach((node) => {
      const init = initialPositions[node.id] || { x: 400, y: 300 };
      pNodes[node.id] = {
        id: node.id,
        x: init.x,
        y: init.y,
        vx: 0,
        vy: 0,
      };
    });
    physicsRef.current = pNodes;
  }, [initialPositions]);

  // Check prefers-reduced-motion
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Physics loop (Velocity-Verlet / spring-mass dynamics)
  useEffect(() => {
    if (prefersReducedMotion || !isVisible) {
      isSimulatingRef.current = false;
      return;
    }

    isSimulatingRef.current = true;
    let animId: number;

    const tick = () => {
      const pNodes = physicsRef.current;
      const nodeKeys = Object.keys(pNodes);
      if (nodeKeys.length === 0) return;

      const centerX = 400;
      const centerY = 300;
      let totalKineticEnergy = 0;

      // 1. Center gravity & repulsion between all pairs of nodes
      for (let i = 0; i < nodeKeys.length; i++) {
        const nodeA = pNodes[nodeKeys[i]];
        if (!nodeA) continue;

        // Weak center gravitational pull
        let fx = (centerX - nodeA.x) * 0.001;
        let fy = (centerY - nodeA.y) * 0.001;

        // Coulomb-like repulsive forces
        for (let j = i + 1; j < nodeKeys.length; j++) {
          const nodeB = pNodes[nodeKeys[j]];
          if (!nodeB) continue;

          const dx = nodeB.x - nodeA.x;
          const dy = nodeB.y - nodeA.y;
          const distSq = dx * dx + dy * dy + 100;
          const dist = Math.sqrt(distSq);
          const repForce = 1100 / distSq;

          const nx = dx / dist;
          const ny = dy / dist;

          fx -= nx * repForce;
          fy -= ny * repForce;
          nodeB.vx += nx * repForce;
          nodeB.vy += ny * repForce;
        }

        nodeA.vx += fx;
        nodeA.vy += fy;
      }

      // 2. Hooke's Law spring forces along relational edges
      const restLength = 120;
      const springK = 0.025;

      edges.forEach((edge) => {
        const u = pNodes[edge.source];
        const v = pNodes[edge.target];
        if (!u || !v) return;

        const dx = v.x - u.x;
        const dy = v.y - u.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const delta = dist - restLength;
        const force = delta * springK;

        const nx = dx / dist;
        const ny = dy / dist;

        u.vx += nx * force;
        u.vy += ny * force;
        v.vx -= nx * force;
        v.vy -= ny * force;
      });

      // 3. Integration with damping
      const damping = 0.86;
      const newPosMap: Record<string, { x: number; y: number }> = {};

      nodeKeys.forEach((key) => {
        const node = pNodes[key];
        if (!node) return;

        if (node.id === draggedNodeId) {
          // Dragged node position is locked to cursor
          node.vx = 0;
          node.vy = 0;
        } else {
          node.vx *= damping;
          node.vy *= damping;
          node.x += node.vx;
          node.y += node.vy;

          // Boundary constraints (SVG canvas: 800 x 600)
          node.x = Math.max(35, Math.min(765, node.x));
          node.y = Math.max(35, Math.min(565, node.y));
        }

        totalKineticEnergy += node.vx * node.vx + node.vy * node.vy;
        newPosMap[node.id] = { x: node.x, y: node.y };
      });

      setPositions(newPosMap);

      // Keep running if there's kinetic energy or a node is being actively dragged
      if (totalKineticEnergy > 0.05 || draggedNodeId !== null) {
        animId = requestAnimationFrame(tick);
      } else {
        isSimulatingRef.current = false;
      }
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [edges, draggedNodeId, prefersReducedMotion, isVisible]);

  // Pointer drag event handlers for interactive physics manipulation
  const handlePointerDown = (nodeId: string, e: React.PointerEvent) => {
    e.stopPropagation();
    (e.target as Element).setPointerCapture?.(e.pointerId);
    setDraggedNodeId(nodeId);
    setSelectedNodeId(nodeId);
    playClick(900);
    isSimulatingRef.current = true;
  };

  // Window-level tracking during drag ensures continuous dragging across boundaries
  useEffect(() => {
    if (!draggedNodeId) return;

    const onWindowPointerMove = (e: PointerEvent) => {
      if (!svgRef.current) return;
      const svgRect = svgRef.current.getBoundingClientRect();
      const scaleX = 800 / svgRect.width;
      const scaleY = 600 / svgRect.height;

      const svgX = (e.clientX - svgRect.left) * scaleX;
      const svgY = (e.clientY - svgRect.top) * scaleY;

      const node = physicsRef.current[draggedNodeId];
      if (node) {
        node.x = Math.max(30, Math.min(770, svgX));
        node.y = Math.max(30, Math.min(570, svgY));
        setPositions((prev) => ({
          ...prev,
          [draggedNodeId]: { x: node.x, y: node.y },
        }));
      }
    };

    const onWindowPointerUp = () => {
      setDraggedNodeId(null);
      playClick(720);
    };

    window.addEventListener('pointermove', onWindowPointerMove);
    window.addEventListener('pointerup', onWindowPointerUp);
    window.addEventListener('pointercancel', onWindowPointerUp);

    return () => {
      window.removeEventListener('pointermove', onWindowPointerMove);
      window.removeEventListener('pointerup', onWindowPointerUp);
      window.removeEventListener('pointercancel', onWindowPointerUp);
    };
  }, [draggedNodeId, playClick]);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggedNodeId || !svgRef.current) return;
    const svgRect = svgRef.current.getBoundingClientRect();
    const scaleX = 800 / svgRect.width;
    const scaleY = 600 / svgRect.height;

    const svgX = (e.clientX - svgRect.left) * scaleX;
    const svgY = (e.clientY - svgRect.top) * scaleY;

    const node = physicsRef.current[draggedNodeId];
    if (node) {
      node.x = Math.max(30, Math.min(770, svgX));
      node.y = Math.max(30, Math.min(570, svgY));
      setPositions((prev) => ({
        ...prev,
        [draggedNodeId]: { x: node.x, y: node.y },
      }));
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (draggedNodeId) {
      try {
        (e.target as Element).releasePointerCapture?.(e.pointerId);
      } catch {}
      setDraggedNodeId(null);
      playClick(720);
    }
  };

  const bgSubtle =
    theme === 'amber-crt' ? '#120e04' : theme === 'night' ? '#1a1816' : '#f4f0e6';

  const getNodeColor = (type: GraphConnectionNode['type']) => {
    if (theme === 'amber-crt') {
      switch (type) {
        case 'research':
          return '#ffd24d';
        case 'project':
          return '#ffb000';
        case 'concept':
          return '#cc8c00';
        case 'technology':
          return '#996800';
      }
    }
    if (theme === 'night') {
      switch (type) {
        case 'research':
          return '#f43f5e'; // Rose Crimson
        case 'project':
          return '#38bdf8'; // Sky Blue
        case 'concept':
          return '#fbbf24'; // Amber Gold
        case 'technology':
          return '#cbd5e1'; // Warm Slate
      }
    }
    // Archival Paper (light mode)
    switch (type) {
      case 'research':
        return '#881337'; // Oxblood / Venetian Crimson
      case 'project':
        return '#1e3a5f'; // Prussian Cobalt
      case 'concept':
        return '#92400e'; // Ochre Amber
      case 'technology':
        return '#44403c'; // Slate / Charcoal
    }
  };

  // Intelligent angular clearance label positioning:
  // Dynamically computes the optimal angle around the node that maximizes angular clearance
  // from incident connecting edges while harmonizing with outward celestial radial expansion,
  // completely preventing collisions between text labels, lines, and adjacent nodes.
  const getLabelPlacement = (
    nodeId: string,
    nodeX: number,
    nodeY: number,
    isSelected: boolean
  ) => {
    const nodeData = connectionsGraphData.find((n) => n.id === nodeId);
    const connectedIds = nodeData ? nodeData.connections : [];

    // Find all incident edges (bidirectional)
    const neighborCoords: { x: number; y: number }[] = [];
    connectedIds.forEach((cId) => {
      const p = positions[cId] || initialPositions[cId];
      if (p) neighborCoords.push(p);
    });
    connectionsGraphData.forEach((other) => {
      if (other.id !== nodeId && other.connections.includes(nodeId) && !connectedIds.includes(other.id)) {
        const p = positions[other.id] || initialPositions[other.id];
        if (p) neighborCoords.push(p);
      }
    });

    let outwardAngle = Math.atan2(nodeY - 300, nodeX - 400);
    if (outwardAngle < 0) outwardAngle += 2 * Math.PI;

    let bestAngle: number;

    if (neighborCoords.length === 0) {
      bestAngle = outwardAngle;
    } else {
      // Calculate angles from this node to each neighbor in [0, 2*PI)
      const angles: number[] = [];
      neighborCoords.forEach((nbr) => {
        let a = Math.atan2(nbr.y - nodeY, nbr.x - nodeX);
        if (a < 0) a += 2 * Math.PI;
        angles.push(a);
      });
      angles.sort((a, b) => a - b);

      const k = angles.length;
      const minClearance = (55 * Math.PI) / 180; // 55 degrees safe clearance

      // Check if outward radial direction falls inside a wide gap with >= 55 deg clearance
      let outwardSafe = false;
      for (let i = 0; i < k; i++) {
        const a1 = angles[i];
        const a2 = i === k - 1 ? angles[0] + 2 * Math.PI : angles[i + 1];
        let o = outwardAngle;
        if (o < a1) o += 2 * Math.PI;
        if (o >= a1 + minClearance && o <= a2 - minClearance) {
          // Verify canvas boundary containment for outward direction
          const candX = nodeX + Math.cos(outwardAngle) * 26;
          const candY = nodeY + Math.sin(outwardAngle) * 26;
          if (candX >= 45 && candX <= 755 && candY >= 25 && candY <= 575) {
            outwardSafe = true;
            break;
          }
        }
      }

      if (outwardSafe) {
        bestAngle = outwardAngle;
      } else {
        // Find the gap bisector that maximizes clearance and stays in bounds
        interface GapOption {
          score: number;
          bisector: number;
        }
        const gaps: GapOption[] = [];

        for (let i = 0; i < k; i++) {
          const nextA = i === k - 1 ? angles[0] + 2 * Math.PI : angles[i + 1];
          const gapSize = nextA - angles[i];
          const bisector = (angles[i] + gapSize / 2) % (2 * Math.PI);

          const candX = nodeX + Math.cos(bisector) * 26;
          const candY = nodeY + Math.sin(bisector) * 26;
          const inBounds = candX >= 45 && candX <= 755 && candY >= 25 && candY <= 575;

          const score = gapSize * (inBounds ? 1.0 : 0.2);
          gaps.push({ score, bisector });
        }

        gaps.sort((a, b) => b.score - a.score);
        bestAngle = gaps[0].bisector;
      }
    }

    const cosA = Math.cos(bestAngle);
    const sinA = Math.sin(bestAngle);
    const haloRadius = isSelected ? 22 : 16;

    let x = nodeX;
    let y = nodeY;
    let anchor: 'start' | 'middle' | 'end' = 'middle';

    if (Math.abs(cosA) <= 0.38) {
      // Primarily vertical: above or below
      anchor = 'middle';
      if (sinA < 0) {
        y = nodeY - haloRadius;
      } else {
        y = nodeY + haloRadius + 3;
      }
    } else if (cosA > 0.38) {
      // Outward right
      anchor = 'start';
      x = nodeX + haloRadius;
      y = nodeY + sinA * 6 + 3;
    } else {
      // Outward left
      anchor = 'end';
      x = nodeX - haloRadius;
      y = nodeY + sinA * 6 + 3;
    }

    // Boundary containment within 800x600 SVG canvas
    y = Math.max(16, Math.min(586, y));
    if (anchor === 'middle') {
      x = Math.max(50, Math.min(750, x));
    } else if (anchor === 'start') {
      x = Math.min(715, x);
    } else {
      x = Math.max(85, x);
    }

    return { x, y, anchor };
  };

  return (
    <section
      ref={sectionRef}
      id="connections-graph"
      className={`py-20 border-t border-paper-border-subtle relative bg-paper-bg-base transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative">
        {/* Oversized Low-Contrast Display Numeral */}
        <div
          aria-hidden="true"
          className="text-8xl sm:text-9xl md:text-[11rem] font-serif font-black text-ink-dim/10 dark:text-ink-dim/15 select-none pointer-events-none absolute -top-10 sm:-top-14 right-4 sm:right-8 z-0 leading-none"
        >
          10
        </div>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10">
          <div className="space-y-3">
            <div className="text-[11px] font-mono tracking-[0.2em] uppercase text-ink-muted">
              § 10 • Dynamical Network
            </div>
            <MaskedReveal>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink-primary tracking-tight">
                § 10. Harmonic Topological Lattice
              </h2>
            </MaskedReveal>
            <MaskedReveal delayMs={150}>
              <p className="font-serif italic text-ink-muted text-sm sm:text-base">
                Draggable Force-Directed Topology — Relational Map of Mathematical Concepts, Treatises, &amp; Toolchains
              </p>
            </MaskedReveal>
          </div>

          {/* Archival Legend */}
          <div className="flex flex-wrap gap-3 p-2.5 rounded border border-paper-border-strong bg-paper-bg-subtle text-xs font-mono self-start md:self-auto">
            <div className="flex items-center space-x-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: getNodeColor('research') }}
              />
              <span className="text-ink-secondary">Research Area</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: getNodeColor('project') }}
              />
              <span className="text-ink-secondary">Treatise / Project</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: getNodeColor('concept') }}
              />
              <span className="text-ink-secondary">Mathematical Concept</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: getNodeColor('technology') }}
              />
              <span className="text-ink-secondary">Toolchain</span>
            </div>
          </div>
        </div>

        <p className="font-serif text-sm text-ink-secondary leading-relaxed max-w-3xl">
          Explore the relationships between theoretical mathematics, active research repositories, core mathematical concepts (Lagrangian relaxation, persistent homology), and verified toolchains. <strong>Click and drag nodes</strong> to displace the spring-mass physics lattice; hover to isolate incident subgraphs.
        </p>

        {/* Oxford Rule Divider */}
        <hr className="oxford-rule" />

        {/* Celestial Topology Chart & Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* SVG Celestial Chart Map */}
          <div className="lg:col-span-8 bg-paper-bg-subtle rounded border border-paper-border-strong p-4 relative overflow-hidden flex items-center justify-center min-h-[480px]">
            <svg
              ref={svgRef}
              data-reticle-cursor="true"
              viewBox="0 0 800 600"
              className="w-full h-auto max-h-[580px] select-none touch-none"
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            >
              {/* Concentric Celestial Orbit Lines */}
              <circle
                cx="400"
                cy="300"
                r="160"
                stroke={theme === 'amber-crt' ? '#805800' : theme === 'night' ? '#5c5449' : '#7c6f5d'}
                strokeWidth="1.2"
                strokeDasharray="3 3"
                fill="none"
                opacity={theme === 'paper' ? 0.75 : 0.60}
              />
              <circle
                cx="400"
                cy="300"
                r="210"
                stroke={theme === 'amber-crt' ? '#805800' : theme === 'night' ? '#5c5449' : '#7c6f5d'}
                strokeWidth="1.4"
                strokeDasharray="4 4"
                fill="none"
                opacity={theme === 'paper' ? 0.85 : 0.65}
              />
              <circle
                cx="400"
                cy="300"
                r="260"
                stroke={theme === 'amber-crt' ? '#805800' : theme === 'night' ? '#5c5449' : '#7c6f5d'}
                strokeWidth="1.2"
                strokeDasharray="3 3"
                fill="none"
                opacity={theme === 'paper' ? 0.75 : 0.60}
              />

              {/* Render edges */}
              {edges.map((edge) => {
                const sPos = positions[edge.source] || initialPositions[edge.source];
                const tPos = positions[edge.target] || initialPositions[edge.target];
                if (!sPos || !tPos) return null;

                const isConnectedToActive =
                  activeNode && (edge.source === activeNode.id || edge.target === activeNode.id);
                const isDimmed = activeNode && !isConnectedToActive;

                return (
                  <line
                    key={edge.id}
                    x1={sPos.x}
                    y1={sPos.y}
                    x2={tPos.x}
                    y2={tPos.y}
                    stroke={
                      isConnectedToActive
                        ? theme === 'amber-crt'
                          ? '#ffd24d'
                          : theme === 'night'
                          ? '#f43f5e'
                          : '#881337'
                        : theme === 'amber-crt'
                        ? '#593e03'
                        : theme === 'night'
                        ? '#5a5043'
                        : '#6b5f4d'
                    }
                    strokeWidth={isConnectedToActive ? 2.4 : 1.0}
                    strokeOpacity={isConnectedToActive ? 0.95 : isDimmed ? 0.50 : 0.70}
                    strokeDasharray={isConnectedToActive ? undefined : '2 3'}
                    className="transition-opacity duration-200"
                  />
                );
              })}

              {/* Render nodes with active/selected node sorted to the top */}
              {[...connectionsGraphData]
                .sort((a, b) => {
                  const aActive = a.id === activeId ? 1 : 0;
                  const bActive = b.id === activeId ? 1 : 0;
                  return aActive - bActive;
                })
                .map((node) => {
                  const pos = positions[node.id] || initialPositions[node.id];
                  if (!pos) return null;

                  const isSelected = selectedNodeId === node.id;
                  const isHovered = hoveredNodeId === node.id;
                  const isIncident = incidentSubgraphNodeIds.has(node.id);
                  const isDimmed = activeNode !== null && !isIncident;

                  const color = getNodeColor(node.type);
                  const labelPos = getLabelPlacement(node.id, pos.x, pos.y, isSelected || isHovered);

                  return (
                    <g
                      key={node.id}
                      role="button"
                      tabIndex={0}
                      aria-label={`${node.name} (${node.type})`}
                      className="cursor-grab active:cursor-grabbing group focus:outline-none"
                      style={{
                        opacity: isDimmed ? 0.80 : 1,
                        transition: 'opacity 200ms ease-out',
                      }}
                      onClick={() => setSelectedNodeId(node.id)}
                      onMouseEnter={() => setHoveredNodeId(node.id)}
                      onMouseLeave={() => setHoveredNodeId(null)}
                      onPointerDown={(e) => handlePointerDown(node.id, e)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSelectedNodeId(node.id);
                          playClick(900);
                        }
                      }}
                    >
                      {/* Outer harmonic halo for active node */}
                      {(isSelected || isHovered) && (
                        <circle
                          cx={pos.x}
                          cy={pos.y}
                          r={15}
                          fill={
                            theme === 'amber-crt'
                              ? 'rgba(255, 210, 77, 0.1)'
                              : theme === 'night'
                              ? 'rgba(244, 63, 94, 0.12)'
                              : 'rgba(136, 19, 55, 0.08)'
                          }
                          stroke={
                            theme === 'amber-crt'
                              ? '#ffd24d'
                              : theme === 'night'
                              ? '#f43f5e'
                              : '#881337'
                          }
                          strokeWidth="1.8"
                          strokeDasharray="2 2"
                        />
                      )}

                      {/* Node circle - zero cx/cy transition to prevent detachment during dragging */}
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r={isSelected || isHovered ? 8 : isIncident ? 6 : 5}
                        fill={color}
                        stroke={bgSubtle}
                        strokeWidth="1.8"
                      />

                      {/* Boundary-safe node label with high-contrast background stroke halo */}
                      <text
                        x={labelPos.x}
                        y={labelPos.y}
                        textAnchor={labelPos.anchor}
                        stroke={bgSubtle}
                        strokeWidth="3.5"
                        strokeLinejoin="round"
                        paintOrder="stroke fill"
                        className={`text-[9.5px] font-mono select-none pointer-events-none transition-colors ${
                          isSelected || isHovered
                            ? theme === 'amber-crt'
                              ? 'fill-[#ffd24d] font-bold'
                              : theme === 'night'
                              ? 'fill-[#f43f5e] font-bold'
                              : 'fill-[#881337] font-bold'
                            : isIncident
                            ? 'fill-ink-primary font-bold'
                            : 'fill-ink-primary font-semibold'
                        }`}
                      >
                        {node.name}
                      </text>
                    </g>
                  );
                })}
            </svg>
          </div>

          {/* Topological Inspector Panel */}
          <div className="lg:col-span-4 space-y-4">
            {activeNode ? (
              <div className="p-5 rounded border border-paper-border-strong bg-paper-bg-subtle space-y-4 shadow-sm">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-ink-muted">
                      {activeNode.type}
                    </span>
                    <span className="text-[10px] font-mono text-academic-amber">
                      {activeNode.connections.length} incident edges
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-ink-primary mt-1">
                    {activeNode.name}
                  </h3>
                </div>

                <p className="font-serif text-xs text-ink-secondary leading-relaxed">
                  {activeNode.description}
                </p>

                <div className="pt-2 border-t border-paper-border-subtle space-y-2">
                  <span className="text-[10px] font-mono text-ink-muted uppercase tracking-wider block">
                    Topological Incident Neighbors:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeNode.connections.map((targetId) => {
                      const targetNode = connectionsGraphData.find((n) => n.id === targetId);
                      if (!targetNode) return null;
                      return (
                        <button
                          key={targetId}
                          onClick={() => {
                            playClick(850);
                            setSelectedNodeId(targetId);
                          }}
                          className="px-2 py-0.5 rounded text-[10px] font-mono bg-paper-bg-base border border-paper-border-subtle text-ink-secondary hover:text-ink-primary hover:border-paper-border-strong cursor-pointer transition-colors"
                        >
                          {targetNode.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="text-[10px] text-ink-muted font-mono italic">
                  Drag node with cursor to verify spring-mass equilibration.
                </div>
              </div>
            ) : (
              <div className="p-5 rounded border border-paper-border-subtle bg-paper-bg-subtle text-xs font-serif text-ink-muted italic">
                Select or hover any topological node to inspect connections and properties.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
