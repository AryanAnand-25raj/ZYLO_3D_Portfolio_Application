"use client";

import React, { useState, useCallback } from "react";
import { SceneMeshNode } from "../schemas/scene.schema";

export interface InteractionControllerProps {
  nodes: SceneMeshNode[];
  onNodeClick?: (nodeId: string) => void;
  onNodeHover?: (nodeId: string | null) => void;
  children: (helpers: {
    hoveredNodeId: string | null;
    handlePointerOver: (nodeId: string) => void;
    handlePointerOut: (nodeId: string) => void;
    handleClick: (nodeId: string) => void;
  }) => React.ReactNode;
}

export const InteractionController: React.FC<InteractionControllerProps> = ({
  onNodeClick,
  onNodeHover,
  children,
}) => {
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const handlePointerOver = useCallback(
    (nodeId: string) => {
      setHoveredNodeId(nodeId);
      onNodeHover?.(nodeId);
    },
    [onNodeHover]
  );

  const handlePointerOut = useCallback(
    (_nodeId: string) => {
      setHoveredNodeId(null);
      onNodeHover?.(null);
    },
    [onNodeHover]
  );

  const handleClick = useCallback(
    (nodeId: string) => {
      onNodeClick?.(nodeId);
    },
    [onNodeClick]
  );

  return <>{children({ hoveredNodeId, handlePointerOver, handlePointerOut, handleClick })}</>;
};
