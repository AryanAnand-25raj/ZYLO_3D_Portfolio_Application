"use client";

import React from "react";
import * as THREE from "three";
import { MaterialProps } from "../schemas/scene.schema";

export interface ControlledMaterialProps {
  props: MaterialProps;
  isHovered?: boolean;
}

export const ControlledMaterial: React.FC<ControlledMaterialProps> = ({ props, isHovered }) => {
  const {
    type = "standard",
    color = "#00F0FF",
    emissive,
    emissiveIntensity = 0.5,
    roughness = 0.2,
    metalness = 0.8,
    wireframe = false,
    transparent = true,
    opacity = 0.9,
    transmission,
    ior = 1.5,
    thickness = 1,
    clearcoat = 0.5,
  } = props;

  const currentEmissiveIntensity = isHovered ? Math.min(emissiveIntensity * 2 + 0.4, 3) : emissiveIntensity;

  switch (type) {
    case "physical":
      return (
        <meshPhysicalMaterial
          color={color}
          emissive={emissive || color}
          emissiveIntensity={currentEmissiveIntensity}
          roughness={roughness}
          metalness={metalness}
          wireframe={wireframe}
          transparent={transparent}
          opacity={opacity}
          transmission={transmission ?? 0.8}
          ior={ior}
          thickness={thickness}
          clearcoat={clearcoat}
        />
      );
    case "basic":
      return (
        <meshBasicMaterial
          color={color}
          wireframe={wireframe}
          transparent={transparent}
          opacity={opacity}
        />
      );
    case "toon":
      return (
        <meshToonMaterial
          color={color}
          emissive={emissive || color}
          emissiveIntensity={currentEmissiveIntensity}
          wireframe={wireframe}
          transparent={transparent}
          opacity={opacity}
        />
      );
    case "standard":
    default:
      return (
        <meshStandardMaterial
          color={color}
          emissive={emissive || color}
          emissiveIntensity={currentEmissiveIntensity}
          roughness={roughness}
          metalness={metalness}
          wireframe={wireframe}
          transparent={transparent}
          opacity={opacity}
        />
      );
  }
};
