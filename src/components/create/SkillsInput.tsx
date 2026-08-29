"use client";

import React, { useState } from "react";
import { SkillCategory } from "@/schemas/content.schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Cpu, Layers } from "lucide-react";

interface SkillsInputProps {
  categories: SkillCategory[];
  onChange: (updated: SkillCategory[]) => void;
}

export const SkillsInput: React.FC<SkillsInputProps> = ({
  categories,
  onChange,
}) => {
  const [newSkillInput, setNewSkillInput] = useState<{ [catId: string]: string }>({});

  const handleAddTag = (catId: string, skillName: string) => {
    if (!skillName.trim()) return;
    const clean = skillName.trim();

    onChange(
      categories.map((cat) => {
        if (cat.id === catId) {
          if (cat.skills.some((s) => s.name.toLowerCase() === clean.toLowerCase())) {
            return cat;
          }
          return {
            ...cat,
            skills: [...cat.skills, { name: clean, proficiency: 85 }],
          };
        }
        return cat;
      })
    );

    setNewSkillInput((prev) => ({ ...prev, [catId]: "" }));
  };

  const handleRemoveTag = (catId: string, skillName: string) => {
    onChange(
      categories.map((cat) => {
        if (cat.id === catId) {
          return {
            ...cat,
            skills: cat.skills.filter((s) => s.name !== skillName),
          };
        }
        return cat;
      })
    );
  };

  const defaultCategories: SkillCategory[] = [
    {
      id: "cat-3d",
      category: "3D & Real-Time Graphics",
      skills: [
        { name: "Three.js", proficiency: 95 },
        { name: "React Three Fiber", proficiency: 90 },
        { name: "GLSL / Shaders", proficiency: 85 },
        { name: "WebGL", proficiency: 85 },
      ],
    },
    {
      id: "cat-web",
      category: "Frontend & Fullstack",
      skills: [
        { name: "TypeScript", proficiency: 95 },
        { name: "Next.js", proficiency: 90 },
        { name: "React", proficiency: 95 },
        { name: "Tailwind CSS", proficiency: 95 },
      ],
    },
    {
      id: "cat-tools",
      category: "Backend, Cloud & Tools",
      skills: [
        { name: "Node.js", proficiency: 85 },
        { name: "PostgreSQL", proficiency: 80 },
        { name: "Prisma", proficiency: 85 },
        { name: "Docker", proficiency: 75 },
      ],
    },
  ];

  const activeCategories = categories.length > 0 ? categories : defaultCategories;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-heading font-semibold text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-zylo-cyan" /> Skills & Expertise Matrix
          </h4>
          <p className="text-xs text-slate-400">
            Categorized skills feed interactive 3D skill clusters and particle meshes.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeCategories.map((cat) => (
          <div
            key={cat.id}
            className="p-4 rounded-xl glass-panel border border-zylo-border space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-zylo-cyan" />
                {cat.category}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {cat.skills.length} skills
              </span>
            </div>

            {/* Tags Container */}
            <div className="flex flex-wrap gap-1.5 min-h-[42px]">
              {cat.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs bg-zylo-elevated border border-zylo-border text-slate-200 group hover:border-zylo-cyan/40 transition-colors"
                >
                  <span>{skill.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(cat.id, skill.name)}
                    className="text-slate-400 hover:text-rose-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            {/* Tag Input */}
            <div className="flex items-center gap-2">
              <Input
                placeholder="Type skill & press Enter (e.g. WebGPU, Rust)..."
                value={newSkillInput[cat.id] || ""}
                onChange={(e) =>
                  setNewSkillInput({ ...newSkillInput, [cat.id]: e.target.value })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag(cat.id, newSkillInput[cat.id] || "");
                  }
                }}
                className="h-8 text-xs bg-zylo-surface/80"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAddTag(cat.id, newSkillInput[cat.id] || "")}
                className="h-8 px-2 text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
