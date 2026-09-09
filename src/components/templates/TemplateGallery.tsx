"use client";

import React, { useState, useMemo, useRef } from "react";
import Link from "next/link";
import { getAllTemplatesAndPresets, TemplateDefinition, PresetCatalogItem } from "@zylo/templates";
import { SceneRenderer } from "@zylo/three-engine";
import {
  Check,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
  Box,
  Search,
  SlidersHorizontal,
  Eye,
  Layers,
  Flame,
  Swords,
  Play,
  Pause,
  RotateCw,
  Compass,
  Cpu,
  Palette,
  Info,
} from "lucide-react";

export interface TemplateGalleryProps {
  selectedTemplateId: string;
  onSelectTemplate: (templateId: string) => void;
  show3DPreviews?: boolean;
}

const CATEGORIES = [
  "All",
  "Anime & Character",
  "AI & Tech",
  "Space & Sci-Fi",
  "3D Creative",
  "Glassmorphism",
  "Developer & Cyber",
  "Corporate & Professional",
  "Architecture & Engineering",
  "Automotive & Mechanical",
  "Gaming & Interactive",
  "Experimental WebGL",
] as const;

const GEOMETRY_QUICK_FILTERS = [
  { id: "all", label: "All Geometries" },
  { id: "AnimeCharacterAvatar", label: "Anime Avatar" },
  { id: "MechaCore", label: "Mecha Core" },
  { id: "SpacePlanet", label: "Space Planet" },
  { id: "CADStructure", label: "CAD Structure" },
  { id: "BuildingWireframe", label: "Skyscraper" },
  { id: "AutomotiveChassis", label: "Supercar" },
  { id: "MechanicalGears", label: "Clockwork" },
  { id: "TerminalCodeWall", label: "Terminal Matrix" },
  { id: "VoxelGrid", label: "Voxel Grid" },
  { id: "ExecutiveMonolith", label: "Monolith" },
  { id: "CrystalPrism", label: "Crystal Prism" },
  { id: "NeuralNodes", label: "Neural Nodes" },
  { id: "TorusKnotCore", label: "Torus Knot" },
] as const;

/**
 * Procedural 2D/3D Wireframe Silhouette Generator
 * Renders an instant, hardware-accelerated SVG representation of each distinct 3D geometry node
 * styled with the preset's exact primary & secondary glowing gradient colors.
 */
