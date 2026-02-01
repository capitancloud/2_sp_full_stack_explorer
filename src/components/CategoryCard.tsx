import { motion } from 'framer-motion';
import { KnowledgeNode, categories } from '@/data/knowledgeData';
import { ChevronRight } from 'lucide-react';
import { getCategoryClasses, getCategoryGradient, getCategoryBoxShadow } from '@/utils/categoryStyles';

interface CategoryCardProps {
  node: KnowledgeNode;
  icon: React.ComponentType<{ className?: string }>;
  highlighted: boolean;
  related: boolean;
  index: number;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
}

const CategoryCard = ({
  node,
  icon: Icon,
  highlighted,
  related,
  index,
  onMouseEnter,
  onMouseLeave,
  onClick,
}: CategoryCardProps) => {
  const catClasses = getCategoryClasses(node.category);
  const gradient = getCategoryGradient(node.category);
  const boxShadow = getCategoryBoxShadow(node.category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: highlighted ? 1 : 0.5, 
        y: 0,
        scale: related ? 1.05 : 1
      }}
      transition={{ 
        delay: (index + 1) * 0.1,
        layout: { duration: 0.3 }
      }}
      layout
    >
      <motion.button
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={`w-full glass-panel p-6 rounded-2xl border-2 transition-all duration-300 group relative overflow-hidden h-full ${
          highlighted 
            ? catClasses.border
            : 'border-border/30 hover:border-border/50'
        } ${related ? 'ring-2 ring-offset-2 ring-offset-background' : ''}`}
        whileHover={{ scale: 1.05, y: -4 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: related ? boxShadow : '0 0 0px hsl(var(--foreground) / 0)',
        }}
        transition={{
          boxShadow: {
            duration: 2,
            repeat: related ? Infinity : 0,
            ease: "easeInOut"
          }
        }}
        style={{
          background: highlighted ? gradient : undefined
        }}
      >
        {/* Pulse ring per nodi correlati */}
        {related && (
          <motion.div
            className="absolute inset-0 rounded-2xl border-2"
            style={{ borderColor: `hsl(var(--${node.category}) / 0.6)` }}
            animate={{
              scale: [1, 1.1, 1.1],
              opacity: [0.6, 0, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut"
            }}
          />
        )}
        
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" 
          style={{ background: gradient }} 
        />
        <div className="relative z-10 flex flex-col items-center text-center gap-3">
          <motion.div 
            className={`w-16 h-16 rounded-xl ${catClasses.bg} flex items-center justify-center transition-colors`}
            animate={{
              scale: related ? [1, 1.1, 1] : 1,
            }}
            transition={{
              duration: 2,
              repeat: related ? Infinity : 0,
              ease: "easeInOut"
            }}
          >
            <Icon className={`w-8 h-8 ${catClasses.icon}`} />
          </motion.div>
          <div>
            <h3 className="text-lg font-display font-bold text-foreground mb-1">
              {node.name}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
              {node.description}
            </p>
          </div>
          {node.children && node.children.length > 0 && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <span>{node.children.length} argomenti</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          )}
        </div>
      </motion.button>
    </motion.div>
  );
};

export default CategoryCard;
