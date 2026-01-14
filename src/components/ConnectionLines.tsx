import { motion } from 'framer-motion';
import { KnowledgeNode } from '@/data/knowledgeData';

interface ConnectionLinesProps {
  centralNode: KnowledgeNode;
  childNodes: KnowledgeNode[];
  getPosition: (index: number, total: number) => { 
    x: number; 
    y: number; 
    offsetX?: number; 
    offsetY?: number;
  };
}

const ConnectionLines = ({ centralNode, childNodes, getPosition }: ConnectionLinesProps) => {
  const centerX = 300; // Centro del container 600x600
  const centerY = 300;
  const CENTRAL_NODE_RADIUS = 88; // w-44 / 2 = 176px / 2 = 88px

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
        // Posizione finale: centro container + posizione calcolata + offset per centrare il nodo
        const endX = centerX + pos.x + (pos.offsetX || 0);
        const endY = centerY + pos.y + (pos.offsetY || 0);
        
        // Calcola il punto di partenza sul bordo del nodo centrale
        const angle = Math.atan2(pos.y, pos.x);
        const startX = centerX + Math.cos(angle) * CENTRAL_NODE_RADIUS;
        const startY = centerY + Math.sin(angle) * CENTRAL_NODE_RADIUS;
        
        // Calculate control points for curved lines
        const midX = (startX + endX) / 2;
        const midY = (startY + endY) / 2;
        const curveOffsetX = (endY - startY) * 0.15;
        const curveOffsetY = (startX - endX) * 0.15;
        
        const pathD = `M ${startX} ${startY} Q ${midX + curveOffsetX} ${midY + curveOffsetY} ${endX} ${endY}`;
        
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