function renderGeometrySilhouette(
  componentType: string,
  primaryColor: string = "#00F0FF",
  secondaryColor: string = "#7928CA"
) {
  const gradId = `grad-${componentType}-${primaryColor.replace("#", "")}-${secondaryColor.replace("#", "")}`;

  switch (componentType) {
    case "AnimeCharacterAvatar":
      return (
        <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-[0_0_15px_rgba(255,42,133,0.5)]">
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={primaryColor} />
              <stop offset="100%" stopColor={secondaryColor} />
            </linearGradient>
          </defs>
          {/* Head & Chin */}
          <path d="M 30,35 Q 25,60 50,85 Q 75,60 70,35 Z" fill="none" stroke={`url(#${gradId})`} strokeWidth="2.5" />
          {/* Glowing Visor */}
          <rect x="32" y="44" width="36" height="10" rx="4" fill={primaryColor} opacity="0.8" />
          {/* Hair spikes */}
          <path d="M 22,38 L 30,15 L 42,28 L 50,10 L 58,28 L 70,15 L 78,38" fill="none" stroke={`url(#${gradId})`} strokeWidth="2.5" strokeLinecap="round" />
          {/* Dual Horns/Headset */}
          <line x1="26" y1="46" x2="15" y2="35" stroke={secondaryColor} strokeWidth="3" strokeLinecap="round" />
          <line x1="74" y1="46" x2="85" y2="35" stroke={secondaryColor} strokeWidth="3" strokeLinecap="round" />
          {/* Floating Sakura Petals */}
          <circle cx="20" cy="75" r="2.5" fill={secondaryColor} opacity="0.8" />
          <circle cx="82" cy="72" r="3" fill={primaryColor} opacity="0.8" />
          <circle cx="78" cy="22" r="2" fill={secondaryColor} opacity="0.7" />
        </svg>
      );

    case "MechaCore":
      return (
        <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-[0_0_15px_rgba(121,40,202,0.5)]">
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={primaryColor} />
              <stop offset="100%" stopColor={secondaryColor} />
            </linearGradient>
          </defs>
          {/* Outer Hexagon Chassis */}
          <polygon points="50,15 82,32 82,68 50,85 18,68 18,32" fill="none" stroke={`url(#${gradId})`} strokeWidth="2.5" />
          {/* Turbine Core Ring */}
          <circle cx="50" cy="50" r="18" fill="none" stroke={primaryColor} strokeWidth="2" strokeDasharray="6,3" />
          {/* Central Reactor Eye */}
          <circle cx="50" cy="50" r="8" fill={secondaryColor} opacity="0.9" />
          {/* Radiating Kinetic Vents */}
          <line x1="50" y1="18" x2="50" y2="32" stroke={primaryColor} strokeWidth="2" />
          <line x1="50" y1="68" x2="50" y2="82" stroke={primaryColor} strokeWidth="2" />
          <line x1="22" y1="35" x2="34" y2="42" stroke={secondaryColor} strokeWidth="2" />
          <line x1="78" y1="65" x2="66" y2="58" stroke={secondaryColor} strokeWidth="2" />
        </svg>
      );

    case "SpacePlanet":
      return (
        <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-[0_0_15px_rgba(0,240,255,0.5)]">
          <defs>
            <radialGradient id={gradId} cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor={primaryColor} />
              <stop offset="70%" stopColor={secondaryColor} />
              <stop offset="100%" stopColor="#05070D" />
            </radialGradient>
          </defs>
          {/* Back Orbit Ring */}
          <ellipse cx="50" cy="50" rx="44" ry="14" fill="none" stroke={secondaryColor} strokeWidth="2.5" opacity="0.5" transform="rotate(-20 50 50)" />
          {/* Planet Sphere */}
          <circle cx="50" cy="50" r="24" fill={`url(#${gradId})`} stroke={primaryColor} strokeWidth="1.5" />
          {/* Front Orbit Ring */}
          <path d="M 12,65 A 44 14 0 0 0 88,35" fill="none" stroke={primaryColor} strokeWidth="3" opacity="0.9" transform="rotate(-20 50 50)" />
        </svg>
      );

    case "SatelliteOrbit":
      return (
        <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-[0_0_15px_rgba(56,189,248,0.5)]">
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={primaryColor} />
              <stop offset="100%" stopColor={secondaryColor} />
            </linearGradient>
          </defs>
          {/* Orbital path */}
          <ellipse cx="50" cy="50" rx="42" ry="16" fill="none" stroke={secondaryColor} strokeWidth="1.5" strokeDasharray="4,4" opacity="0.6" transform="rotate(30 50 50)" />
          {/* Satellite Central Bus */}
          <rect x="44" y="44" width="12" height="12" fill={primaryColor} stroke="#FFFFFF" strokeWidth="1.5" />
          {/* Left Solar Panel */}
          <rect x="20" y="46" width="20" height="8" rx="1" fill={secondaryColor} stroke={primaryColor} strokeWidth="1" opacity="0.85" />
          {/* Right Solar Panel */}
          <rect x="60" y="46" width="20" height="8" rx="1" fill={secondaryColor} stroke={primaryColor} strokeWidth="1" opacity="0.85" />
          {/* Dish Antenna */}
          <path d="M 50,44 L 50,34 M 44,32 Q 50,36 56,32" fill="none" stroke={primaryColor} strokeWidth="2" />
        </svg>
      );

    case "BuildingWireframe":
      return (
        <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-[0_0_15px_rgba(0,240,255,0.5)]">
          <defs>
            <linearGradient id={gradId} x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor={secondaryColor} />
              <stop offset="100%" stopColor={primaryColor} />
            </linearGradient>
          </defs>
          {/* Tower Slabs receding in isometric 3D */}
          <polygon points="50,20 74,32 74,78 50,90 26,78 26,32" fill="none" stroke={`url(#${gradId})`} strokeWidth="2" />
          <line x1="50" y1="20" x2="50" y2="90" stroke={primaryColor} strokeWidth="2" />
          <line x1="26" y1="46" x2="50" y2="58" stroke={primaryColor} strokeWidth="1" />
          <line x1="50" y1="58" x2="74" y2="46" stroke={primaryColor} strokeWidth="1" />
          <line x1="26" y1="62" x2="50" y2="74" stroke={primaryColor} strokeWidth="1" />
          <line x1="50" y1="74" x2="74" y2="62" stroke={primaryColor} strokeWidth="1" />
          {/* Roof Spire */}
          <line x1="50" y1="20" x2="50" y2="8" stroke={primaryColor} strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="50" cy="7" r="2" fill={primaryColor} />
        </svg>
      );

    case "CADStructure":
      return (
        <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-[0_0_15px_rgba(56,189,248,0.5)]">
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={primaryColor} />
              <stop offset="100%" stopColor={secondaryColor} />
            </linearGradient>
          </defs>
          {/* Isometric Truss Cube Wireframe */}
          <polygon points="50,18 80,32 50,46 20,32" fill="none" stroke={primaryColor} strokeWidth="2" />
          <polygon points="20,32 50,46 50,82 20,68" fill="none" stroke={secondaryColor} strokeWidth="2" />
          <polygon points="80,32 50,46 50,82 80,68" fill="none" stroke={`url(#${gradId})`} strokeWidth="2" />
          {/* Diagonal Cross Braces */}
          <line x1="20" y1="32" x2="50" y2="82" stroke={primaryColor} strokeWidth="1" strokeDasharray="3,3" />
          <line x1="80" y1="32" x2="50" y2="82" stroke={secondaryColor} strokeWidth="1" strokeDasharray="3,3" />
        </svg>
      );

    case "AutomotiveChassis":
      return (
        <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={secondaryColor} />
              <stop offset="100%" stopColor={primaryColor} />
            </linearGradient>
          </defs>
          {/* Supercar Aerodynamic Silhouette */}
          <path
            d="M 12,62 L 24,62 Q 28,52 38,52 Q 48,52 52,62 L 70,62 Q 74,52 84,52 Q 92,52 94,62 L 96,55 Q 86,45 74,44 L 62,36 Q 52,34 42,38 L 26,48 Q 16,52 12,62 Z"
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Glass Canopy */}
          <path d="M 44,40 L 60,38 Q 68,43 70,45 L 38,45 Z" fill={primaryColor} opacity="0.6" />
          {/* Rear Spoiler */}
          <line x1="12" y1="52" x2="14" y2="44" stroke={primaryColor} strokeWidth="2" />
          <line x1="10" y1="44" x2="20" y2="44" stroke={primaryColor} strokeWidth="2.5" />
          {/* Wheels */}
          <circle cx="38" cy="62" r="8" fill="#0D1528" stroke={primaryColor} strokeWidth="2" />
          <circle cx="84" cy="62" r="8" fill="#0D1528" stroke={primaryColor} strokeWidth="2" />
        </svg>
      );

    case "MechanicalGears":
      return (
        <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={primaryColor} />
              <stop offset="100%" stopColor={secondaryColor} />
            </linearGradient>
          </defs>
          {/* Left Main Gear */}
          <circle cx="40" cy="46" r="18" fill="none" stroke={primaryColor} strokeWidth="3" strokeDasharray="7,4" />
          <circle cx="40" cy="46" r="8" fill="none" stroke={primaryColor} strokeWidth="2" />
          {/* Right Counter Gear */}
          <circle cx="66" cy="60" r="14" fill="none" stroke={secondaryColor} strokeWidth="3" strokeDasharray="6,4" />
          <circle cx="66" cy="60" r="6" fill="none" stroke={secondaryColor} strokeWidth="2" />
        </svg>
      );

    case "TerminalCodeWall":
      return (
        <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-[0_0_15px_rgba(0,255,102,0.5)]">
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={primaryColor} />
              <stop offset="100%" stopColor={secondaryColor} />
            </linearGradient>
          </defs>
          {/* Terminal Box */}
          <rect x="18" y="20" width="64" height="60" rx="6" fill="#050A14" stroke={`url(#${gradId})`} strokeWidth="2" />
          {/* Top terminal bar */}
          <circle cx="26" cy="28" r="2" fill="#EF4444" />
          <circle cx="32" cy="28" r="2" fill="#F59E0B" />
          <circle cx="38" cy="28" r="2" fill="#10B981" />
          {/* Matrix code lines */}
          <line x1="26" y1="40" x2="65" y2="40" stroke={primaryColor} strokeWidth="2" strokeLinecap="round" />
          <line x1="26" y1="48" x2="52" y2="48" stroke={primaryColor} strokeWidth="2" strokeLinecap="round" opacity="0.8" />
          <line x1="26" y1="56" x2="70" y2="56" stroke={secondaryColor} strokeWidth="2" strokeLinecap="round" />
          <line x1="26" y1="64" x2="40" y2="64" stroke={primaryColor} strokeWidth="2" strokeLinecap="round" opacity="0.7" />
          {/* Prompt Cursor */}
          <rect x="44" y="61" width="5" height="6" fill={primaryColor} />
        </svg>
      );

    case "ExecutiveMonolith":
      return (
        <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-[0_0_15px_rgba(212,175,55,0.5)]">
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={primaryColor} />
              <stop offset="100%" stopColor={secondaryColor} />
            </linearGradient>
          </defs>
          {/* Outer Gyro Ring */}
          <ellipse cx="50" cy="50" rx="38" ry="12" fill="none" stroke={secondaryColor} strokeWidth="1.5" opacity="0.6" transform="rotate(-30 50 50)" />
          {/* Titanium / Gold Obelisk Monolith */}
          <polygon points="44,15 56,15 58,85 42,85" fill="#0F172A" stroke={`url(#${gradId})`} strokeWidth="2" />
          {/* Core Beveled Edge */}
          <line x1="50" y1="15" x2="50" y2="85" stroke={primaryColor} strokeWidth="1.5" />
          {/* Inner Gyro Ring */}
          <ellipse cx="50" cy="50" rx="28" ry="8" fill="none" stroke={primaryColor} strokeWidth="2" transform="rotate(20 50 50)" />
        </svg>
      );

    case "VoxelGrid":
      return (
        <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]">
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={primaryColor} />
              <stop offset="100%" stopColor={secondaryColor} />
            </linearGradient>
          </defs>
          {/* Stepped 3D Isometric Voxel Cubes */}
          <g transform="translate(50, 20)">
            {/* Center Top Voxel */}
            <polygon points="0,0 14,8 0,16 -14,8" fill={primaryColor} opacity="0.9" />
            <polygon points="-14,8 0,16 0,32 -14,24" fill={secondaryColor} opacity="0.8" />
            <polygon points="14,8 0,16 0,32 14,24" fill={primaryColor} opacity="0.6" />
          </g>
          <g transform="translate(30, 36)">
            <polygon points="0,0 14,8 0,16 -14,8" fill={secondaryColor} opacity="0.9" />
            <polygon points="-14,8 0,16 0,32 -14,24" fill={primaryColor} opacity="0.7" />
            <polygon points="14,8 0,16 0,32 14,24" fill={secondaryColor} opacity="0.5" />
          </g>
          <g transform="translate(70, 36)">
            <polygon points="0,0 14,8 0,16 -14,8" fill={primaryColor} opacity="0.9" />
            <polygon points="-14,8 0,16 0,32 -14,24" fill={secondaryColor} opacity="0.7" />
            <polygon points="14,8 0,16 0,32 14,24" fill={primaryColor} opacity="0.5" />
          </g>
        </svg>
      );

    case "CrystalPrism":
      return (
        <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-[0_0_15px_rgba(0,240,255,0.5)]">
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={primaryColor} />
              <stop offset="100%" stopColor={secondaryColor} />
            </linearGradient>
          </defs>
          {/* Faceted Crystal Diamond Outline */}
          <polygon points="50,10 82,35 68,90 32,90 18,35" fill="none" stroke={`url(#${gradId})`} strokeWidth="2" />
          <line x1="50" y1="10" x2="50" y2="90" stroke={primaryColor} strokeWidth="1.5" />
          <line x1="18" y1="35" x2="82" y2="35" stroke={primaryColor} strokeWidth="1.5" />
          <line x1="50" y1="35" x2="32" y2="90" stroke={secondaryColor} strokeWidth="1" />
          <line x1="50" y1="35" x2="68" y2="90" stroke={secondaryColor} strokeWidth="1" />
        </svg>
      );

    case "NeuralNodes":
      return (
        <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-[0_0_15px_rgba(0,240,255,0.5)]">
          {/* Synaptic Dendrite Links */}
          <line x1="50" y1="50" x2="25" y2="25" stroke={secondaryColor} strokeWidth="2" />
          <line x1="50" y1="50" x2="75" y2="30" stroke={primaryColor} strokeWidth="2" />
          <line x1="50" y1="50" x2="30" y2="75" stroke={primaryColor} strokeWidth="2" />
          <line x1="50" y1="50" x2="70" y2="75" stroke={secondaryColor} strokeWidth="2" />
          {/* Nodes */}
          <circle cx="50" cy="50" r="9" fill={primaryColor} opacity="0.9" />
          <circle cx="25" cy="25" r="6" fill={secondaryColor} />
          <circle cx="75" cy="30" r="5" fill={primaryColor} />
          <circle cx="30" cy="75" r="5" fill={secondaryColor} />
          <circle cx="70" cy="75" r="6" fill={primaryColor} />
        </svg>
      );

    default: // TorusKnotCore or general geometric
      return (
        <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-[0_0_15px_rgba(0,240,255,0.5)]">
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={primaryColor} />
              <stop offset="100%" stopColor={secondaryColor} />
            </linearGradient>
          </defs>
          <path
            d="M 30,50 Q 50,15 70,50 Q 85,75 50,75 Q 15,75 30,50 Z"
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <circle cx="50" cy="50" r="14" fill="none" stroke={primaryColor} strokeWidth="2" opacity="0.7" />
        </svg>
      );
  }
}

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  selectedTemplateId,
  onSelectTemplate,
  show3DPreviews = true,
}) => {
  const allItems = useMemo(() => getAllTemplatesAndPresets(), []);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedGeometry, setSelectedGeometry] = useState<string>("all");
  const [stageAutoRotate, setStageAutoRotate] = useState<boolean>(true);

  // Active inspected preset loaded in the interactive 3D Stage
  const stageRef = useRef<HTMLDivElement>(null);
  const [activeInspectId, setActiveInspectId] = useState<string>(
    selectedTemplateId || (allItems[0]?.id ?? "anime-neo-tokyo")
  );

  const inspectedTemplate = useMemo(() => {
    return (
      allItems.find((t) => t.id.toLowerCase() === activeInspectId.toLowerCase()) ||
      allItems[0]
    );
  }, [allItems, activeInspectId]);

  const primaryNode = inspectedTemplate?.defaultScene?.nodes?.[0];
  const inspectedPrimaryColor = inspectedTemplate?.defaultTheme?.colors?.primary || "#00F0FF";
  const inspectedSecondaryColor = inspectedTemplate?.defaultTheme?.colors?.secondary || "#7928CA";

  const filteredTemplates = useMemo(() => {
    return allItems.filter((tpl) => {
      const family = (tpl as any).family || tpl.category;
      const matchesCategory =
        selectedCategory === "All" ||
        family === selectedCategory ||
        tpl.category === selectedCategory;

      const nodeType = tpl.defaultScene?.nodes?.[0]?.componentType;
      const matchesGeometry =
        selectedGeometry === "all" || nodeType === selectedGeometry;

      const query = searchQuery.toLowerCase().trim();
      const tags: string[] = (tpl as any).tags || [];
      const matchesQuery =
        !query ||
        tpl.name.toLowerCase().includes(query) ||
        tpl.id.toLowerCase().includes(query) ||
        tpl.description.toLowerCase().includes(query) ||
        tpl.bestFor.toLowerCase().includes(query) ||
        nodeType?.toLowerCase().includes(query) ||
        tags.some((t) => t.toLowerCase().includes(query));

      return matchesCategory && matchesGeometry && matchesQuery;
    });
  }, [allItems, selectedCategory, selectedGeometry, searchQuery]);

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case "low":
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Low Load • Ultra Fast
          </span>
        );
      case "medium":
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-sky-500/10 text-sky-400 border border-sky-500/20">
            Medium • Balanced
          </span>
        );
      case "high":
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-purple-500/10 text-purple-400 border border-purple-500/20">
            High • Rich WebGL
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-500/10 text-slate-400">
            Standard
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Meta */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div className="space-y-1.5">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Box className="w-7 h-7 text-zylo-cyan" />
            3D Template Architecture & Preset Catalog
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl">
            Explore {allItems.length} verified, configuration-driven 3D presets. Every single template features a uniquely assigned 3D procedural geometry, custom lighting, and dedicated material colors.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-zylo-cyan/10 text-zylo-cyan border border-zylo-cyan/30 flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            <Sparkles className="w-3.5 h-3.5" />
            {allItems.length} Unique 3D Presets
          </span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* FEATURED INTERACTIVE 3D STAGE & GEOMETRY INSPECTOR        */}
      {/* ========================================================= */}
      {inspectedTemplate && (
        <div
          ref={stageRef}
          className="rounded-3xl border border-white/15 bg-gradient-to-b from-[#0B1020] to-[#05070D] p-5 sm:p-7 relative overflow-hidden shadow-[0_15px_50px_rgba(0,0,0,0.8)]"
        >
          {/* Ambient background glows */}
          <div
            className="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-[100px] pointer-events-none opacity-40"
            style={{ backgroundColor: inspectedPrimaryColor }}
          />
          <div
            className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full blur-[100px] pointer-events-none opacity-30"
            style={{ backgroundColor: inspectedSecondaryColor }}
          />

          <div className="flex flex-col lg:flex-row gap-6 items-stretch relative z-10">
            {/* 3D WebGL Live Stage Viewport */}
            <div className="relative flex-1 min-h-[340px] sm:min-h-[420px] rounded-2xl overflow-hidden bg-black/60 border border-white/10 shadow-2xl">
              <SceneRenderer
                sceneConfig={inspectedTemplate.defaultScene}
                interactive={true}
                autoRotate={stageAutoRotate}
                className="w-full h-full"
              />

              {/* Stage Top Bar Overlay */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-zylo-cyan border border-zylo-cyan/40 flex items-center gap-1.5 shadow-md">
                    <Box className="w-3.5 h-3.5" />
                    Geometry: <strong className="text-white">{primaryNode?.componentType || "3D Node"}</strong>
                  </span>
                  <span className="hidden sm:inline-flex text-xs font-mono px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-slate-300 border border-white/10">
                    Light: {inspectedTemplate.defaultScene?.lighting?.preset || "Cyberpunk"}
                  </span>
                </div>

                <div className="flex items-center gap-2 pointer-events-auto">
                  <button
                    onClick={() => setStageAutoRotate(!stageAutoRotate)}
                    title={stageAutoRotate ? "Pause Auto-Rotate" : "Resume Auto-Rotate"}
                    className="p-1.5 rounded-lg bg-black/70 hover:bg-black/90 text-slate-300 hover:text-white border border-white/10 text-xs flex items-center gap-1 transition-all"
                  >
                    {stageAutoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span className="hidden sm:inline text-[11px] font-mono">
                      {stageAutoRotate ? "Auto-Rotate On" : "Paused"}
                    </span>
                  </button>

                  <span className="hidden md:inline-flex text-[10px] font-mono text-slate-400 bg-black/70 px-2.5 py-1 rounded-lg border border-white/10">
                    Drag to Orbit • Scroll to Zoom
                  </span>
                </div>
              </div>

              {/* Stage Bottom Live Telemetry Overlay */}
              <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 pointer-events-none z-10">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/10 text-[11px] font-mono text-slate-300">
                    <span
                      className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_currentColor]"
                      style={{ backgroundColor: inspectedPrimaryColor, color: inspectedPrimaryColor }}
                    />
                    <span>Primary: {inspectedPrimaryColor}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/10 text-[11px] font-mono text-slate-300">
                    <span
                      className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_currentColor]"
                      style={{ backgroundColor: inspectedSecondaryColor, color: inspectedSecondaryColor }}
                    />
                    <span>Secondary: {inspectedSecondaryColor}</span>
                  </div>
                </div>

                <div className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/70 text-slate-400 border border-white/10">
                  DPR: {inspectedTemplate.performance.maxDpr}x • Particles: {inspectedTemplate.performance.recommendedParticles}
                </div>
              </div>
            </div>

            {/* Stage Side Inspector Details */}
            <div className="lg:w-80 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-zylo-cyan/10 text-zylo-cyan border border-zylo-cyan/30">
                    {(inspectedTemplate as any).family || inspectedTemplate.category}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    Preset ID: {inspectedTemplate.id}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white tracking-tight">
                  {inspectedTemplate.name}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {inspectedTemplate.description}
                </p>

                <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1.5">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    Best Suited For:
                  </span>
                  <p className="text-xs text-slate-200 font-medium">
                    {inspectedTemplate.bestFor}
                  </p>
                </div>

                {/* 3D Specification breakdown */}
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 space-y-2 text-[11px] font-mono">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>3D Mesh Component:</span>
                    <strong className="text-zylo-cyan">{primaryNode?.componentType}</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Lighting Engine:</span>
                    <span className="text-slate-200 capitalize">{inspectedTemplate.defaultScene?.lighting?.preset}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Environment Fog:</span>
                    <span className="text-slate-200">
                      {inspectedTemplate.defaultScene?.environment?.fog?.enabled ? "Volumetric" : "None"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Post-Processing:</span>
                    <span className="text-slate-200">Bloom + Vignette</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons for Inspected Template */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => onSelectTemplate(inspectedTemplate.id)}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-zylo-cyan text-black hover:bg-zylo-cyan/90 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.35)]"
                >
                  <Check className="w-4 h-4" />
                  <span>Apply This 3D Preset</span>
                </button>

                <Link
                  href={`/preview?template=${inspectedTemplate.id}`}
                  target="_blank"
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-medium bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4 text-slate-400" />
                  <span>Open Fullscreen 3D Portfolio</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* FILTER & SEARCH CONTROLS                                  */}
      {/* ========================================================= */}
      <div className="space-y-3 bg-white/[0.02] p-4 rounded-2xl border border-white/10">
        {/* Top search & counter row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by preset name, 3D geometry (Mecha, Planet, CAD), or domain..."
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-black/50 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-zylo-cyan transition-colors"
            />
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>
              Showing <strong className="text-white">{filteredTemplates.length}</strong> of {allItems.length} Presets
            </span>
          </div>
        </div>

        {/* 3D Geometry Quick Filters */}
        <div className="space-y-1 pt-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
            Filter By 3D Geometry Type:
          </span>
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {GEOMETRY_QUICK_FILTERS.map((geo) => {
              const isActive = selectedGeometry === geo.id;
              return (
                <button
                  key={geo.id}
                  onClick={() => setSelectedGeometry(geo.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all whitespace-nowrap border ${
                    isActive
                      ? "bg-zylo-cyan text-black border-zylo-cyan font-semibold shadow-[0_0_12px_rgba(0,240,255,0.3)]"
                      : "bg-black/30 border-white/10 text-slate-400 hover:text-white hover:border-white/20"
                  }`}
                >
                  ✦ {geo.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Pills */}
        <div className="space-y-1 pt-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
            Filter By Domain / Family:
          </span>
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-white text-black font-semibold shadow-sm"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 100 PRESETS GRID                                          */}
      {/* ========================================================= */}
      {filteredTemplates.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-2xl border border-white/10 bg-white/[0.01]">
          <Box className="w-10 h-10 text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">No presets found</h3>
          <p className="text-xs text-slate-400 mt-1">
            Try adjusting your search query, clearing the 3D geometry filter, or choosing another family.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
              setSelectedGeometry("all");
            }}
            className="mt-4 px-4 py-2 rounded-lg text-xs bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((tpl) => {
            const isSelected = selectedTemplateId.toLowerCase() === tpl.id.toLowerCase();
            const isInspected = activeInspectId.toLowerCase() === tpl.id.toLowerCase();
            const primaryColor = tpl.defaultTheme?.colors?.primary || "#00F0FF";
            const secondaryColor = tpl.defaultTheme?.colors?.secondary || "#7928CA";
            const family = (tpl as any).family || tpl.category;
            const tags: string[] = (tpl as any).tags || [];
            const node = tpl.defaultScene?.nodes?.[0];
            const componentType = node?.componentType || "TorusKnotCore";

            return (
              <div
                key={tpl.id}
                className={`rounded-2xl overflow-hidden border transition-all flex flex-col justify-between group ${
                  isSelected
                    ? "border-zylo-cyan ring-2 ring-zylo-cyan/40 shadow-[0_0_35px_rgba(0,240,255,0.25)] bg-[#0C1222]"
                    : isInspected
                    ? "border-zylo-cyan/60 bg-[#0E1528] shadow-[0_0_25px_rgba(0,240,255,0.15)]"
                    : "border-white/10 bg-[#080D1A] hover:border-white/20 hover:bg-[#0D1426]"
                }`}
              >
                {/* Distinct 3D Visual Viewport / Geometric Wireframe Canvas */}
                <div className="relative w-full h-48 sm:h-52 bg-gradient-to-b from-black/50 via-[#070B16] to-[#04060C] overflow-hidden border-b border-white/10 flex items-center justify-center">
                  {/* Glowing radial backdrop matching preset palette */}
                  <div
                    className="absolute inset-0 opacity-25 group-hover:opacity-40 transition-opacity pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at 50% 50%, ${primaryColor}40 0%, ${secondaryColor}20 50%, transparent 75%)`,
                    }}
                  />

                  {/* 3D Geometric Wireframe Silhouette */}
                  <div className="relative z-10 transition-transform duration-300 group-hover:scale-110">
                    {renderGeometrySilhouette(componentType, primaryColor, secondaryColor)}
                  </div>

                  {/* Top overlay badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-zylo-cyan border border-zylo-cyan/30 flex items-center gap-1 shadow-md">
                      <Box className="w-3 h-3 text-zylo-cyan" />
                      {componentType}
                    </span>

                    {isSelected ? (
                      <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-zylo-cyan text-black font-semibold flex items-center gap-1 shadow-md">
                        <Check className="w-3 h-3" /> Selected
                      </span>
                    ) : isInspected ? (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/80 text-zylo-cyan border border-zylo-cyan/40 animate-pulse">
                        ● In 3D Stage
                      </span>
                    ) : null}
                  </div>

                  {/* Bottom overlay: 3D Color Swatches and Telemetry */}
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between pointer-events-none text-[10px] font-mono text-slate-400 z-10">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full shadow-[0_0_6px_currentColor]"
                        style={{ backgroundColor: primaryColor, color: primaryColor }}
                        title={`Primary: ${primaryColor}`}
                      />
                      <span
                        className="w-2.5 h-2.5 rounded-full shadow-[0_0_6px_currentColor]"
                        style={{ backgroundColor: secondaryColor, color: secondaryColor }}
                        title={`Secondary: ${secondaryColor}`}
                      />
                      <span className="text-slate-300 text-[10px]">{family}</span>
                    </div>

                    <span className="text-[10px] text-slate-400">
                      {tpl.defaultScene?.lighting?.preset || "Cyberpunk"}
                    </span>
                  </div>

                  {/* Hover Action Overlay: Inspect in 3D Stage */}
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-20">
                    <button
                      onClick={() => {
                        setActiveInspectId(tpl.id);
                        stageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-zylo-cyan text-black font-semibold text-xs flex items-center gap-1.5 shadow-lg shadow-zylo-cyan/30 hover:scale-105 transition-transform"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect 3D Scene</span>
                    </button>
                  </div>
                </div>

                {/* Card Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full shadow-[0_0_6px_currentColor] shrink-0"
                          style={{ backgroundColor: primaryColor, color: primaryColor }}
                        />
                        <span className="line-clamp-1">{tpl.name}</span>
                      </h3>
                      <span className="text-[10px] font-mono text-slate-500 shrink-0">v{tpl.templateVersion}</span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                      {tpl.description}
                    </p>

                    <div className="pt-1">
                      <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                        Best For:
                      </p>
                      <p className="text-xs font-medium text-slate-200 mt-0.5 line-clamp-1">
                        {tpl.bestFor}
                      </p>
                    </div>

                    {/* Tags Pills */}
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {tags.slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/[0.05] text-slate-400 border border-white/[0.06]"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 pt-3 border-t border-white/[0.08]">
                    <div className="flex items-center justify-between">
                      <div>{getTierBadge(tpl.performance.tier)}</div>
                      <span className="text-[10px] font-mono text-slate-400">
                        {componentType}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => onSelectTemplate(tpl.id)}
                        className={`py-2 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                          isSelected
                            ? "bg-zylo-cyan text-black font-semibold hover:bg-zylo-cyan/90 shadow-[0_0_12px_rgba(0,240,255,0.3)]"
                            : "bg-white/10 text-white hover:bg-white/15 border border-white/10"
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <Check className="w-3.5 h-3.5" /> Selected
                          </>
                        ) : (
                          "Use Preset"
                        )}
                      </button>

                      <button
                        onClick={() => {
                          setActiveInspectId(tpl.id);
                          stageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                        }}
                        className="py-2 px-3 rounded-xl text-xs font-medium bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 flex items-center justify-center gap-1 transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" /> Inspect 3D
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
