"use client";

import {
  type CSSProperties,
  type MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AngleLeftIcon,
  AngleRightIcon,
  ExpandIcon,
  VolumeOffIcon,
  VolumeOnIcon,
} from "@/components/layout/icons";
import type { VideoShowcaseItem } from "@/lib/parseVideoShowcase";

interface VideoShowcaseCarouselProps {
  items: VideoShowcaseItem[];
}

const DESKTOP_MEDIA_QUERY = "(min-width: 1024px)";

// Proporção dos cards no eixo X em relação ao container.
//
// Mobile:  1 card central + ~12% peek em cada lateral.
// Desktop: 1 + 2.5 + 2.5 = 6 cards visíveis (com meio card cortado em
// cada extremidade da viewport do carrossel).
const MOBILE_CARD_PCT = 0.74;
const MOBILE_GAP = 12;
const DESKTOP_CARD_PCT = 0.155;
const DESKTOP_GAP = 16;
const TRANSITION_MS = 320;

export function VideoShowcaseCarousel({ items }: VideoShowcaseCarouselProps) {
  const trackContainerRef = useRef<HTMLDivElement>(null);
  const [containerW, setContainerW] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [muted, setMuted] = useState(true);

  const N = items.length;

  // Triplicamos a lista para criar a sensação de loop infinito: rodamos
  // sempre no terço do meio e fazemos um "snap" silencioso (sem
  // transição) quando o índice cruza para a primeira ou terceira cópia.
  const tripled = useMemo(() => [...items, ...items, ...items], [items]);

  const [activeIdx, setActiveIdx] = useState(N);
  const [transition, setTransition] = useState(true);

  useEffect(() => {
    const mql = window.matchMedia(DESKTOP_MEDIA_QUERY);
    function handle() {
      setIsDesktop(mql.matches);
    }
    handle();
    mql.addEventListener("change", handle);
    return () => mql.removeEventListener("change", handle);
  }, []);

  useEffect(() => {
    const el = trackContainerRef.current;
    if (!el) return;
    setContainerW(el.clientWidth);
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? 0;
      setContainerW(w);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const cardPct = isDesktop ? DESKTOP_CARD_PCT : MOBILE_CARD_PCT;
  const gap = isDesktop ? DESKTOP_GAP : MOBILE_GAP;
  const cardW = containerW * cardPct;
  const trackOffset =
    containerW / 2 - cardW / 2 - activeIdx * (cardW + gap);

  const handleTransitionEnd = useCallback(() => {
    if (N === 0) return;
    // Quando saímos do "meio" da triplicata, pulamos sem transição para a
    // posição equivalente no terço central.
    if (activeIdx >= 2 * N) {
      setTransition(false);
      setActiveIdx((i) => i - N);
    } else if (activeIdx < N) {
      setTransition(false);
      setActiveIdx((i) => i + N);
    }
  }, [activeIdx, N]);

  useEffect(() => {
    if (transition) return;
    // Reabilita transição após o snap silencioso, no próximo frame.
    const id = requestAnimationFrame(() => setTransition(true));
    return () => cancelAnimationFrame(id);
  }, [transition]);

  const goPrev = () => setActiveIdx((i) => i - 1);
  const goNext = () => setActiveIdx((i) => i + 1);
  const goToLogical = (logical: number) => setActiveIdx(N + logical);

  const activeLogical = N === 0 ? 0 : ((activeIdx % N) + N) % N;

  if (N === 0) return null;

  return (
    <div className="flex flex-col gap-6">
      <div ref={trackContainerRef} className="relative overflow-hidden">
        <div
          className="flex"
          style={{
            transform: `translate3d(${trackOffset}px, 0, 0)`,
            transition: transition
              ? `transform ${TRANSITION_MS}ms ease-out`
              : "none",
            gap: `${gap}px`,
            willChange: "transform",
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {tripled.map((item, idx) => {
            const isActive = idx === activeIdx;
            const dist = Math.abs(idx - activeIdx);
            // Mantém apenas o vídeo ativo e seus vizinhos no DOM com origem.
            // O carrossel triplicado não deve iniciar 21 requisições de mídia.
            const shouldLoad = dist <= 1;
            return (
              <VideoCard
                key={`v-${idx}`}
                item={item}
                isActive={isActive}
                shouldLoad={shouldLoad}
                muted={muted}
                onToggleMute={() => setMuted((m) => !m)}
                onFocusClick={() => setActiveIdx(idx)}
                cardWidthPx={cardW}
              />
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={goPrev}
          aria-label="Vídeo anterior"
          className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-[#f1f1f1] text-[#373435]"
        >
          <AngleLeftIcon className="size-5" />
        </button>

        <div className="flex items-center gap-2" role="tablist">
          {items.map((_, index) => {
            const isActiveDot = index === activeLogical;
            return (
              <button
                key={`dot-${index}`}
                type="button"
                role="tab"
                aria-selected={isActiveDot}
                aria-label={`Ir para vídeo ${index + 1}`}
                onClick={() => goToLogical(index)}
                className={
                  isActiveDot
                    ? "h-2 w-8 rounded-full bg-black transition-all"
                    : "size-2 cursor-pointer rounded-full bg-[#d4d4d4] transition-all"
                }
              />
            );
          })}
        </div>

        <button
          type="button"
          onClick={goNext}
          aria-label="Próximo vídeo"
          className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-[#f1f1f1] text-[#373435]"
        >
          <AngleRightIcon className="size-5" />
        </button>
      </div>
    </div>
  );
}

interface VideoCardProps {
  item: VideoShowcaseItem;
  isActive: boolean;
  shouldLoad: boolean;
  muted: boolean;
  onToggleMute: () => void;
  onFocusClick: () => void;
  cardWidthPx: number;
}

function VideoCard({
  item,
  isActive,
  shouldLoad,
  muted,
  onToggleMute,
  onFocusClick,
  cardWidthPx,
}: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Só o ativo dá play. Os vizinhos mantêm metadata para troca rápida;
  // cards distantes liberam o recurso de mídia.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isActive) {
      v.muted = muted;
      const promise = v.play();
      if (promise && typeof promise.catch === "function") {
        promise.catch(() => {
          /* navegador bloqueou autoplay; usuário pode tocar manualmente */
        });
      }
      return;
    }
    v.pause();
    if (!shouldLoad) {
      v.load();
      return;
    }
    try {
      v.currentTime = 0;
    } catch {
      /* alguns formatos lançam quando seek antes do metadata; ignorar */
    }
  }, [isActive, muted, shouldLoad]);

  // Garante que o `muted` HTML se mantém em sync com o estado do
  // carrossel mesmo quando o card já está renderizado.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = muted;
  }, [muted]);

  const handleFullscreen = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    type VendorFs = HTMLVideoElement & {
      webkitEnterFullscreen?: () => void;
      webkitRequestFullscreen?: () => Promise<void> | void;
    };
    const vendor = v as VendorFs;
    if (typeof v.requestFullscreen === "function") {
      v.requestFullscreen().catch(() => {});
      return;
    }
    if (typeof vendor.webkitRequestFullscreen === "function") {
      vendor.webkitRequestFullscreen();
      return;
    }
    if (typeof vendor.webkitEnterFullscreen === "function") {
      vendor.webkitEnterFullscreen();
    }
  };

  const handleMuteClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onToggleMute();
  };

  const handleCardClick = () => {
    if (!isActive) onFocusClick();
  };

  const style: CSSProperties = {
    width: `${cardWidthPx}px`,
  };

  return (
    <div
      className={[
        "relative aspect-[9/16] shrink-0 overflow-hidden rounded-[12px] bg-black",
        isActive ? "" : "cursor-pointer",
      ].join(" ")}
      style={style}
      onClick={handleCardClick}
      aria-hidden={!isActive}
    >
      <video
        ref={videoRef}
        src={shouldLoad ? item.src : undefined}
        poster={item.poster ?? undefined}
        className="size-full object-cover"
        playsInline
        muted={muted}
        loop
        preload={isActive ? "auto" : shouldLoad ? "metadata" : "none"}
        onLoadedMetadata={(event) => {
          // Força o 1º frame a renderizar nos cards inativos — sem isso
          // Safari/Firefox podem ficar com fundo preto até dar play.
          if (!isActive) {
            const target = event.currentTarget;
            try {
              target.currentTime = 0.01;
            } catch {
              /* ignore */
            }
          }
        }}
      />

      {isActive && (
        <div className="pointer-events-none absolute inset-0 flex items-end justify-end gap-2 p-3">
          <button
            type="button"
            onClick={handleMuteClick}
            aria-label={muted ? "Ativar som" : "Desativar som"}
            aria-pressed={!muted}
            className="pointer-events-auto flex size-9 cursor-pointer items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition hover:bg-black/70"
          >
            {muted ? (
              <VolumeOffIcon className="size-5" />
            ) : (
              <VolumeOnIcon className="size-5" />
            )}
          </button>
          <button
            type="button"
            onClick={handleFullscreen}
            aria-label="Abrir em tela cheia"
            className="pointer-events-auto flex size-9 cursor-pointer items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition hover:bg-black/70"
          >
            <ExpandIcon className="size-5" />
          </button>
        </div>
      )}
    </div>
  );
}
