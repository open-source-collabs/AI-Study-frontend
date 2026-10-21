import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Button } from "./Button";
import { Card } from "./Card";
import { Chip } from "./Chip";

describe("shared components", () => {
  it("renders the Phase 0 component primitives with their public classes", () => {
    const html = renderToStaticMarkup(
      <Card>
        <Chip>Ready</Chip>
        <Button>Start studying</Button>
      </Card>,
    );

    expect(html).toContain('class="card"');
    expect(html).toContain('class="chip"');
    expect(html).toContain('class="button button-primary"');
    expect(html).toContain("Start studying");
  });
});
