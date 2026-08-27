import { LocalSecretCard } from "@/components/LocalSecretCard";
import { SectionHeading } from "@/components/SectionHeading";
import { localSecrets } from "@/data/localSecrets";
import { useT } from "@/lib/i18n";

export function LocalSecrets() {
  const t = useT();
  return (
    <section className="py-20 md:py-24">
      <div className="container-page">
        <SectionHeading
          eyebrow={t("localSecrets.eyebrow")}
          title={t("localSecrets.title")}
          description={t("localSecrets.description")}
        />
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {localSecrets.map((secret) => (
            <LocalSecretCard key={secret.title} secret={secret} />
          ))}
        </div>
      </div>
    </section>
  );
}
