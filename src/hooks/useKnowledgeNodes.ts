import { useMemo, useCallback } from 'react';
import { knowledgeNodes, KnowledgeNode } from '@/data/knowledgeData';

/**
 * Hook per gestire le operazioni sui nodi della knowledge base
 */
export const useKnowledgeNodes = () => {
  // Memoizza i nodi per evitare ricalcoli
  const nodesMap = useMemo(() => {
    return new Map(knowledgeNodes.map(node => [node.id, node]));
  }, []);

  const getNodeById = useCallback((id: string): KnowledgeNode | undefined => {
    return nodesMap.get(id);
  }, [nodesMap]);

  const getNodesByIds = useCallback((ids: string[]): KnowledgeNode[] => {
    return ids.map(id => nodesMap.get(id)).filter((node): node is KnowledgeNode => node !== undefined);
  }, [nodesMap]);

  const getChildNodes = useCallback((parentId: string): KnowledgeNode[] => {
    const parent = nodesMap.get(parentId);
    if (!parent?.children) return [];
    return getNodesByIds(parent.children);
  }, [nodesMap, getNodesByIds]);

  const getRelatedNodes = useCallback((nodeId: string | null): string[] => {
    if (!nodeId) return [];
    const node = nodesMap.get(nodeId);
    if (!node) return [];
    
    const related = new Set<string>();
    node.relations?.forEach(rel => related.add(rel));
    
    // Trova nodi che hanno questo nodo nelle loro relazioni
    nodesMap.forEach(n => {
      if (n.relations?.includes(nodeId)) {
        related.add(n.id);
      }
    });
    
    return Array.from(related);
  }, [nodesMap]);

  return {
    nodesMap,
    getNodeById,
    getNodesByIds,
    getChildNodes,
    getRelatedNodes,
  };
};
