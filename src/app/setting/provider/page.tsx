import Link from "next/link";
import { ProviderSettingForm } from "@/features/providers";

export default function ProviderSettingsPage() {
  return <div className="page-stack narrow-page">
    <header className="page-heading"><span className="eyebrow">Workspace settings</span><h1>Choose your AI provider.</h1><p>Bring your own key. It stays in memory unless you explicitly remember it on this device.</p></header>
    <ProviderSettingForm />
    <div className="form-actions"><Link className="button button-secondary" href="/help">Read privacy guidance</Link></div>
  </div>;
}
