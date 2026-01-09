import { motion } from 'framer-motion';
import { KnowledgeNode } from '@/data/knowledgeData';

interface ConnectionLinesProps {
  centralNode: KnowledgeNode;
  childNodes: KnowledgeNode[];
  getPosition: (index: number, total: number) => { x: number; y: number };
}

const ConnectionLines = ({ centralNode, childNodes, getPosition }: ConnectionLinesProps) => {
  const centerX = 300;
  const centerY = 300;

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ overflow: 'visible' }}
    >
      <defs>
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(var(--muted-foreground) / 0.1)" />
          <stop offset="50%" stopColor="hsl(var(--muted-foreground) / 0.3)" />
          <stop offset="100%" stopColor="hsl(var(--muted-foreground) / 0.1)" />
        </linearGradient>
      </defs>
      
      {childNodes.map((node, index) => {
        const pos = getPosition(index, childNodes.length);
        const endX = centerX + pos.x;
        const endY = centerY + pos.y;
        
        // Calculate control points for curved lines
        const midX = (centerX + endX) / 2;
        const midY = (centerY + endY) / 2;
        const offsetX = (endY - centerY) * 0.15;
        const offsetY = (centerX - endX) * 0.15;
        
        const pathD = `M ${centerX} ${centerY} Q ${midX + offsetX} ${midY + offsetY} ${endX} ${endY}`;
        
        return (
          <motion.path
            key={node.id}
            d={pathD}
            stroke="url(#lineGradient)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ 
              duration: 0.8, 
              delay: index * 0.05,
              ease: 'easeOut' 
            }}
            className="connection-animated"
          />
        );
      })}
    </svg>
  );
};

export default ConnectionLines;
