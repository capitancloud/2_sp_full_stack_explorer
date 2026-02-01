import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { learningPaths, roles, categories, CategoryType } from '@/data/knowledgeData';
import { 
  Compass, Route, Users, ChevronRight, ChevronDown,
  Monitor, Server, Database, Cloud, Shield, TestTube, GitBranch
} from 'lucide-react';
import PathTimeline from './PathTimeline';
import { arraysEqual } from '@/utils/arrayUtils';
import LogoutButton from './LogoutButton';

const categoryIcons: Record<CategoryType, React.ComponentType<{ className?: string }>> = {
  central: Compass,
  frontend: Monitor,
  backend: Server,
  database: Database,
  devops: Cloud,
  security: Shield,
  testing: TestTube,
  workflow: GitBranch,
};

interface SidebarProps {
  mode: 'explore' | 'path' | 'role';
  onModeChange: (mode: 'explore' | 'path' | 'role') => void;
  onPathSelect: (path: string[]) => void;
  onRoleSelect: (areas: string[]) => void;
  onStepSelect?: (stepId: string) => void;
  onCategorySelect?: (categoryId: string) => void;
}

const Sidebar = ({ mode, onModeChange, onPathSelect, onRoleSelect, onStepSelect, onCategorySelect }: SidebarProps) => {
  const [expandedPath, setExpandedPath] = useState<string | null>(null);
  const [expandedRole, setExpandedRole] = useState<string | null>(null);
  const [selectedPathSteps, setSelectedPathSteps] = useState<string[]>([]);

  const modes = useMemo(() => [
    { id: 'explore' as const, name: 'Esplorazione', icon: Compass, description: 'Naviga liberamente' },
    { id: 'path' as const, name: 'Percorsi Guidati', icon: Route, description: 'Segui un percorso' },
    { id: 'role' as const, name: 'Per Ruolo', icon: Users, description: 'Focus su un ruolo' },
  ], []);

  const mainCategories = useMemo(() => 
    (Object.keys(categories) as CategoryType[]).filter(c => c !== 'central'),
    []
  );

  const handleModeChange = useCallback((newMode: 'explore' | 'path' | 'role') => {
    onModeChange(newMode);
    if (newMode === 'explore') {
      onPathSelect([]);
      onRoleSelect([]);
    }
  }, [onModeChange, onPathSelect, onRoleSelect]);

  const handlePathToggle = useCallback((pathId: string, pathSteps: string[]) => {
    const isExpanded = expandedPath === pathId;
    setExpandedPath(isExpanded ? null : pathId);
    if (!isExpanded) {
      setSelectedPathSteps(pathSteps);
      onPathSelect(pathSteps);
    } else {
      setSelectedPathSteps([]);
      onPathSelect([]);
    }
  }, [expandedPath, onPathSelect]);

  const handlePathSelect = useCallback((pathSteps: string[]) => {
    setSelectedPathSteps(pathSteps);
    onPathSelect(pathSteps);
  }, [onPathSelect]);

  return (
    <div className="w-72 h-full glass-panel border-r border-border/50 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border/30">
        <h1 className="text-xl font-display font-bold text-foreground">
          Full Stack
          <span className="text-primary"> Map</span>
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Esplora l'ecosistema web
        </p>
      </div>

      {/* Mode Selector */}
      <div className="p-4 border-b border-border/30">
        <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">
          Modalità
        </p>
        <div className="space-y-1">
          {modes.map(m => {
            const Icon = m.icon;
            const isActive = mode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => handleModeChange(m.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left
                  ${isActive 
                    ? 'bg-primary/10 text-primary border border-primary/20' 
                    : 'hover:bg-secondary/50 text-muted-foreground hover:text-foreground'
                  }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <div className="min-w-0">
                  <span className="text-sm font-medium block">{m.name}</span>
                  <span className="text-xs opacity-70">{m.description}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content based on mode */}
      <div className="flex-1 overflow-y-auto p-4">
        <AnimatePresence mode="wait">
          {mode === 'path' && (
            <motion.div
              key="paths"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Timeline del percorso selezionato */}
              {selectedPathSteps.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <PathTimeline
                    pathSteps={selectedPathSteps}
                    onStepSelect={onStepSelect}
                    autoPlay={false}
                  />
                </motion.div>
              )}

              {/* Lista di tutti i percorsi */}
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">
                  {selectedPathSteps.length > 0 ? 'Altri Percorsi' : 'Percorsi Disponibili'}
                </p>
                {learningPaths.map(path => {
                  const isSelected = selectedPathSteps.length > 0 && 
                    arraysEqual(path.steps, selectedPathSteps);
                  
                  return (
                    <div key={path.id} className="space-y-1 mb-2">
                      <button
                        onClick={() => handlePathToggle(path.id, path.steps)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all text-left
                          ${isSelected
                            ? 'bg-primary/20 text-primary border border-primary/30'
                            : expandedPath === path.id
                            ? 'bg-primary/10 text-primary'
                            : 'hover:bg-secondary/50 text-foreground'
                          }`}
                      >
                        <span className="text-sm font-medium">{path.name}</span>
                        {expandedPath === path.id ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>
                      <AnimatePresence>
                        {expandedPath === path.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <p className="text-xs text-muted-foreground px-3 py-2">
                              {path.description}
                            </p>
                            {!isSelected && (
                              <button
                                onClick={() => handlePathSelect(path.steps)}
                                className="w-full mx-3 mb-2 px-3 py-1.5 text-xs font-medium rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                              >
                                Seleziona questo percorso
                              </button>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {mode === 'role' && (
            <motion.div
              key="roles"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-2"
            >
              <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">
                Scegli un Ruolo
              </p>
              {roles.map(role => (
                <div key={role.id} className="space-y-1">
                  <button
                    onClick={() => {
                      setExpandedRole(expandedRole === role.id ? null : role.id);
                      onRoleSelect(role.focusAreas);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all text-left
                      ${expandedRole === role.id
                        ? 'bg-primary/10 text-primary'
                        : 'hover:bg-secondary/50 text-foreground'
                      }`}
                  >
                    <span className="text-sm font-medium">{role.name}</span>
                    {expandedRole === role.id ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                  <AnimatePresence>
                    {expandedRole === role.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="text-xs text-muted-foreground px-3 py-2">
                          {role.description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </motion.div>
          )}

          {mode === 'explore' && (
            <motion.div
              key="explore"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-2"
            >
              <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">
                Aree Principali
              </p>
              {mainCategories.map(cat => {
                  const category = categories[cat];
                  const Icon = categoryIcons[cat];
                  // Trova il nodo principale per questa categoria (es. 'frontend', 'backend', etc.)
                  const categoryNodeId = cat;
                  
                  return (
                    <motion.button
                      key={cat}
                      onClick={() => {
                        if (onCategorySelect) {
                          onCategorySelect(categoryNodeId);
                        }
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-all text-left group"
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon className={`w-4 h-4 text-${cat} flex-shrink-0`} />
                      <span className="text-sm text-foreground font-medium flex-1">{category.name}</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.button>
                  );
                })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border/30 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Clicca sui nodi per esplorare
        </p>
        <LogoutButton />
      </div>
    </div>
  );
};

export default Sidebar;
