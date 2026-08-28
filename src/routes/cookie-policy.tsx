import { createFileRoute } from "@tanstack/react-router";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { useLocale } from "@/lib/i18n";
import { readLocale } from "@/lib/i18n/locale";
import { COOKIE_DOC } from "@/lib/legal/content";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/cookie-policy")({
  loader: () => ({ locale: readLocale() }),
  head: ({ loaderData }) => {
    const doc = COOKIE_DOC[loaderData?.locale ?? "en"];
    return seo({
      title: doc.metaTitle,
      description: doc.metaDescription,
      path: "/cookie-policy",
    });
  },
  component: CookiePolicyPage,
});

function CookiePolicyPage() {
  const { locale } = useLocale();
  return <LegalDocument doc={COOKIE_DOC[locale]} />;
}
