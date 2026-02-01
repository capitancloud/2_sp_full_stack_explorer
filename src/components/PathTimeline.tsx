import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { knowledgeNodes, KnowledgeNode } from '@/data/knowledgeData';
import { CheckCircle2, Circle, ArrowRight, Play, Pause, RotateCcw } from 'lucide-react';

interface PathTimelineProps {
  pathSteps: string[];
  onStepSelect?: (stepId: string) => void;
  autoPlay?: boolean;
}

const PathTimeline = ({ pathSteps, onStepSelect, autoPlay = false }: PathTimelineProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const steps = pathSteps
    .map(id => knowledgeNodes.find(n => n.id === id))
    .filter((node): node is KnowledgeNode => node !== undefined);

  useEffect(() => {
    if (!isPlaying || currentStep >= steps.length) return;

    const timer = setTimeout(() => {
      setCurrentStep(prev => {
        const next = Math.min(prev + 1, steps.length - 1);
        setCompletedSteps(prevSet => new Set([...prevSet, prev]));
        return next;
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [currentStep, isPlaying, steps.length]);

  const handleStepClick = (index: number) => {
    setCurrentStep(index);
    if (steps[index] && onStepSelect) {
      onStepSelect(steps[index].id);
    }
  };

  const handlePlay = () => {
    setIsPlaying(true);
    if (currentStep >= steps.length - 1) {
      setCurrentStep(0);
      setCompletedSteps(new Set());
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setCompletedSteps(new Set());
    setIsPlaying(false);
  };

  return (
    <div className="glass-panel p-4 rounded-xl border border-border/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-display font-bold text-foreground">
          Sequenza
        </h3>
        <div className="flex items-center gap-1">
          {isPlaying ? (
            <button
              onClick={handlePause}
              className="p-1.5 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              <Pause className="w-3.5 h-3.5 text-foreground" />
            </button>
          ) : (
            <button
              onClick={handlePlay}
              className="p-1.5 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              <Play className="w-3.5 h-3.5 text-foreground" />
            </button>
          )}
          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg hover:bg-secondary/50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-foreground" />
          </button>
        </div>
      </div>

      <div className="relative max-h-[60vh] overflow-y-auto">
        {/* Timeline line */}
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border/30">
          <motion.div
            className="absolute top-0 left-0 w-full bg-primary"
            initial={{ height: '0%' }}
            animate={{ 
              height: steps.length > 1 ? `${(currentStep / (steps.length - 1)) * 100}%` : '100%'
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {steps.map((step, index) => {
            const isActive = index === currentStep;
            const isCompleted = completedSteps.has(index) || index < currentStep;
            const isUpcoming = index > currentStep;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  scale: isActive ? 1.05 : 1
                }}
                transition={{ 
                  delay: index * 0.1,
                  duration: 0.3
                }}
                className="relative flex items-start gap-4 cursor-pointer group"
                onClick={() => handleStepClick(index)}
              >
                {/* Step indicator */}
                <div className="relative z-10 flex-shrink-0">
                  <motion.div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                      isCompleted
                        ? 'bg-primary border-primary text-primary-foreground'
                        : isActive
                        ? 'bg-primary/20 border-primary text-primary'
                        : 'bg-background border-border text-muted-foreground'
                    }`}
                    animate={{
                      scale: isActive ? [1, 1.2, 1] : 1,
                      boxShadow: isActive
                        ? [
                            '0 0 0px hsl(var(--primary) / 0)',
                            '0 0 20px hsl(var(--primary) / 0.6)',
                            '0 0 0px hsl(var(--primary) / 0)',
                          ]
                        : '0 0 0px hsl(var(--primary) / 0)',
                    }}
                    transition={{
                      scale: {
                        duration: 2,
                        repeat: isActive ? Infinity : 0,
                        ease: "easeInOut"
                      },
                      boxShadow: {
                        duration: 2,
                        repeat: isActive ? Infinity : 0,
                        ease: "easeInOut"
                      }
                    }}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </motion.div>
                  
                  {/* Pulse ring for active step */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-primary/60"
                      animate={{
                        scale: [1, 1.5, 1.5],
                        opacity: [0.6, 0, 0]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeOut"
                      }}
                    />
                  )}
                </div>

                {/* Step content */}
                <motion.div
                  className={`flex-1 pt-1 transition-all ${
                    isActive
                      ? 'text-foreground'
                      : isCompleted
                      ? 'text-foreground/80'
                      : 'text-muted-foreground'
                  }`}
                  animate={{
                    x: isActive ? 4 : 0
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-muted-foreground">
                      Step {index + 1}
                    </span>
                    {isActive && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs font-medium text-primary"
                      >
                        • Attivo
                      </motion.span>
                    )}
                  </div>
                  <h4 className="text-sm font-display font-semibold mb-1">
                    {step.name}
                  </h4>
                  <p className="text-xs leading-relaxed line-clamp-2 text-muted-foreground">
                    {step.description}
                  </p>
                </motion.div>

                {/* Arrow */}
                {!isUpcoming && index < steps.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute left-8 top-10"
                  >
                    <ArrowRight className="w-3 h-3 text-muted-foreground rotate-90" />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PathTimeline;
