import { Card } from "@/core/components/Card";

type FeaturePlaceholderProps = { title: string; description: string };

export function FeaturePlaceholder({ title, description }: FeaturePlaceholderProps) {
  return (
    <div className="page-stack">
      <div className="page-heading">
        <span className="eyebrow">Coming in the next phase</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <Card className="empty-card">
        <span className="empty-icon" aria-hidden="true">···</span>
        <h2>Frontend foundation ready</h2>
        <p>This route is reserved for the feature flow defined in the project phases.</p>
      </Card>
    </div>
  );
}
