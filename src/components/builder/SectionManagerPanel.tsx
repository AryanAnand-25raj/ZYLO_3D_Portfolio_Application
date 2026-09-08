"use client";

import React from "react";
import {
  GripVertical,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  ChevronUp,
  ChevronDown,
  Layers,
  Plus,
} from "lucide-react";

export interface SectionItem {
  id: string;
  name: string;
  visible: boolean;
  required?: boolean;
}

export interface SectionManagerPanelProps {
  sections: SectionItem[];
  onReorder: (fromIndex: number, toIndex: number) => void;
  onToggleVisibility: (sectionId: string) => void;
  onDuplicate: (sectionId: string) => void;
  onDelete: (sectionId: string) => void;
  onSelectSection: (sectionId: string) => void;
  selectedSectionId?: string | null;
}

export const SectionManagerPanel: React.FC<SectionManagerPanelProps> = ({
  sections,
  onReorder,
  onToggleVisibility,
  onDuplicate,
  onDelete,
  onSelectSection,
  selectedSectionId,
}) => {
  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div>
          <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            Portfolio Sections
          </h3>
          <p className="text-[11px] text-slate-400">
            Reorder, toggle visibility, and configure section layouts.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {sections.map((sec, index) => {
          const isSelected = selectedSectionId === sec.id;

          return (
            <div
              key={sec.id}
              onClick={() => onSelectSection(sec.id)}
              className={`flex items-center justify-between p-2.5 rounded-lg border text-xs transition-all cursor-pointer ${
                isSelected
                  ? "bg-cyan-500/15 border-cyan-500/40 text-cyan-300 shadow-sm"
                  : "bg-white/[0.03] border-white/10 text-slate-300 hover:bg-white/[0.06] hover:border-white/20"
              }`}
            >
              <div className="flex items-center gap-2">
                {/* Reorder Up/Down arrows */}
                <div className="flex flex-col -space-y-1 text-slate-500">
                  <button
                    disabled={index === 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      onReorder(index, index - 1);
                    }}
                    className="hover:text-cyan-400 disabled:opacity-20 transition-colors p-0.5"
                    title="Move section up"
                  >
                    <ChevronUp className="w-3 h-3" />
                  </button>
                  <button
                    disabled={index === sections.length - 1}
                    onClick={(e) => {
                      e.stopPropagation();
                      onReorder(index, index + 1);
                    }}
                    className="hover:text-cyan-400 disabled:opacity-20 transition-colors p-0.5"
                    title="Move section down"
                  >
                    <ChevronDown className="w-3 h-3" />
                  </button>
                </div>

                <span className="font-medium capitalize">{sec.name}</span>
                {sec.required && (
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-slate-400">
                    Required
                  </span>
                )}
              </div>

              {/* Actions: Visibility, Duplicate, Delete */}
              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleVisibility(sec.id);
                  }}
                  className={`p-1.5 rounded hover:bg-white/10 transition-colors ${
                    sec.visible ? "text-slate-300" : "text-slate-600"
                  }`}
                  title={sec.visible ? "Hide Section" : "Show Section"}
                >
                  {sec.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicate(sec.id);
                  }}
                  className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                  title="Duplicate Section"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>

                {!sec.required && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(sec.id);
                    }}
                    className="p-1.5 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Delete Section"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
