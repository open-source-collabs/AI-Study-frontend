const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_PDF_PAGES = 300;
const TEXT_TYPES = new Set(["text/plain", "text/markdown", "text/x-markdown"]);

function assertFileIsSupported(file: File) {
  const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  const isText = TEXT_TYPES.has(file.type) || /\.(txt|md|markdown)$/i.test(file.name);
  if (!isPdf && !isText) throw new Error("Only PDF, TXT, and Markdown files are supported.");
  if (file.size > MAX_FILE_SIZE) throw new Error("Files must be smaller than 10 MB.");
  return isPdf;
}

export async function extractTextFromFile(file: File) {
  const isPdf = assertFileIsSupported(file);
  if (!isPdf) return file.text();

  const { GlobalWorkerOptions, getDocument } = await import("pdfjs-dist/legacy/build/pdf.mjs");
  GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/legacy/build/pdf.worker.mjs", import.meta.url).toString();
  const buffer = await file.arrayBuffer();
  const document = await getDocument({ data: buffer, isEvalSupported: false }).promise;
  const pages: string[] = [];

  try {
    if (document.numPages > MAX_PDF_PAGES) throw new Error(`PDFs can have at most ${MAX_PDF_PAGES} pages.`);
    for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
      const page = await document.getPage(pageNumber);
      const content = await page.getTextContent();
      const text = content.items
        .map((item) => ("str" in item && typeof item.str === "string" ? item.str : ""))
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
      if (text) pages.push(text);
    }
  } finally {
    await document.destroy();
  }

  if (!pages.length) throw new Error("No text layer was found in this PDF. Scanned PDFs are not supported yet.");
  return pages.join("\n\n");
}
