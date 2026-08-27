import { Search } from "lucide-react";
import { Button } from "@/components/AppButton";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  id?: string;
};

export function SearchBar({ className, id = "site-search" }: Props) {
  return (
    <form
      role="search"
      onSubmit={(event) => event.preventDefault()}
      className={cn(
        "flex w-full flex-col gap-2 rounded-2xl border border-border/60 bg-card p-2 sm:flex-row sm:items-center sm:rounded-full sm:p-2",
        className,
      )}
    >
      <label htmlFor={id} className="sr-only">
        Search places, regions or experiences
      </label>
      <div className="flex flex-1 items-center gap-3 px-3">
        <Search className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
        <input
          id={id}
          type="search"
          placeholder="Search places, regions or experiences..."
          className="h-12 w-full bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
        />
      </div>
      <Button type="submit" size="lg" className="sm:rounded-full">
        Search
      </Button>
    </form>
  );
}
