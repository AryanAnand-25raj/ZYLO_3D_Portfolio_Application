"use client";

import React, { useState } from "react";
import { Project } from "@/schemas/content.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Trash2,
  Box,
  Star,
  Edit2,
  Check,
  ExternalLink,
  Github,
} from "lucide-react";

interface ProjectManagerProps {
  projects: Project[];
  onChange: (updated: Project[]) => void;
}

export const ProjectManager: React.FC<ProjectManagerProps> = ({
  projects,
  onChange,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);

  const addProject = () => {
    const newProj: Project = {
      id: Math.random().toString(36).substring(2, 9),
      title: "New 3D Project",
      slug: `project-${Date.now()}`,
      summary: "Real-time interactive 3D WebGL web application.",
      description: "Explores procedural geometries and shader lighting architectures.",
      category: "3D Graphics",
      tags: ["Three.js", "React", "WebGL"],
      featured: projects.length === 0,
      stats: [{ label: "Performance", value: "60 FPS" }],
    };
    onChange([newProj, ...projects]);
    setEditingId(newProj.id);
  };

  const removeProject = (id: string) => {
    onChange(projects.filter((p) => p.id !== id));
  };

  const updateProject = (id: string, partial: Partial<Project>) => {
    onChange(projects.map((p) => (p.id === id ? { ...p, ...partial } : p)));
  };

  const toggleFeatured = (id: string) => {
    onChange(
      projects.map((p) => (p.id === id ? { ...p, featured: !p.featured } : p))
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-heading font-semibold text-white flex items-center gap-2">
            <Box className="w-4 h-4 text-zylo-purple" /> Featured Projects
          </h4>
          <p className="text-xs text-slate-400">
            Showcase your best projects. Mark standout works as featured.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addProject}
          className="text-xs gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" /> Add Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="p-8 text-center rounded-xl border border-dashed border-zylo-border bg-zylo-surface/40 text-xs text-slate-400">
          No projects added yet. Click &quot;Add Project&quot; to showcase your portfolio work.
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((proj) => {
            const isEditing = editingId === proj.id;

            return (
              <Card
                key={proj.id}
                className="glass-panel border-zylo-border p-4 transition-all"
              >
                {isEditing ? (
                  /* Edit Mode */
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] text-slate-400 font-medium">Project Title</label>
                        <Input
                          value={proj.title}
                          onChange={(e) => updateProject(proj.id, { title: e.target.value })}
                          className="h-8 text-xs bg-zylo-surface/80"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400 font-medium">Category</label>
                        <Input
                          value={proj.category}
                          onChange={(e) => updateProject(proj.id, { category: e.target.value })}
                          placeholder="e.g. 3D WebGL, SaaS"
                          className="h-8 text-xs bg-zylo-surface/80"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400 font-medium">Live Demo URL</label>
                        <Input
                          value={proj.demoUrl || ""}
                          onChange={(e) => updateProject(proj.id, { demoUrl: e.target.value })}
                          placeholder="https://..."
                          className="h-8 text-xs bg-zylo-surface/80"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400 font-medium">GitHub Repository</label>
                        <Input
                          value={proj.githubUrl || ""}
                          onChange={(e) => updateProject(proj.id, { githubUrl: e.target.value })}
                          placeholder="https://github.com/..."
                          className="h-8 text-xs bg-zylo-surface/80"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-400 font-medium">Summary</label>
                      <textarea
                        value={proj.summary}
                        onChange={(e) => updateProject(proj.id, { summary: e.target.value })}
                        rows={2}
                        className="w-full rounded-lg border border-zylo-border bg-zylo-surface/80 p-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-zylo-cyan"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={() => toggleFeatured(proj.id)}
                        className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md border transition-colors ${
                          proj.featured
                            ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                            : "border-zylo-border text-slate-400 hover:text-white"
                        }`}
                      >
                        <Star className={`w-3.5 h-3.5 ${proj.featured ? "fill-amber-400" : ""}`} />
                        <span>{proj.featured ? "Featured on Hero" : "Set as Featured"}</span>
                      </button>

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
                        <Box className="w-4 h-4 text-zylo-purple" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-white truncate">
                            {proj.title}
                          </span>
                          {proj.featured && (
                            <Badge variant="purple" className="text-[10px] py-0 px-1.5 gap-1">
                              <Star className="w-2.5 h-2.5 fill-current" /> Featured
                            </Badge>
                          )}
                          <span className="text-[10px] text-slate-400 font-mono">
                            {proj.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 line-clamp-1 mt-0.5">
                          {proj.summary}
                        </p>
                        {proj.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {proj.tags.slice(0, 4).map((tag, i) => (
                              <span
                                key={i}
                                className="px-1.5 py-0.5 rounded text-[9px] bg-white/5 text-slate-400 font-mono"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => toggleFeatured(proj.id)}
                        className="p-1 rounded text-slate-400 hover:text-amber-400"
                        title={proj.featured ? "Unfeature" : "Feature"}
                      >
                        <Star className={`w-3.5 h-3.5 ${proj.featured ? "fill-amber-400 text-amber-400" : ""}`} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(proj.id)}
                        className="p-1 rounded text-slate-400 hover:text-zylo-cyan"
                        title="Edit Project"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeProject(proj.id)}
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
