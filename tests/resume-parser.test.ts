import { describe, it, expect } from "vitest";
import {
  PdfResumeParser,
  DocxResumeParser,
  parseResumeDocument,
  segmentResumeText,
} from "../src/lib/parsers";

describe("Resume Document Parsers", () => {
  describe("PdfResumeParser", () => {
    it("supports PDF mime types and extensions", () => {
      const parser = new PdfResumeParser();
      expect(parser.supports("application/pdf")).toBe(true);
      expect(parser.supports("application/octet-stream", "resume.pdf")).toBe(true);
      expect(parser.supports("text/plain", "notes.txt")).toBe(false);
    });

    it("parses simulated PDF stream buffers", async () => {
      const parser = new PdfResumeParser();
      const mockPdfBuffer = Buffer.from(
        "%PDF-1.4\n1 0 obj\n<<\n/Length 44\n>>\nstream\nBT\n/F1 12 Tf\n(Alex Vance) Tj\n(Lead 3D Web Engineer) Tj\n(Experience) Tj\n(Aura Spatial - 2023) Tj\nET\nendstream\nendobj",
        "utf-8"
      );

      const parsed = await parser.parse(mockPdfBuffer, "resume.pdf");
      expect(parsed.text).toContain("Alex Vance");
      expect(parsed.text).toContain("Lead 3D Web Engineer");
      expect(parsed.sections.length).toBeGreaterThan(0);
    });
  });

  describe("DocxResumeParser", () => {
    it("supports DOCX mime types and extensions", () => {
      const parser = new DocxResumeParser();
      expect(
        parser.supports(
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        )
      ).toBe(true);
      expect(parser.supports("application/octet-stream", "cv.docx")).toBe(true);
    });

    it("extracts text from XML paragraph tags", async () => {
      const parser = new DocxResumeParser();
      const mockDocxXml = Buffer.from(
        '<?xml version="1.0" encoding="UTF-8"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p><w:r><w:t>Alex Vance</w:t></w:r></w:p><w:p><w:r><w:t>EXPERIENCE</w:t></w:r></w:p><w:p><w:r><w:t>Lead 3D Web Engineer at Aura Spatial</w:t></w:r></w:p></w:body></w:document>',
        "utf-8"
      );

      const parsed = await parser.parse(mockDocxXml, "resume.docx");
      expect(parsed.text).toContain("Alex Vance");
      expect(parsed.text).toContain("Lead 3D Web Engineer");
    });
  });

  describe("segmentResumeText", () => {
    it("identifies standard resume sections correctly", () => {
      const rawText = `Alex Vance
alex@zylo.design

EXPERIENCE
Aura Spatial — Lead Engineer (2023 - Present)
Built real-time WebGL canvas architecture.

EDUCATION
Stanford University — B.S. Computer Science (2018 - 2022)

SKILLS
TypeScript, Three.js, React, WebGL, Next.js`;

      const sections = segmentResumeText(rawText);
      expect(sections.length).toBeGreaterThanOrEqual(3);
      expect(sections.some((s) => /experience/i.test(s.heading))).toBe(true);
      expect(sections.some((s) => /skills/i.test(s.heading))).toBe(true);
    });
  });
});
