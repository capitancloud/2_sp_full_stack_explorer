import { useState, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { knowledgeNodes, categories, KnowledgeNode } from '@/data/knowledgeData';
import { 
  Globe, Monitor, Server, Database, Cloud, Shield, TestTube, GitBranch,
  ChevronRight, ArrowLeft
} from 'lucide-react';
import NodeCard from './NodeCard';
import CategoryCard from './CategoryCard';
import { useKnowledgeNodes } from '@/hooks/useKnowledgeNodes';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Globe, Monitor, Server, Database, Cloud, Shield, TestTube, GitBranch,
};

interface KnowledgeMapProps {
  onNodeSelect: (node: KnowledgeNode) => void;
  highlightedNodes?: string[];
  initialView?: string;
  onViewChange?: (viewId: string) => void;
}

const KnowledgeMap = ({ onNodeSelect, highlightedNodes = [], initialView, onViewChange }: KnowledgeMapProps) => {
  const [currentView, setCurrentView] = useState<string>(initialView || 'fullstack');
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  
  const { getNodeById, getChildNodes, getRelatedNodes } = useKnowledgeNodes();
  
  // Sincronizza la vista quando cambia dall'esterno
  useEffect(() => {
    if (initialView && initialView !== currentView) {
      setCurrentView(initialView);
    }
  }, [initialView, currentView]);
  
  const handleViewChange = useCallback((viewId: string) => {
    setCurrentView(viewId);
    onViewChange?.(viewId);
  }, [onViewChange]);

  // Memoizza i nodi per evitare ricalcoli
  const centralNode = useMemo(() => getNodeById('fullstack')!, [getNodeById]);
  const currentNode = useMemo(() => getNodeById(currentView)!, [getNodeById, currentView]);
  const childNodes = useMemo(() => getChildNodes(currentView), [getChildNodes, currentView]);
  const relatedNodeIds = useMemo(
    () => getRelatedNodes(hoveredNodeId),
    [getRelatedNodes, hoveredNodeId]
  );

  const handleNodeClick = useCallback((node: KnowledgeNode) => {
    onNodeSelect(node);
    if (node.children && node.children.length > 0) {
      handleViewChange(node.id);
    }
  }, [onNodeSelect, handleViewChange]);

  const handleBack = useCallback(() => {
    handleViewChange('fullstack');
  }, [handleViewChange]);

  const isHighlighted = useCallback((nodeId: string) => 
    highlightedNodes.length === 0 || highlightedNodes.includes(nodeId),
    [highlightedNodes]
  );

  const isRelated = useCallback((nodeId: string) => 
    hoveredNodeId !== null && relatedNodeIds.includes(nodeId),
    [hoveredNodeId, relatedNodeIds]
  );

  const isMainView = currentView === 'fullstack';

  return (
    <div className="relative w-full h-full overflow-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-background/80 border-b border-border/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {!isMainView && (
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={handleBack}
                  className="glass-panel p-2 hover:bg-secondary/50 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-foreground" />
                </motion.button>
              )}
              <div>
                <h1 className="text-2xl font-display font-bold text-foreground">
                  {isMainView ? 'Full Stack Explorer' : currentNode.name}
                </h1>
                {!isMainView && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {currentNode.description}
                  </p>
                )}
              </div>
            </div>
            {isMainView && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 glass-panel px-4 py-2"
              >
                <Globe className="w-5 h-5 text-central" />
                <span className="text-sm font-medium">{childNodes.length} categorie disponibili</span>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        {isMainView ? (
          /* Main View - Category Cards */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto"
          >
            {/* Central Node Card - Featured */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0 }}
              className="md:col-span-2 lg:col-span-2 xl:col-span-2"
            >
              <motion.button
                onClick={() => handleNodeClick(centralNode)}
                className="w-full h-full glass-panel p-8 rounded-2xl border-2 border-central/30 hover:border-central/60 transition-all duration-300 group relative overflow-hidden"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" 
                     style={{ background: 'linear-gradient(to bottom right, hsl(var(--central) / 0.1), transparent)' }} />
                <div className="relative z-10 flex flex-col items-center justify-center text-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-central/20 flex items-center justify-center group-hover:bg-central/30 transition-colors">
                    <Globe className="w-10 h-10 text-central" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                      {centralNode.name}
                    </h2>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {centralNode.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-central text-sm font-medium mt-2">
                    <span>Esplora le categorie</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.button>
            </motion.div>

            {/* Category Cards */}
            {childNodes.map((node, index) => {
              const category = categories[node.category];
              const Icon = iconMap[category.icon];
              
              return (
                <CategoryCard
                  key={node.id}
                  node={node}
                  icon={Icon}
                  highlighted={isHighlighted(node.id)}
                  related={isRelated(node.id)}
                  index={index}
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  onClick={() => handleNodeClick(node)}
                />
              );
            })}
          </motion.div>
        ) : (
          /* Detail View - Subcategory Grid */
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ 
              duration: 0.4,
              ease: [0.4, 0, 0.2, 1]
            }}
            className="max-w-6xl mx-auto"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence mode="popLayout">
                {childNodes.map((node, index) => {
                  const highlighted = isHighlighted(node.id);
                  const related = isRelated(node.id);
                  return (
                    <motion.div
                      key={node.id}
                      layout
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ 
                        opacity: highlighted ? 1 : 0.6, 
                        scale: related ? 1.05 : 1,
                        y: 0
                      }}
                      exit={{ 
                        opacity: 0, 
                        scale: 0.8,
                        transition: { duration: 0.2 }
                      }}
                      transition={{ 
                        delay: index * 0.05,
                        layout: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
                        type: "spring",
                        stiffness: 300,
                        damping: 30
                      }}
                      whileHover={{ 
                        scale: 1.05,
                        transition: { duration: 0.2 }
                      }}
                    >
                      <NodeCard
                        node={node}
                        isHighlighted={highlighted}
                        onClick={() => handleNodeClick(node)}
                      />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default KnowledgeMap;
