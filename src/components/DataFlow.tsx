import { motion } from 'framer-motion';
import { Monitor, Server, Database, ArrowRight } from 'lucide-react';

interface DataFlowProps {
  isVisible: boolean;
  onComplete?: () => void;
}

const DataFlow = ({ isVisible, onComplete }: DataFlowProps) => {
  const steps = [
    { id: 'browser', label: 'Browser', icon: Monitor, color: 'frontend', delay: 0 },
    { id: 'api', label: 'API', icon: Server, color: 'backend', delay: 0.5 },
    { id: 'backend', label: 'Backend', icon: Server, color: 'backend', delay: 1 },
    { id: 'database', label: 'Database', icon: Database, color: 'database', delay: 1.5 },
  ];

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-40 flex items-center justify-center">
      <div className="glass-panel p-8 rounded-2xl border border-border/50 backdrop-blur-xl">
        <h3 className="text-lg font-display font-bold text-foreground mb-6 text-center">
          Flusso di Dati
        </h3>
        <div className="flex items-center gap-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === steps.length - 1;
            
            return (
              <div key={step.id} className="flex items-center gap-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1, 
                    y: 0,
                    boxShadow: [
                      `0 0 0px hsl(var(--${step.color}))`,
                      `0 0 20px hsl(var(--${step.color}) / 0.5)`,
                      `0 0 0px hsl(var(--${step.color}))`,
                    ]
                  }}
                  transition={{
                    delay: step.delay,
                    duration: 0.5,
                    boxShadow: {
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 0.5,
                      delay: step.delay
                    }
                  }}
                  className="w-20 h-20 rounded-xl flex items-center justify-center relative border-2"
                  style={{
                    backgroundColor: `hsl(var(--${step.color}) / 0.2)`,
                    borderColor: `hsl(var(--${step.color}) / 0.4)`,
                    boxShadow: `0 0 20px hsl(var(--${step.color}) / 0.5)`
                  }}
                >
                  <Icon 
                    className="w-10 h-10"
                    style={{ color: `hsl(var(--${step.color}))` }}
                  />
                  
                  {/* Animated pulse ring */}
                  <motion.div
                    className="absolute inset-0 rounded-xl border-2"
                    style={{
                      borderColor: `hsl(var(--${step.color}) / 0.6)`
                    }}
                    initial={{ scale: 1, opacity: 0.8 }}
                    animate={{ 
                      scale: [1, 1.5, 1.5],
                      opacity: [0.8, 0, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: step.delay + 0.5,
                      ease: "easeOut"
                    }}
                  />
                </motion.div>
                
                {!isLast && (
                  <motion.div
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ delay: step.delay + 0.3, duration: 0.3 }}
                  >
                    <motion.div
                      animate={{ x: [0, 10, 0] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: step.delay + 0.5,
                        ease: "easeInOut"
                      }}
                    >
                      <ArrowRight className="w-6 h-6 text-muted-foreground" />
                    </motion.div>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Data packet animation */}
        <motion.div
          className="absolute top-1/2 left-0 w-full h-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {steps.slice(0, -1).map((step, index) => {
            const nextStep = steps[index + 1];
            const startX = index * 120 + 80;
            const endX = (index + 1) * 120 + 80;
            
            return (
              <motion.div
                key={`packet-${index}`}
                className="absolute top-0 w-3 h-3 rounded-full bg-primary"
                initial={{ x: startX, opacity: 0 }}
                animate={{ 
                  x: [startX, endX],
                  opacity: [0, 1, 1, 0]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: step.delay + 0.5,
                  ease: "easeInOut",
                  times: [0, 0.1, 0.9, 1]
                }}
                style={{
                  boxShadow: '0 0 10px hsl(var(--primary))'
                }}
              />
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default DataFlow;
