import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { learningPaths, roles, categories, CategoryType } from '@/data/knowledgeData';
import { 
  Compass, Route, Users, ChevronRight, ChevronDown,
  Monitor, Server, Database, Cloud, Shield, TestTube, GitBranch
} from 'lucide-react';

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
}

const Sidebar = ({ mode, onModeChange, onPathSelect, onRoleSelect }: SidebarProps) => {
  const [expandedPath, setExpandedPath] = useState<string | null>(null);
  const [expandedRole, setExpandedRole] = useState<string | null>(null);

  const modes = [
    { id: 'explore' as const, name: 'Esplorazione', icon: Compass, description: 'Naviga liberamente' },
    { id: 'path' as const, name: 'Percorsi Guidati', icon: Route, description: 'Segui un percorso' },
    { id: 'role' as const, name: 'Per Ruolo', icon: Users, description: 'Focus su un ruolo' },
  ];

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
                onClick={() => {
                  onModeChange(m.id);
                  if (m.id === 'explore') {
                    onPathSelect([]);
                    onRoleSelect([]);
                  }
                }}
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
              className="space-y-2"
            >
              <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">
                Percorsi Disponibili
              </p>
              {learningPaths.map(path => (
                <div key={path.id} className="space-y-1">
                  <button
                    onClick={() => {
                      setExpandedPath(expandedPath === path.id ? null : path.id);
                      onPathSelect(path.steps);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all text-left
                      ${expandedPath === path.id
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
                        <div className="px-3 py-2 space-y-1">
                          {path.steps.map((step, idx) => (
                            <div key={step} className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-medium">
                                {idx + 1}
                              </span>
                              {step}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
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
              {(Object.keys(categories) as CategoryType[])
                .filter(c => c !== 'central')
                .map(cat => {
                  const category = categories[cat];
                  const Icon = categoryIcons[cat];
                  return (
                    <div
                      key={cat}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg bg-secondary/30"
                    >
                      <Icon className={`w-4 h-4 text-${cat}`} />
                      <span className="text-sm text-foreground">{category.name}</span>
                    </div>
                  );
                })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border/30">
        <p className="text-xs text-muted-foreground text-center">
          Clicca sui nodi per esplorare
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
