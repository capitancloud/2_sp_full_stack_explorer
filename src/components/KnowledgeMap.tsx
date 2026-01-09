import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { knowledgeNodes, categories, CategoryType, KnowledgeNode } from '@/data/knowledgeData';
import { 
  Globe, Monitor, Server, Database, Cloud, Shield, TestTube, GitBranch,
  ZoomIn, ZoomOut, Home
} from 'lucide-react';
import NodeCard from './NodeCard';
import ConnectionLines from './ConnectionLines';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Globe, Monitor, Server, Database, Cloud, Shield, TestTube, GitBranch,
};

interface KnowledgeMapProps {
  onNodeSelect: (node: KnowledgeNode) => void;
  highlightedNodes?: string[];
}

const KnowledgeMap = ({ onNodeSelect, highlightedNodes = [] }: KnowledgeMapProps) => {
  const [zoom, setZoom] = useState(1);
  const [currentView, setCurrentView] = useState<string>('fullstack');

  const centralNode = knowledgeNodes.find(n => n.id === 'fullstack')!;
  const currentNode = knowledgeNodes.find(n => n.id === currentView)!;
  
  const childNodes = currentNode?.children
    ? knowledgeNodes.filter(n => currentNode.children?.includes(n.id))
    : [];

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 1.5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));
  const handleReset = () => {
    setZoom(1);
    setCurrentView('fullstack');
  };

  const handleNodeClick = useCallback((node: KnowledgeNode) => {
    onNodeSelect(node);
    if (node.children && node.children.length > 0) {
      setCurrentView(node.id);
    }
  }, [onNodeSelect]);

  const getNodePosition = (index: number, total: number) => {
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
    const radius = 220;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  };

  const isHighlighted = (nodeId: string) => 
    highlightedNodes.length === 0 || highlightedNodes.includes(nodeId);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Zoom Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <button
          onClick={handleZoomIn}
          className="glass-panel p-2 hover:bg-secondary/50 transition-colors"
        >
          <ZoomIn className="w-5 h-5 text-foreground" />
        </button>
        <button
          onClick={handleZoomOut}
          className="glass-panel p-2 hover:bg-secondary/50 transition-colors"
        >
          <ZoomOut className="w-5 h-5 text-foreground" />
        </button>
        <button
          onClick={handleReset}
          className="glass-panel p-2 hover:bg-secondary/50 transition-colors"
        >
          <Home className="w-5 h-5 text-foreground" />
        </button>
      </div>

      {/* Breadcrumb */}
      {currentView !== 'fullstack' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-4 left-4 z-20"
        >
          <button
            onClick={() => setCurrentView('fullstack')}
            className="glass-panel px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Torna alla mappa principale
          </button>
        </motion.div>
      )}

      {/* Map Container */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{ scale: zoom }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="relative" style={{ width: '600px', height: '600px' }}>
          {/* Connection Lines */}
          <ConnectionLines
            centralNode={currentNode}
            childNodes={childNodes}
            getPosition={getNodePosition}
          />

          {/* Central Node */}
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <NodeCard
              node={currentNode}
              isCentral
              isHighlighted={isHighlighted(currentNode.id)}
              onClick={() => onNodeSelect(currentNode)}
            />
          </motion.div>

          {/* Child Nodes */}
          <AnimatePresence mode="wait">
            {childNodes.map((node, index) => {
              const pos = getNodePosition(index, childNodes.length);
              return (
                <motion.div
                  key={node.id}
                  className="absolute left-1/2 top-1/2 z-10"
                  initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1, 
                    x: pos.x - 80, 
                    y: pos.y - 50 
                  }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ 
                    type: 'spring', 
                    stiffness: 200, 
                    damping: 20,
                    delay: index * 0.05 
                  }}
                >
                  <NodeCard
                    node={node}
                    isHighlighted={isHighlighted(node.id)}
                    onClick={() => handleNodeClick(node)}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default KnowledgeMap;
