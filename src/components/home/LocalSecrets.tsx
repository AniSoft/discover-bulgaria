import { LocalSecretCard } from "@/components/LocalSecretCard";
import { SectionHeading } from "@/components/SectionHeading";
import { localSecrets } from "@/data/localSecrets";
import { useT } from "@/lib/i18n";

export function LocalSecrets() {
  const t = useT();
  return (
    <section className="topo-lines relative overflow-hidden bg-forest-deep py-20 text-primary-foreground md:py-28">
      <div className="container-page relative">
        <SectionHeading
          tone="inverted"
          eyebrow={t("localSecrets.eyebrow")}
          title={t("localSecrets.notesTitle")}
          description={t("localSecrets.description")}
        />
        <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
          {localSecrets.map((secret) => (
            <LocalSecretCard key={secret.id} secret={secret} />
          ))}
        </div>
      </div>
    </section>
  );
}
