import { Suspense, type ReactNode } from "react";
import { SetTabs } from "@/features/study-sets";

export default function StudySetLayout({ children, params }: Readonly<{ children: ReactNode; params: Promise<{ setId: string }> }>) {
  return <>
    <Suspense fallback={null}>{params.then(({ setId }) => <SetTabs setId={setId} />)}</Suspense>
    {children}
  </>;
}
