import { useT } from "@/lib/i18n";

export function EditorialIntro() {
  const t = useT();

  return (
    <section className="topo-lines relative overflow-hidden bg-card py-20 text-forest md:py-28">
      <div className="container-page relative grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-20">
        <div>
          <p className="flex items-center gap-3 text-accent">
            <span className="h-px w-8 bg-current" aria-hidden="true" />
            <span className="eyebrow">{t("intro.eyebrow")}</span>
          </p>
          <p className="eyebrow mt-8 text-muted-foreground">{t("intro.route")} 01 / 08</p>
        </div>

        <div>
          <h2 className="text-[2rem] leading-[1.06] text-foreground sm:text-4xl md:text-[3.25rem]">
            {t("intro.titleLineOne")}
            <br />
            <span className="italic text-accent">{t("intro.titleLineTwo")}</span>
          </h2>
          <p className="measure-prose mt-7 text-base leading-[1.85] text-muted-foreground md:text-lg">
            {t("intro.body")}
          </p>
        </div>
      </div>
    </section>
  );
}
