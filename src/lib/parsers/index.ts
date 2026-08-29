import { ResumeParser, RawResumeData } from "./resume-parser";
import { PdfResumeParser } from "./pdf-parser";
import { DocxResumeParser } from "./docx-parser";

export * from "./resume-parser";
export * from "./pdf-parser";
export * from "./docx-parser";

const parsers: ResumeParser[] = [new PdfResumeParser(), new DocxResumeParser()];

/**
 * Parses an uploaded resume buffer using the appropriate concrete parser.
 */
export async function parseResumeDocument(
  buffer: Buffer,
  mimeType: string,
  fileName?: string
): Promise<RawResumeData> {
  const matchingParser = parsers.find((p) => p.supports(mimeType, fileName));

  if (!matchingParser) {
    // Fallback: try plain text
    const text = buffer.toString("utf-8");
    return {
      text,
      sections: [
        {
          heading: "Full Document",
          content: text,
          lines: text.split("\n"),
        },
      ],
      metadata: {
        charCount: text.length,
        wordCount: text.split(/\s+/).filter(Boolean).length,
      },
    };
  }

  return matchingParser.parse(buffer, fileName);
}
