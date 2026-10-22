"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/core/components/Button";
import { Card } from "@/core/components/Card";
import { Input } from "@/core/components/Input";
import { useAddMaterial } from "../hooks/useAddMaterial";

export function UploadDropzone() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const { addFile, addMaterial, error, isSaving } = useAddMaterial();

  async function handleFile(file?: File) {
    if (!file) return;
    setStatus("Extracting text...");
    try {
      const studySet = await addFile(file, title);
      setTitle("");
      setStatus("Material saved to your study sets.");
      router.push(`/sets/${studySet.id}/summary`);
    } catch {
      setStatus(null);
    }
  }

  async function handleNotesSubmit() {
    setStatus("Saving notes...");
    try {
      const studySet = await addMaterial({ title, sourceName: "Pasted notes", sourceType: "text", text: notes });
      setTitle("");
      setNotes("");
      setStatus("Notes saved to your study sets.");
      router.push(`/sets/${studySet.id}/summary`);
    } catch {
      setStatus(null);
    }
  }

  return <Card className="material-import-card">
    <div className="section-heading compact"><div><span className="eyebrow">Upload</span><h2>Add study material</h2></div><span className="chip chip-teal">On-device</span></div>
    <p className="field-help">Upload a text-layer PDF, TXT, or Markdown file, or paste notes. Your material stays in this browser.</p>
    <label className="field-label" htmlFor="material-title">Study set title</label>
    <Input id="material-title" onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Operating systems" value={title} />
    <div className="upload-actions">
      <input accept=".pdf,.txt,.md,.markdown,text/plain,text/markdown,application/pdf" className="visually-hidden" onChange={(event) => { const file = event.target.files?.[0]; event.target.value = ""; void handleFile(file); }} ref={fileInputRef} type="file" />
      <Button disabled={isSaving} onClick={() => fileInputRef.current?.click()} type="button" variant="secondary">Choose PDF or notes file</Button>
      <span className="muted-text">Max 10 MB · text PDFs only</span>
    </div>
    <label className="field-label" htmlFor="material-notes">Or paste notes</label>
    <textarea className="input material-textarea" id="material-notes" onChange={(event) => setNotes(event.target.value)} placeholder="Paste lecture notes or Markdown here..." rows={5} value={notes} />
    <div className="form-actions"><Button disabled={isSaving || !notes.trim()} onClick={handleNotesSubmit} type="button">Save notes</Button>{status && <span className="status-message">{status}</span>}</div>
    {error && <p className="form-error" role="alert">{error}</p>}
  </Card>;
}
