"use client";

import React, { useState } from "react";
import { X, AlertTriangle, Check, Edit3, ShieldAlert } from "lucide-react";

export interface ConflictItem {
  id: string;
  field: string;
  label: string;
  values: Array<{ source: string; value: any; timestamp?: string }>;
  resolved: boolean;
  resolvedValue?: any;
}

interface ConflictResolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  conflicts: ConflictItem[];
  onResolveAll: (resolutions: Record<string, any>) => Promise<void>;
}

export const ConflictResolutionModal: React.FC<ConflictResolutionModalProps> = ({
  isOpen,
  onClose,
  conflicts,
  onResolveAll,
}) => {
  const [selectedResolutions, setSelectedResolutions] = useState<Record<string, any>>(() => {
    const init: Record<string, any> = {};
    conflicts.forEach((c) => {
      // Default to manual or first source value
      const manualVal = c.values.find((v) => v.source === "manual")?.value;
      init[c.field] = manualVal !== undefined ? manualVal : c.values[0]?.value;
    });
    return init;
  });
  const [customEdits, setCustomEdits] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || conflicts.length === 0) return null;

  const handleSelectSource = (field: string, val: any) => {
    setSelectedResolutions((prev) => ({
      ...prev,
      [field]: val,
    }));
  };

  const handleApply = async () => {
    setIsSubmitting(true);
    try {
      const finalMap = { ...selectedResolutions, ...customEdits };
      await onResolveAll(finalMap);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0D111C] border border-amber-500/30 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#090D16]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Review Profile Discrepancies</h2>
              <p className="text-xs text-slate-400">
                Discrepancies detected between your imported sources. Choose which data to use.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conflict List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {conflicts.map((item) => {
            const currentChosen = customEdits[item.field] !== undefined
              ? customEdits[item.field]
              : selectedResolutions[item.field];

            return (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider font-mono">
                    {item.label}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    field: {item.field}
                  </span>
                </div>

                <div className="space-y-2">
                  {item.values.map((valObj, idx) => {
                    const isChosen = currentChosen === valObj.value;

                    return (
                      <div
                        key={idx}
                        onClick={() => {
                          handleSelectSource(item.field, valObj.value);
                          setCustomEdits((prev) => {
                            const copy = { ...prev };
                            delete copy[item.field];
                            return copy;
                          });
                        }}
                        className={`cursor-pointer flex items-center justify-between p-3 rounded-lg border transition-all ${
                          isChosen
                            ? "bg-cyan-950/20 border-cyan-500/60 shadow-sm"
                            : "bg-[#111827]/40 border-white/5 hover:border-white/20"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                              isChosen
                                ? "border-cyan-400 bg-cyan-400 text-black"
                                : "border-white/30"
                            }`}
                          >
                            {isChosen && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <div>
                            <div className="text-xs font-medium text-white">{String(valObj.value)}</div>
                            <div className="text-[10px] text-slate-400">
                              Source: <span className="font-semibold uppercase text-cyan-400">{valObj.source}</span>
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-400">
                          Use {valObj.source}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Custom Edit Option */}
                <div className="pt-1">
                  <div className="flex items-center gap-2">
                    <Edit3 className="w-3 h-3 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Or enter custom value..."
                      value={customEdits[item.field] || ""}
                      onChange={(e) =>
                        setCustomEdits((prev) => ({
                          ...prev,
                          [item.field]: e.target.value,
                        }))
                      }
                      className="flex-1 px-3 py-1.5 bg-[#090D16] border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-[#090D16]">
          <span className="text-xs text-slate-500">
            Resolving will update your Canonical Profile.
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            >
              Skip
            </button>
            <button
              onClick={handleApply}
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-black rounded-lg transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              {isSubmitting ? "Saving..." : "Apply Resolutions"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
