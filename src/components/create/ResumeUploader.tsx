"use client";

import React, { useState, useRef } from "react";
import { useDraft } from "./DraftProvider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  X,
  FileCode,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export const ResumeUploader: React.FC = () => {
  const { setExtractedData, nextStep, saveDraft } = useDraft();

  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [stats, setStats] = useState<{ charCount: number; fileName: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const validateAndProcessFile = async (selectedFile: File) => {
    setError(null);
    setUploadSuccess(false);

    // 1. Extension check
    const validExts = [".pdf", ".docx", ".doc", ".txt"];
    const ext = selectedFile.name.substring(selectedFile.name.lastIndexOf(".")).toLowerCase();
    if (!validExts.includes(ext)) {
      setError("Invalid file type. Please upload a PDF (.pdf) or Word document (.docx).");
      return;
    }

    // 2. Size check (10MB limit)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File is too large. Maximum allowed size is 10MB.");
      return;
    }

    setFile(selectedFile);
    await uploadFile(selectedFile);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await validateAndProcessFile(e.target.files[0]);
    }
  };

  const uploadFile = async (fileToUpload: File) => {
    setUploading(true);
    setProgress(15);

    try {
      const formData = new FormData();
      formData.append("file", fileToUpload);

      const progressInterval = setInterval(() => {
        setProgress((prev) => (prev < 85 ? prev + 15 : prev));
      }, 250);

      const res = await fetch("/api/resume/upload", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to upload and parse resume.");
      }

      const data = await res.json();
      setExtractedData(data.extracted);
      setStats({ charCount: data.charCount || 1500, fileName: fileToUpload.name });
      setUploadSuccess(true);
      await saveDraft();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error uploading resume.");
      setUploadSuccess(false);
    } finally {
      setUploading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setError(null);
    setUploadSuccess(false);
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-6">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.doc,.txt"
        onChange={handleFileInput}
        className="hidden"
      />

      {/* Main Drag & Drop Card */}
      {!uploadSuccess ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-10 sm:p-14 text-center cursor-pointer transition-all ${
            isDragging
              ? "border-zylo-cyan bg-zylo-cyan/10 shadow-[0_0_30px_rgba(0,240,255,0.2)]"
              : "border-zylo-border hover:border-zylo-cyan/50 hover:bg-white/[0.02] bg-zylo-surface/40"
          }`}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-zylo-cyan/20 to-zylo-purple/20 border border-zylo-cyan/30 flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.15)]">
              {uploading ? (
                <RefreshCw className="w-8 h-8 text-zylo-cyan animate-spin" />
              ) : (
                <Upload className="w-8 h-8 text-zylo-cyan" />
              )}
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-heading font-semibold text-white">
                {uploading ? "Extracting Structured Resume Data..." : "Upload your Resume or CV"}
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Drag and drop your file here, or click to browse. Supported formats:{" "}
                <span className="text-slate-300 font-mono">PDF, DOCX</span> (Max 10MB).
              </p>
            </div>

            {/* Uploading Progress Bar */}
            {uploading && (
              <div className="w-full max-w-md space-y-2 pt-2">
                <div className="w-full bg-zylo-surface h-2 rounded-full overflow-hidden border border-zylo-border">
                  <div
                    className="bg-gradient-to-r from-zylo-cyan to-zylo-purple h-full transition-all duration-300 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  {progress < 50
                    ? "Uploading securely to private storage..."
                    : "Extracting work experience, skills & projects..."}
                </span>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Extraction Success State */
        <Card className="glass-panel border-zylo-emerald/30 bg-zylo-emerald/[0.03] p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-zylo-emerald/10 border border-zylo-emerald/30 flex items-center justify-center text-zylo-emerald">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-heading font-bold text-white">
                    {stats?.fileName || "Resume"}
                  </h4>
                  <Badge variant="emerald" className="text-[10px] py-0 px-2">
                    Extracted
                  </Badge>
                </div>
                <p className="text-xs text-slate-300">
                  Extracted text & structured entities verified against Factual Accuracy rules.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="text-xs gap-1.5"
              >
                Upload Different File
              </Button>
              <Button
                variant="glow"
                size="sm"
                onClick={nextStep}
                className="text-xs gap-2"
              >
                Review Extracted Data <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-rose-400 hover:text-white p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Privacy Notice Pill */}
      <div className="p-4 rounded-xl bg-zylo-elevated/80 border border-zylo-border text-xs text-slate-400 flex items-center gap-3">
        <Sparkles className="w-4 h-4 text-zylo-cyan shrink-0" />
        <span>
          <strong>Private & Isolated Storage:</strong> Resumes are never exposed publicly and are
          analyzed strictly to populate your portfolio structure.
        </span>
      </div>
    </div>
  );
};
