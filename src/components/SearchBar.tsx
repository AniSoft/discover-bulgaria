import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/AppButton";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n";


type Props = {
  className?: string;
  id?: string;
  value?: string;
  onSearch?: (query: string) => void;
};

export function SearchBar({ className, id = "site-search", value = "", onSearch }: Props) {
  const [query, setQuery] = useState(value);
  const t = useT();

  useEffect(() => {
    setQuery(value);
  }, [value]);

  return (
    <form
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        const term = query.trim();
        // Raw search text is never sent to analytics; the results module
        // reports a privacy-safe `search` event (language, counts only).
        onSearch?.(term);
      }}
      className={cn(
        "flex w-full flex-col gap-2 rounded-2xl border border-border/60 bg-card p-2 sm:flex-row sm:items-center sm:rounded-full sm:p-2",
        className,
      )}
    >
      <label htmlFor={id} className="sr-only">
        {t("common.searchLabel")}
      </label>
      <div className="flex flex-1 items-center gap-3 px-3">
        <Search className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
        <input
          id={id}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t("common.searchPlaceholder")}
          className="h-12 w-full bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
        />
      </div>
      <Button type="submit" size="lg" className="sm:rounded-full">
        {t("common.search")}
      </Button>
    </form>
  );
}
