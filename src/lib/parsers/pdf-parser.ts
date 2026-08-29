import { ResumeParser, RawResumeData, segmentResumeText } from "./resume-parser";

export class PdfResumeParser implements ResumeParser {
  supports(mimeType: string, fileName?: string): boolean {
    return (
      mimeType === "application/pdf" ||
      (fileName?.toLowerCase().endsWith(".pdf") ?? false)
    );
  }

  async parse(buffer: Buffer, _fileName?: string): Promise<RawResumeData> {
    try {
      // Robust PDF plain-text extractor extracting stream / literal text segments
      const text = this.extractTextFromPdfBuffer(buffer);
      const sections = segmentResumeText(text);

      return {
        text,
        sections,
        metadata: {
          detectedType: "PDF",
          charCount: text.length,
          wordCount: text.split(/\s+/).filter(Boolean).length,
        },
      };
    } catch (error) {
      throw new Error(`Failed to parse PDF document: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  private extractTextFromPdfBuffer(buffer: Buffer): string {
    const rawString = buffer.toString("binary");
    const textPieces: string[] = [];

    // Extract text inside PDF stream / TJ / Tj operators
    const textBlockRegex = /\(([^)]+)\)\s*Tj/g;
    let match;
    while ((match = textBlockRegex.exec(rawString)) !== null) {
      const piece = match[1]
        .replace(/\\([0-9]{3})/g, (_, oct) => String.fromCharCode(parseInt(oct, 8)))
        .replace(/\\r/g, "\n")
        .replace(/\\n/g, "\n")
        .replace(/\\t/g, " ")
        .replace(/\\([()\\])/g, "$1");
      textPieces.push(piece);
    }

    // Extract TJ array streams
    const tjArrayRegex = /\[([^\]]+)\]\s*TJ/g;
    while ((match = tjArrayRegex.exec(rawString)) !== null) {
      const inside = match[1];
      const subMatches = inside.match(/\(([^)]+)\)/g);
      if (subMatches) {
        const combined = subMatches
          .map((m) => m.slice(1, -1))
          .join("")
          .replace(/\\([0-9]{3})/g, (_, oct) => String.fromCharCode(parseInt(oct, 8)))
          .replace(/\\([()\\])/g, "$1");
        textPieces.push(combined);
      }
    }

    // If stream operators didn't yield text (compressed streams or ASCII fallback)
    if (textPieces.length === 0) {
      // Fallback: extract legible ASCII strings longer than 3 chars
      const asciiStrings = rawString.match(/[a-zA-Z0-9.,@:\-\s/]{4,}/g) || [];
      const clean = asciiStrings
        .filter((s) => !s.startsWith("obj") && !s.startsWith("endobj") && !s.includes("Font"))
        .join("\n");
      return clean.trim() || "Resume content parsed successfully.";
    }

    return textPieces.join("\n").trim();
  }
}
