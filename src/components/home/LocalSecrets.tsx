import { LocalSecretCard } from "@/components/LocalSecretCard";
import { SectionHeading } from "@/components/SectionHeading";
import { localSecrets } from "@/data/localSecrets";

export function LocalSecrets() {
  return (
    <section className="py-20 md:py-24">
      <div className="container-page">
        <SectionHeading
          eyebrow="Local Secrets"
          title="Discover what locals know"
          description="The best places aren't always in the guidebooks. Discover authentic tips and hidden details shared by people who know Bulgaria."
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
