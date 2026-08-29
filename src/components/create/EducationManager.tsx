"use client";

import React, { useState } from "react";
import { Education } from "@/schemas/content.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Plus, Trash2, GraduationCap, Edit2, Check } from "lucide-react";

interface EducationManagerProps {
  education: Education[];
  onChange: (updated: Education[]) => void;
}

export const EducationManager: React.FC<EducationManagerProps> = ({
  education,
  onChange,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);

  const addEducation = () => {
    const newEdu: Education = {
      id: Math.random().toString(36).substring(2, 9),
      institution: "Stanford University",
      degree: "B.S. in Computer Science",
      fieldOfStudy: "Computer Graphics & Human-Computer Interaction",
      startDate: "2018",
      endDate: "2022",
    };
    onChange([newEdu, ...education]);
    setEditingId(newEdu.id);
  };

  const removeEducation = (id: string) => {
    onChange(education.filter((e) => e.id !== id));
  };

  const updateEducation = (id: string, partial: Partial<Education>) => {
    onChange(
      education.map((e) => (e.id === id ? { ...e, ...partial } : e))
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-heading font-semibold text-white flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-zylo-emerald" /> Education & Credentials
          </h4>
          <p className="text-xs text-slate-400">
            List academic degrees, diplomas, or accredited credentials.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addEducation}
          className="text-xs gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" /> Add Education
        </Button>
      </div>

      {education.length === 0 ? (
        <div className="p-6 text-center rounded-xl border border-dashed border-zylo-border bg-zylo-surface/40 text-xs text-slate-400">
          No education added. Click &quot;Add Education&quot; if desired (optional).
        </div>
      ) : (
        <div className="space-y-3">
          {education.map((edu) => {
            const isEditing = editingId === edu.id;

            return (
              <Card
                key={edu.id}
                className="glass-panel border-zylo-border p-4 transition-all"
              >
                {isEditing ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] text-slate-400 font-medium">Institution</label>
                        <Input
                          value={edu.institution}
                          onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                          className="h-8 text-xs bg-zylo-surface/80"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400 font-medium">Degree</label>
                        <Input
                          value={edu.degree}
                          onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                          className="h-8 text-xs bg-zylo-surface/80"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400 font-medium">Field of Study</label>
                        <Input
                          value={edu.fieldOfStudy || ""}
                          onChange={(e) => updateEducation(edu.id, { fieldOfStudy: e.target.value })}
                          className="h-8 text-xs bg-zylo-surface/80"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400 font-medium">Graduation Year</label>
                        <Input
                          value={edu.endDate || ""}
                          onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
                          placeholder="e.g. 2022"
                          className="h-8 text-xs bg-zylo-surface/80"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-1">
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
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="p-2 rounded-lg bg-zylo-elevated border border-zylo-border shrink-0 mt-0.5">
                        <GraduationCap className="w-4 h-4 text-zylo-emerald" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-semibold text-white block truncate">
                          {edu.degree} — {edu.institution}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {edu.fieldOfStudy} ({edu.startDate} — {edu.endDate || "Present"})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => setEditingId(edu.id)}
                        className="p-1 rounded text-slate-400 hover:text-zylo-cyan"
                        title="Edit Education"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeEducation(edu.id)}
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
