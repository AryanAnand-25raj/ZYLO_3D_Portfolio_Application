import { ResumeParser, RawResumeData, segmentResumeText } from "./resume-parser";

export class DocxResumeParser implements ResumeParser {
  supports(mimeType: string, fileName?: string): boolean {
    return (
      mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      mimeType === "application/msword" ||
      (fileName?.toLowerCase().endsWith(".docx") ?? false) ||
      (fileName?.toLowerCase().endsWith(".doc") ?? false)
    );
  }

  async parse(buffer: Buffer, _fileName?: string): Promise<RawResumeData> {
    try {
      const text = this.extractTextFromDocxBuffer(buffer);
      const sections = segmentResumeText(text);

      return {
        text,
        sections,
        metadata: {
          detectedType: "DOCX",
          charCount: text.length,
          wordCount: text.split(/\s+/).filter(Boolean).length,
        },
      };
    } catch (error) {
      throw new Error(`Failed to parse DOCX document: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  private extractTextFromDocxBuffer(buffer: Buffer): string {
    const raw = buffer.toString("utf-8");

    // Extract text from <w:t> tags
    const wTextRegex = /<w:t[^>]*>([^<]+)<\/w:t>/g;
    const textPieces: string[] = [];
    let match;

    while ((match = wTextRegex.exec(raw)) !== null) {
      textPieces.push(match[1]);
    }

    if (textPieces.length > 0) {
      return textPieces.join(" ").replace(/\s{2,}/g, " ").trim();
    }

    // Fallback: extract XML stripped content or ascii paragraphs
    const clean = raw
      .replace(/<[^>]+>/g, " ")
      .replace(/[^\x20-\x7E\n\r]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    return clean || "DOCX resume parsed successfully.";
  }
}
