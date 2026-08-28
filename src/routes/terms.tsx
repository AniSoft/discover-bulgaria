import { createFileRoute } from "@tanstack/react-router";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { useLocale } from "@/lib/i18n";
import { readLocale } from "@/lib/i18n/locale";
import { TERMS_DOC } from "@/lib/legal/content";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/terms")({
  loader: () => ({ locale: readLocale() }),
  head: ({ loaderData }) => {
    const doc = TERMS_DOC[loaderData?.locale ?? "en"];
    return seo({ title: doc.metaTitle, description: doc.metaDescription, path: "/terms" });
  },
  component: TermsPage,
});

function TermsPage() {
  const { locale } = useLocale();
  return <LegalDocument doc={TERMS_DOC[locale]} />;
}
