"use client";

import React, { useState } from "react";
import { Experience } from "@/schemas/content.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Trash2,
  Briefcase,
  ChevronUp,
  ChevronDown,
  Edit2,
  Check,
  Building2,
  Calendar,
} from "lucide-react";

interface ExperienceManagerProps {
  experiences: Experience[];
  onChange: (updated: Experience[]) => void;
}

export const ExperienceManager: React.FC<ExperienceManagerProps> = ({
  experiences,
  onChange,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);

  const addExperience = () => {
    const newExp: Experience = {
      id: Math.random().toString(36).substring(2, 9),
      company: "New Company",
      role: "Lead Software Engineer",
      location: "San Francisco, CA",
      startDate: "2023",
      endDate: "Present",
      current: true,
      description: "Leading technical architecture and core product development.",
      highlights: ["Spearheaded real-time systems", "Optimized render pipeline latency"],
      technologies: ["TypeScript", "Next.js", "Three.js"],
    };
    onChange([newExp, ...experiences]);
    setEditingId(newExp.id);
  };

  const removeExperience = (id: string) => {
    onChange(experiences.filter((exp) => exp.id !== id));
  };

  const updateExperience = (id: string, partial: Partial<Experience>) => {
    onChange(
      experiences.map((exp) => (exp.id === id ? { ...exp, ...partial } : exp))
    );
  };

  const moveUp = (idx: number) => {
    if (idx <= 0) return;
    const items = [...experiences];
    const temp = items[idx];
    items[idx] = items[idx - 1];
    items[idx - 1] = temp;
    onChange(items);
  };

  const moveDown = (idx: number) => {
    if (idx >= experiences.length - 1) return;
    const items = [...experiences];
    const temp = items[idx];
    items[idx] = items[idx + 1];
    items[idx + 1] = temp;
    onChange(items);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-heading font-semibold text-white flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-zylo-cyan" /> Work Experience
          </h4>
          <p className="text-xs text-slate-400">
            Add, reorder, or modify roles extracted from your resume or entered manually.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addExperience}
          className="text-xs gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" /> Add Experience
        </Button>
      </div>

      {experiences.length === 0 ? (
        <div className="p-8 text-center rounded-xl border border-dashed border-zylo-border bg-zylo-surface/40 text-xs text-slate-400">
          No work experiences added yet. Click &quot;Add Experience&quot; or upload a resume.
        </div>
      ) : (
        <div className="space-y-3">
          {experiences.map((exp, idx) => {
            const isEditing = editingId === exp.id;

            return (
              <Card
                key={exp.id}
                className="glass-panel border-zylo-border p-4 transition-all"
              >
                {isEditing ? (
                  /* Edit Mode */
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] text-slate-400 font-medium">Company</label>
                        <Input
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                          className="h-8 text-xs bg-zylo-surface/80"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400 font-medium">Role</label>
                        <Input
                          value={exp.role}
                          onChange={(e) => updateExperience(exp.id, { role: e.target.value })}
                          className="h-8 text-xs bg-zylo-surface/80"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400 font-medium">Start Date</label>
                        <Input
                          value={exp.startDate}
                          onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                          placeholder="e.g. 2022"
                          className="h-8 text-xs bg-zylo-surface/80"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400 font-medium">End Date</label>
                        <Input
                          value={exp.endDate || ""}
                          onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                          placeholder="e.g. Present"
                          className="h-8 text-xs bg-zylo-surface/80"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-400 font-medium">Role Description</label>
                      <textarea
                        value={exp.description}
                        onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
                        rows={2}
                        className="w-full rounded-lg border border-zylo-border bg-zylo-surface/80 p-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-zylo-cyan"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => setEditingId(null)}
                        className="text-xs h-7 gap-1"
                      >
                        <Check className="w-3 h-3" /> Done
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* Display Mode */
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="p-2 rounded-lg bg-zylo-elevated border border-zylo-border shrink-0 mt-0.5">
                        <Building2 className="w-4 h-4 text-zylo-cyan" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-white truncate">
                            {exp.role}
                          </span>
                          <Badge variant="cyan" className="text-[10px] py-0 px-1.5 font-mono">
                            {exp.company}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {exp.startDate} — {exp.current ? "Present" : exp.endDate || "Present"}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 line-clamp-1 mt-1">
                          {exp.description}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => moveUp(idx)}
                        disabled={idx === 0}
                        className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30"
                        title="Move Up"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveDown(idx)}
                        disabled={idx === experiences.length - 1}
                        className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30"
                        title="Move Down"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(exp.id)}
                        className="p-1 rounded text-slate-400 hover:text-zylo-cyan"
                        title="Edit Experience"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeExperience(exp.id)}
                        className="p-1 rounded text-slate-400 hover:text-rose-400"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
