import React, { useState, useMemo } from 'react';
import { connectionsGraphData } from '../../data';
import type { GraphConnectionNode } from '../../types/content';
import { Sparkles } from 'lucide-react';

export const ConnectionsGraphSection: React.FC = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('p-numlang');
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const activeId = hoveredNodeId || selectedNodeId;
  const activeNode = connectionsGraphData.find((n) => n.id === activeId) || null;

  // Calculate layout coordinates in a circular topological ring with radial stratification
  const nodePositions = useMemo(() => {
    const total = connectionsGraphData.length;
    const positions: Record<string, { x: number; y: number }> = {};
    const centerX = 400;
    const centerY = 300;

    // Distribute nodes in aesthetic harmonic orbit
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

  // Compute edges list
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
        return '#f59e0b'; // Amber
      case 'project':
        return '#f8fafc'; // White / Slate-50
      case 'concept':
        return '#fb923c'; // Orange
      case 'technology':
        return '#94a3b8'; // Slate-400
    }
  };

  return (
    <section id="connections-graph" className="py-20 border-t border-border-subtle relative bg-bg-surface/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs font-mono text-amber-500 uppercase tracking-widest">
              <span>08 // Interactive Topology</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-mono text-text-primary uppercase tracking-tight">
              Research Connections Graph
            </h2>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 p-2 rounded-lg bg-bg-surface border border-border-subtle text-xs font-mono self-start md:self-auto">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-text-secondary">Research Area</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-100" />
              <span className="text-text-secondary">Project</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-400" />
              <span className="text-text-secondary">Mathematical Concept</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
              <span className="text-text-secondary">Technology</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-text-secondary font-mono max-w-3xl leading-relaxed">
          Explore the relationships between theoretical mathematics, active research repositories, core mathematical concepts (Lagrangian relaxation, persistent homology), and verified toolchains. Click or hover on any node to highlight connections.
        </p>

        {/* Visual Graph Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* SVG Canvas Map */}
          <div className="lg:col-span-8 bg-bg-surface rounded-xl border border-border-medium p-4 relative overflow-hidden flex items-center justify-center min-h-[480px]">
            <svg
              viewBox="0 0 800 600"
              className="w-full h-auto max-h-[580px] select-none"
              style={{ filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.4))' }}
            >
              {/* Background ambient concentric coordinate circles */}
              <circle cx="400" cy="300" r="160" stroke="#1c222c" strokeWidth="1" strokeDasharray="3 3" fill="none" />
              <circle cx="400" cy="300" r="210" stroke="#1c222c" strokeWidth="1" strokeDasharray="3 3" fill="none" />
              <circle cx="400" cy="300" r="240" stroke="#1c222c" strokeWidth="1" strokeDasharray="3 3" fill="none" />

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
                    stroke={isConnectedToActive ? '#f59e0b' : '#222936'}
                    strokeWidth={isConnectedToActive ? 2 : 1}
                    strokeOpacity={isConnectedToActive ? 0.9 : 0.4}
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
                    {/* Outer glow ring for active node */}
                    {(isSelected || isHovered) && (
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r={14}
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="1.5"
                        strokeDasharray="2 2"
                        className="animate-pulse"
                      />
                    )}

                    {/* Node circle */}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={isSelected || isHovered ? 7 : isConnectedToActive ? 5.5 : 4}
                      fill={color}
                      stroke="#07080a"
                      strokeWidth="1.5"
                      className="transition-all duration-150"
                    />

                    {/* Node label */}
                    <text
                      x={pos.x}
                      y={pos.y + 16}
                      textAnchor="middle"
                      className={`text-[9px] font-mono transition-colors pointer-events-none ${
                        isSelected || isHovered
                          ? 'fill-amber-400 font-bold'
                          : isConnectedToActive
                          ? 'fill-slate-200'
                          : 'fill-slate-500'
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
              <div className="p-6 rounded-xl bg-bg-surface border border-border-medium space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    {activeNode.type}
                  </span>
                  <span className="text-xs font-mono text-text-dim">
                    ID: {activeNode.id}
                  </span>
                </div>

                <div>
                  <h3 className="font-mono text-xl font-bold text-text-primary">
                    {activeNode.name}
                  </h3>
                  <p className="text-xs text-text-secondary font-sans leading-relaxed pt-2">
                    {activeNode.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-border-subtle space-y-2">
                  <div className="text-xs font-mono text-amber-500 font-semibold flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Direct Graph Connections ({activeNode.connections.length})</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {activeNode.connections.map((connId) => {
                      const linked = connectionsGraphData.find((n) => n.id === connId);
                      if (!linked) return null;
                      return (
                        <button
                          key={connId}
                          onClick={() => setSelectedNodeId(connId)}
                          className="text-xs font-mono px-2.5 py-1 rounded bg-bg-elevated border border-border-subtle hover:border-amber-500/50 text-text-secondary hover:text-amber-400 transition-colors text-left"
                        >
                          {linked.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2 text-[10px] font-mono text-text-dim">
                  Tip: Click any connected node above to pivot focus.
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-bg-surface border border-border-subtle text-center text-xs font-mono text-text-muted">
                Select any node on the graph to inspect structural relationships.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
