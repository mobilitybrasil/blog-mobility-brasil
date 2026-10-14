import { SearchIcon } from "@/components/layout/icons";

interface BlogSearchFormProps {
  initialQuery?: string;
  compact?: boolean;
}

export function BlogSearchForm({
  initialQuery = "",
  compact = false,
}: BlogSearchFormProps) {
  return (
    <form
      action="/buscar"
      role="search"
      className={`flex w-full max-w-3xl items-stretch gap-2 rounded-md border border-[var(--color-brand-divider)] bg-white p-1.5 shadow-sm focus-within:border-black ${compact ? "max-w-none" : ""}`}
    >
      <label className="sr-only" htmlFor="blog-search">
        Buscar artigos no blog
      </label>
      <div className="flex min-w-0 flex-1 items-center gap-3 px-2.5">
        <SearchIcon className="size-5 shrink-0 text-neutral-500" />
        <input
          id="blog-search"
          type="search"
          name="q"
          defaultValue={initialQuery}
          placeholder="Ex.: escolher uma cadeira de rodas"
          maxLength={100}
          required
          className="min-w-0 flex-1 border-0 bg-transparent py-2 text-sm text-neutral-900 outline-none placeholder:text-neutral-500 focus:ring-0"
        />
      </div>
      <button
        type="submit"
        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-[4px] bg-[color:var(--color-brand-black)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
      >
        Buscar
      </button>
    </form>
  );
}
