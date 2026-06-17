// warpgate/targetRegistry.tsx
import React, { createContext, useContext, useRef, useCallback } from 'react';
import { Mesh } from 'three';

export type TargetType = 'planet' | 'moon';

export interface TargetEntry {
  mesh: Mesh;
  size: number;
  color: string;
  type: TargetType;
}

interface TargetRegistryContextValue {
  targets: React.MutableRefObject<TargetEntry[]>;
  register: (entry: TargetEntry) => void;
  unregister: (mesh: Mesh) => void;
}

const TargetRegistryContext = createContext<TargetRegistryContextValue | null>(null);

export const TargetRegistryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const targets = useRef<TargetEntry[]>([]);

  const register = useCallback((entry: TargetEntry) => {
    // Avoid duplicate registrations of the same mesh
    if (!targets.current.some(t => t.mesh === entry.mesh)) {
      targets.current.push(entry);
    }
  }, []);

  const unregister = useCallback((mesh: Mesh) => {
    targets.current = targets.current.filter(t => t.mesh !== mesh);
  }, []);

  return (
    <TargetRegistryContext.Provider value={{ targets, register, unregister }}>
      {children}
    </TargetRegistryContext.Provider>
  );
};

export const useTargetRegistry = (): TargetRegistryContextValue | null => {
  return useContext(TargetRegistryContext);
};
