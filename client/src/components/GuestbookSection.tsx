import { useEffect, useRef, useState, type CSSProperties } from "react";
import { trpc } from "@/lib/trpc";
import { sideLabel } from "@shared/rsvpConstants";
import { FloralDivider } from "./Ornaments";
import { Reveal } from "./Reveal";

const FIRST_PAGE = 3;
const NEXT_PAGE = 6;

type Entry = { id: number; name: string; side: "mariee" | "marie"; message: string | null };

/** Les mots apparaissent progressivement quand la carte devient visible. */
function GuestbookCard({ entry, index }: { entry: Entry; index: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const text = entry.message ?? "";
  const long = text.length > 220;

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return setVisible(true);
    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const words = text.split(/\s+/).filter(Boolean);
  return (
    <li
      ref={ref}
      className={`reveal relative rounded-[1.4rem] border border-gold/40 bg-white p-5 shadow-[0_20px_40px_-28px_rgb(28_20_16/0.6)] sm:p-6 ${
        visible ? "is-visible" : ""
      } ${index % 3 === 1 ? "md:translate-y-5" : ""}`}
    >
      <span className="absolute -top-4 left-5 font-serif text-6xl leading-none text-gold/50" aria-hidden="true">
        “
      </span>
      <p className={`whitespace-pre-line font-serif text-lg leading-relaxed text-ink ${long && !open ? "line-clamp-5" : ""}`}>
        {visible ? (
          <>
            <span className="sr-only">{text}</span>
            <span aria-hidden="true">
              {words.map((w, i) => (
                <span key={i} className="word-in" style={{ "--i": Math.min(i, 40) } as CSSProperties}>
                  {w}{" "}
                </span>
              ))}
            </span>
          </>
        ) : (
          <span className="opacity-0">{text}</span>
        )}
      </p>
      {long && (
        <button type="button" onClick={() => setOpen((o) => !o)} className="mt-1 text-sm text-gold-deep underline underline-offset-4">
          {open ? "Réduire" : "Lire la suite"}
        </button>
      )}
      <p className="mt-3 text-sm font-medium text-cocoa">
        — {entry.name}
        <span className="ml-2 text-xs font-normal text-muted">{sideLabel(entry.side)}</span>
      </p>
    </li>
  );
}

export function GuestbookSection() {
  const [extra, setExtra] = useState<Entry[]>([]);
  const [hasMore, setHasMore] = useState<boolean | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const utils = trpc.useUtils();
  const first = trpc.guestbook.list.useQuery({ offset: 0, limit: FIRST_PAGE }, { staleTime: 60_000 });

  const entries = [...(first.data?.items ?? []), ...extra];
  const more = hasMore ?? first.data?.hasMore ?? false;

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const page = await utils.guestbook.list.fetch({ offset: entries.length, limit: NEXT_PAGE });
      setExtra((prev) => [...prev, ...page.items.filter((p) => !entries.some((e) => e.id === p.id))]);
      setHasMore(page.hasMore);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <section id="livre-dor" className="paper px-5 py-20 sm:py-24" aria-labelledby="guestbook-title">
      <div className="mx-auto max-w-5xl">
        <Reveal className="text-center">
          <p className="eyebrow">Livre d’or</p>
          <h2 id="guestbook-title" className="mt-2 text-4xl sm:text-5xl">
            Vos mots doux
          </h2>
          <p className="mx-auto mt-3 max-w-lg font-display text-lg italic text-ink">
            Chaque bénédiction que vous nous laissez, nous la lisons et nous la gardons.
          </p>
        </Reveal>

        {first.isLoading && <p className="mt-10 text-center text-muted">Chargement des messages…</p>}
        {first.isError && (
          <p className="mt-10 text-center text-muted">Les messages ne peuvent pas s’afficher pour le moment.</p>
        )}
        {first.data && entries.length === 0 && (
          <p className="mt-10 text-center font-display text-lg italic text-ink">
            Soyez le premier à nous écrire un mot, en confirmant votre réponse ci-dessous.
          </p>
        )}

        {entries.length > 0 && (
          <ul className="mt-12 grid gap-8 md:grid-cols-3 md:gap-6">
            {entries.map((e, i) => (
              <GuestbookCard key={e.id} entry={e} index={i} />
            ))}
          </ul>
        )}

        {more && (
          <div className="mt-12 text-center">
            <button type="button" onClick={loadMore} disabled={loadingMore} className="btn-ghost">
              {loadingMore ? "Chargement…" : "Voir plus"}
            </button>
          </div>
        )}
        <FloralDivider className="mt-16" />
      </div>
    </section>
  );
}
