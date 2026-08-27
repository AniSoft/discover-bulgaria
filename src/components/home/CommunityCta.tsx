import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/AppButton";

export function CommunityCta() {
  return (
    <section className="container-page pb-4">
      <div className="rounded-[var(--radius-card)] bg-primary px-6 py-16 text-center md:px-16 md:py-20">
        <h2 className="mx-auto max-w-2xl text-3xl leading-tight text-primary-foreground sm:text-4xl md:text-[2.75rem]">
          Know a place worth discovering?
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-primary-foreground/80">
          Share your favorite corner of Bulgaria and help others experience it too.
        </p>
        <ButtonLink to="/places/new" variant="accent" size="lg" className="mt-8">
          Add a Place
          <ArrowRight className="size-4" aria-hidden="true" />
        </ButtonLink>
      </div>
    </section>
  );
}
