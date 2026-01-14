import { useState, useCallback } from 'react';
import { KnowledgeNode, knowledgeNodes } from '@/data/knowledgeData';
import KnowledgeMap from '@/components/KnowledgeMap';
import DetailPanel from '@/components/DetailPanel';
import Sidebar from '@/components/Sidebar';

const Index = () => {
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(null);
  const [mode, setMode] = useState<'explore' | 'path' | 'role'>('explore');
  const [highlightedNodes, setHighlightedNodes] = useState<string[]>([]);
  const [currentView, setCurrentView] = useState<string>('fullstack');

  const handleNodeSelect = useCallback((node: KnowledgeNode) => {
    setSelectedNode(node);
  }, []);

  const handlePathSelect = useCallback((steps: string[]) => {
    setHighlightedNodes(steps);
  }, []);

  const handleRoleSelect = useCallback((areas: string[]) => {
    setHighlightedNodes(areas);
  }, []);

  const handleStepSelect = useCallback((stepId: string) => {
    const node = knowledgeNodes.find(n => n.id === stepId);
    if (node) {
      setSelectedNode(node);
    }
  }, []);

  const handleCategorySelect = useCallback((categoryId: string) => {
    const node = knowledgeNodes.find(n => n.id === categoryId);
    if (node) {
      setCurrentView(categoryId);
      setSelectedNode(node);
    }
  }, []);

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-background">
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-frontend/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-backend/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-central/5 rounded-full blur-3xl" />
      </div>

      {/* Sidebar */}
      <Sidebar
        mode={mode}
        onModeChange={setMode}
        onPathSelect={handlePathSelect}
        onRoleSelect={handleRoleSelect}
        onStepSelect={handleStepSelect}
        onCategorySelect={handleCategorySelect}
      />

      {/* Main Content */}
      <main className="flex-1 relative">
        <KnowledgeMap
          onNodeSelect={handleNodeSelect}
          highlightedNodes={highlightedNodes}
          initialView={currentView}
          onViewChange={setCurrentView}
        />
      </main>

      {/* Detail Panel */}
      <DetailPanel
        node={selectedNode}
        onClose={() => setSelectedNode(null)}
      />
    </div>
  );
};

export default Index;
