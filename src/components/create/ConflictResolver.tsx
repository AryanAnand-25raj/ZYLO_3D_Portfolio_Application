"use client";

import React from "react";
import { DataConflict, DataSource } from "@/schemas/draft.schema";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";

interface ConflictResolverProps {
  conflicts: DataConflict[];
  onResolve: (conflictId: string, chosenValue: unknown) => void;
}

export const ConflictResolver: React.FC<ConflictResolverProps> = ({
  conflicts,
  onResolve,
}) => {
  if (conflicts.length === 0) {
    return null;
  }

  const unresolvedCount = conflicts.filter((c) => !c.resolved).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400" />
          <h4 className="text-sm font-heading font-semibold text-white">
            Data Source Conflicts Detected ({unresolvedCount} remaining)
          </h4>
        </div>
        <Badge variant="purple" className="text-[10px] font-mono">
          Multi-Source Reconciliation
        </Badge>
      </div>

      <p className="text-xs text-slate-400 leading-relaxed">
        Differences were detected between your manually entered information and your uploaded resume.
        Choose the preferred source value for each item:
      </p>

      <div className="space-y-3">
        {conflicts.map((conflict) => (
          <Card
            key={conflict.id}
            className={`p-4 border transition-all ${
              conflict.resolved
                ? "glass-panel border-zylo-border/60 bg-zylo-surface/20"
                : "border-amber-500/40 bg-amber-500/[0.03] shadow-[0_0_20px_rgba(245,158,11,0.05)]"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-white block">
                  {conflict.label || conflict.field}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Field: {conflict.field}
                </span>
              </div>

              {/* Source Option Pills */}
              <div className="flex flex-wrap items-center gap-2">
                {conflict.values.map((valObj, idx) => {
                  const isSelected =
                    conflict.resolved &&
                    JSON.stringify(conflict.resolvedValue) === JSON.stringify(valObj.value);

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => onResolve(conflict.id, valObj.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-2 transition-all ${
                        isSelected
                          ? "bg-zylo-cyan text-black border-zylo-cyan font-semibold shadow-sm"
                          : "bg-zylo-surface hover:bg-zylo-elevated border-zylo-border text-slate-300"
                      }`}
                    >
                      <span className="text-[10px] uppercase font-mono px-1 py-0.5 rounded bg-black/20">
                        {valObj.source}
                      </span>
                      <span>{String(valObj.value)}</span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
