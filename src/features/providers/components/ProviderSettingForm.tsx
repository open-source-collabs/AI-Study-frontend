"use client";

import { useState } from "react";
import { Button } from "@/core/components/Button";
import { Card } from "@/core/components/Card";
import { Chip } from "@/core/components/Chip";
import { Input } from "@/core/components/input";
import { useProvider } from "../hooks/useProvider";
import { PROVIDERS } from "../types";

export function ProviderSettingForm() {
  const provider = useProvider();
  const [status, setStatus] = useState<string | null>(null);
  const definition = PROVIDERS.find((item) => item.id === provider.providerId) ?? PROVIDERS[0];

  async function handleSave() {
    if (!provider.apiKey.trim()) {
      setStatus("Add an API key before saving.");
      return;
    }
    await provider.save();
    setStatus(provider.rememberOnDevice ? "Provider saved on this device." : "Provider saved for this session only.");
  }

  async function handleRemove() {
    await provider.removeRemembered();
    setStatus("Remembered key removed from this device.");
  }

  return <Card><div className="section-heading compact"><div><span className="eyebrow">Provider</span><h2>Connection setup</h2></div><Chip className="chip-teal">Session first</Chip></div>
    <label className="field-label" htmlFor="provider">AI provider</label>
    <select className="input" id="provider" onChange={(event) => provider.setSettings({ providerId: event.target.value as typeof provider.providerId })} value={provider.providerId}>{PROVIDERS.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select>
    <label className="field-label" htmlFor="provider-model">Model</label>
    <Input id="provider-model" onChange={(event) => provider.setSettings({ model: event.target.value })} placeholder={definition.modelHint} value={provider.model} />
    <label className="field-label" htmlFor="api-key">API key</label>
    <Input autoComplete="off" id="api-key" onChange={(event) => provider.setSettings({ apiKey: event.target.value })} placeholder="Paste your provider key" type="password" value={provider.apiKey} />
    <label className="remember-option"><input checked={provider.rememberOnDevice} onChange={(event) => provider.setSettings({ rememberOnDevice: event.target.checked })} type="checkbox" />Remember this key on this device</label>
    <p className="field-help">Keys stay in memory by default. If you opt in, the key is stored only in this browser&apos;s IndexedDB and never in a public environment variable.</p>
    <div className="form-actions"><Button onClick={handleSave} type="button">Save provider</Button>{provider.hasRememberedKey && <Button onClick={handleRemove} type="button" variant="ghost">Remove remembered key</Button>}{status && <span className="status-message">{status}</span>}</div>
  </Card>;
}
