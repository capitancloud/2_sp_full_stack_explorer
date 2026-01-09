import { motion } from 'framer-motion';
import { KnowledgeNode, categories, CategoryType } from '@/data/knowledgeData';
import { 
  Globe, Monitor, Server, Database, Cloud, Shield, TestTube, GitBranch,
  ChevronRight
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Globe, Monitor, Server, Database, Cloud, Shield, TestTube, GitBranch,
};

interface NodeCardProps {
  node: KnowledgeNode;
  isCentral?: boolean;
  isHighlighted?: boolean;
  onClick: () => void;
}

const NodeCard = ({ node, isCentral, isHighlighted = true, onClick }: NodeCardProps) => {
  const category = categories[node.category];
  const Icon = iconMap[category.icon];
  const hasChildren = node.children && node.children.length > 0;

  const nodeClass = `node-${node.category}`;

  return (
    <motion.button
      className={`${nodeClass} ${isCentral ? 'w-44 h-44 rounded-full' : 'w-40 min-h-[100px]'} 
        flex flex-col items-center justify-center gap-2 text-center
        ${!isHighlighted ? 'opacity-30' : ''}`}
      onClick={onClick}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
    >
      {Icon && (
        <Icon className={`${isCentral ? 'w-10 h-10' : 'w-6 h-6'} text-${node.category}`} />
      )}
      <span className={`${isCentral ? 'text-base' : 'text-sm'} font-display font-semibold text-foreground leading-tight`}>
        {node.name}
      </span>
      {hasChildren && !isCentral && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
          <span>Esplora</span>
          <ChevronRight className="w-3 h-3" />
        </div>
      )}
    </motion.button>
  );
};

export default NodeCard;
