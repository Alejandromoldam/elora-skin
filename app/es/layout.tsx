import SetHtmlLang from "@/components/elora/SetHtmlLang";

export default function SpanishLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SetHtmlLang lang="es" />
      {children}
    </>
  );
}
