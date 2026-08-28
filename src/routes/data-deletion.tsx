import { createFileRoute } from "@tanstack/react-router";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { useLocale } from "@/lib/i18n";
import { readLocale } from "@/lib/i18n/locale";
import { DATA_DELETION_DOC } from "@/lib/legal/content";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/data-deletion")({
  loader: () => ({ locale: readLocale() }),
  head: ({ loaderData }) => {
    const doc = DATA_DELETION_DOC[loaderData?.locale ?? "en"];
    return seo({
      title: doc.metaTitle,
      description: doc.metaDescription,
      path: "/data-deletion",
    });
  },
  component: DataDeletionPage,
});

function DataDeletionPage() {
  const { locale } = useLocale();
  return <LegalDocument doc={DATA_DELETION_DOC[locale]} />;
}
