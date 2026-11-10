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
      className={`flex w-full max-w-3xl items-stretch gap-2 rounded-md border border-[#b8b8b8] bg-white p-1 transition focus-within:border-[#020205] focus-within:ring-2 focus-within:ring-[#020205]/15 ${compact ? "max-w-none" : ""}`}
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
          placeholder="Ex.: cadeira de rodas, postura ou acessórios"
          maxLength={100}
          required
          className="min-w-0 flex-1 border-0 bg-transparent py-2 text-sm text-neutral-900 outline-none placeholder:text-neutral-500 focus:ring-0"
        />
      </div>
      <button
        type="submit"
        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-[3px] bg-[#020205] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#353535] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#020205]"
      >
        Buscar artigos
      </button>
    </form>
  );
}
