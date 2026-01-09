import { motion, AnimatePresence } from 'framer-motion';
import { KnowledgeNode, categories } from '@/data/knowledgeData';
import { X, AlertCircle, Link2, Lightbulb, Target } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DetailPanelProps {
  node: KnowledgeNode | null;
  onClose: () => void;
}

const DetailPanel = ({ node, onClose }: DetailPanelProps) => {
  if (!node) return null;

  const category = categories[node.category];

  return (
    <AnimatePresence>
      {node && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed right-0 top-0 h-full w-full max-w-md glass-panel border-l border-border/50 z-30"
        >
          <ScrollArea className="h-full">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <span className={`text-xs font-medium uppercase tracking-wider text-${node.category}`}>
                    {category.name}
                  </span>
                  <h2 className="text-2xl font-display font-bold text-foreground mt-1">
                    {node.name}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Description */}
              <div className="mb-6">
                <p className="text-muted-foreground leading-relaxed">
                  {node.description}
                </p>
              </div>

              {/* Role */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Target className={`w-4 h-4 text-${node.category}`} />
                  <h3 className="text-sm font-semibold text-foreground">Ruolo nel Sistema</h3>
                </div>
                <p className="text-sm text-muted-foreground pl-6">
                  {node.role}
                </p>
              </div>

              {/* Relations */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Link2 className={`w-4 h-4 text-${node.category}`} />
                  <h3 className="text-sm font-semibold text-foreground">Relazioni</h3>
                </div>
                <div className="flex flex-wrap gap-2 pl-6">
                  {node.relations.map(rel => (
                    <span
                      key={rel}
                      className="px-2 py-1 text-xs rounded-md bg-secondary text-secondary-foreground"
                    >
                      {rel}
                    </span>
                  ))}
                </div>
              </div>

              {/* Common Errors */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-destructive" />
                  <h3 className="text-sm font-semibold text-foreground">Errori Comuni</h3>
                </div>
                <ul className="space-y-1 pl-6">
                  {node.commonErrors.map((error, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-destructive mt-1">•</span>
                      {error}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Example */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className={`w-4 h-4 text-${node.category}`} />
                  <h3 className="text-sm font-semibold text-foreground">Esempio Pratico</h3>
                </div>
                <div className="pl-6">
                  <div className="p-3 rounded-lg bg-secondary/50 border border-border/50">
                    <code className="text-xs text-muted-foreground font-mono break-words whitespace-pre-wrap">
                      {node.example}
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DetailPanel;
