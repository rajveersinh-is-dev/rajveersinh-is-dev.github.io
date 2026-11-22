import React, { useState, useMemo } from 'react';
import { connectionsGraphData } from '../../data';
import type { GraphConnectionNode } from '../../types/content';
import { useIntersectionObserver } from '../../utils/intersectionObserver';

export const ConnectionsGraphSection: React.FC = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('p-numlang');
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [sectionRef, isVisible] = useIntersectionObserver<HTMLElement>();

  const activeId = hoveredNodeId || selectedNodeId;
  const activeNode = connectionsGraphData.find((n) => n.id === activeId) || null;

  // Calculate layout coordinates in a celestial harmonic orbit
  const nodePositions = useMemo(() => {
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

  // Compute undirected edges list
  const edges = useMemo(() => {
    const edgeList: { id: string; source: string; target: string }[] = [];
    const seen = new Set<string>();

    connectionsGraphData.forEach((source) => {
      source.connections.forEach((targetId) => {
        const edgeKey = [source.id, targetId].sort().join('---');
        if (!seen.has(edgeKey) && nodePositions[targetId]) {
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
  }, [nodePositions]);

  const getNodeColor = (type: GraphConnectionNode['type']) => {
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

  return (
    <section
      ref={sectionRef}
      id="connections-graph"
      className={`py-20 border-t border-paper-border-subtle relative bg-paper-bg-base transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-3">
            <div className="text-[11px] font-mono tracking-[0.2em] uppercase text-ink-muted">
              § 10
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink-primary tracking-tight">
              § 10. Harmonic Topological Lattice
            </h2>
            <p className="font-serif italic text-ink-muted text-sm sm:text-base">
              Research Connections Graph — Relational Map of Mathematical Concepts, Treatises, &amp; Toolchains
            </p>
          </div>

          {/* Archival Legend */}
          <div className="flex flex-wrap gap-3 p-2.5 rounded border border-paper-border-strong bg-paper-bg-subtle text-xs font-mono self-start md:self-auto">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#881337]" />
              <span className="text-ink-secondary">Research Area</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1e3a5f]" />
              <span className="text-ink-secondary">Treatise / Project</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#92400e]" />
              <span className="text-ink-secondary">Mathematical Concept</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#44403c]" />
              <span className="text-ink-secondary">Toolchain</span>
            </div>
          </div>
        </div>

        <p className="font-serif text-sm text-ink-secondary leading-relaxed max-w-3xl">
          Explore the relationships between theoretical mathematics, active research repositories, core mathematical concepts (Lagrangian relaxation, persistent homology), and verified toolchains. Click or hover on any node to highlight connections.
        </p>

        {/* Oxford Rule Divider */}
        <hr className="oxford-rule" />

        {/* Celestial Topology Chart & Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* SVG Celestial Chart Map */}
          <div className="lg:col-span-8 bg-paper-bg-subtle rounded border border-paper-border-strong p-4 relative overflow-hidden flex items-center justify-center min-h-[480px]">
            <svg
              viewBox="0 0 800 600"
              className="w-full h-auto max-h-[580px] select-none"
            >
              {/* Concentric Celestial Orbit Lines */}
              <circle cx="400" cy="300" r="160" stroke="currentColor" className="text-paper-border-subtle" strokeWidth="1" strokeDasharray="3 3" fill="none" />
              <circle cx="400" cy="300" r="185" stroke="currentColor" className="text-paper-border-subtle" strokeWidth="0.75" strokeDasharray="2 4" fill="none" />
              <circle cx="400" cy="300" r="210" stroke="currentColor" className="text-paper-border-strong" strokeWidth="1" strokeDasharray="4 4" fill="none" />
              <circle cx="400" cy="300" r="240" stroke="currentColor" className="text-paper-border-subtle" strokeWidth="1" strokeDasharray="3 3" fill="none" />

              {/* Render edges */}
              {edges.map((edge) => {
                const sPos = nodePositions[edge.source];
                const tPos = nodePositions[edge.target];
                if (!sPos || !tPos) return null;

                const isConnectedToActive =
                  activeNode && (edge.source === activeNode.id || edge.target === activeNode.id);

                return (
                  <line
                    key={edge.id}
                    x1={sPos.x}
                    y1={sPos.y}
                    x2={tPos.x}
                    y2={tPos.y}
                    stroke={isConnectedToActive ? '#881337' : '#b8ad96'}
                    strokeWidth={isConnectedToActive ? 2 : 0.8}
                    strokeOpacity={isConnectedToActive ? 0.95 : 0.4}
                    strokeDasharray={isConnectedToActive ? undefined : '2 2'}
                    className="transition-all duration-200"
                  />
                );
              })}

              {/* Render nodes */}
              {connectionsGraphData.map((node) => {
                const pos = nodePositions[node.id];
                if (!pos) return null;

                const isSelected = selectedNodeId === node.id;
                const isHovered = hoveredNodeId === node.id;
                const isConnectedToActive =
                  activeNode && (activeNode.id === node.id || activeNode.connections.includes(node.id));

                const color = getNodeColor(node.type);

                return (
                  <g
                    key={node.id}
                    className="cursor-pointer group"
                    onClick={() => setSelectedNodeId(node.id)}
                    onMouseEnter={() => setHoveredNodeId(node.id)}
                    onMouseLeave={() => setHoveredNodeId(null)}
                  >
                    {/* Outer ring for active node */}
                    {(isSelected || isHovered) && (
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r={13}
                        fill="none"
                        stroke="#881337"
                        strokeWidth="1.5"
                        strokeDasharray="2 2"
                      />
                    )}

                    {/* Node circle */}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={isSelected || isHovered ? 7 : isConnectedToActive ? 5.5 : 4}
                      fill={color}
                      stroke="#faf7f0"
                      strokeWidth="1.5"
                      className="transition-all duration-150"
                    />

                    {/* Node label */}
                    <text
                      x={pos.x}
                      y={pos.y + 16}
                      textAnchor="middle"
                      className={`text-[9px] font-mono select-none pointer-events-none transition-colors ${
                        isSelected || isHovered
                          ? 'fill-academic-amber font-bold'
                          : isConnectedToActive
                          ? 'fill-ink-primary font-semibold'
                          : 'fill-ink-muted'
                      }`}
                    >
                      {node.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Node Inspector Panel */}
          <div className="lg:col-span-4 space-y-4">
            {activeNode ? (
              <div className="p-6 rounded border border-paper-border-strong bg-paper-bg-subtle space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-paper-border-subtle pb-2">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded border border-academic-amber/30 bg-academic-amber/10 text-academic-amber font-semibold">
                    {activeNode.type}
                  </span>
                  <span className="text-xs font-mono text-ink-muted">
                    ID: {activeNode.id}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="font-serif text-xl font-bold text-ink-primary">
                    {activeNode.name}
                  </h3>
                  <p className="font-serif text-xs text-ink-secondary leading-relaxed">
                    {activeNode.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-paper-border-subtle space-y-2">
                  <div className="text-xs font-mono text-academic-amber font-semibold flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-academic-amber inline-block" />
                    <span>Direct Relational Connections ({activeNode.connections.length})</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {activeNode.connections.map((connId) => {
                      const linked = connectionsGraphData.find((n) => n.id === connId);
                      if (!linked) return null;
                      return (
                        <button
                          key={connId}
                          onClick={() => setSelectedNodeId(connId)}
                          className="text-xs font-mono px-2.5 py-1 rounded border border-paper-border-subtle hover:border-academic-amber bg-paper-bg-base hover:bg-paper-bg-elevated text-ink-secondary hover:text-academic-amber transition-colors text-left"
                        >
                          {linked.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2 text-[10px] font-mono text-ink-muted">
                  <span>Click any connected node above to pivot focus in lattice.</span>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded border border-paper-border-subtle bg-paper-bg-subtle text-center text-xs font-mono text-ink-muted">
                Select any node on the graph to inspect structural relationships.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
