import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

const DEFAULT_SLIDES = [];

function clamp(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), maximum);
}

function wrapIndex(value, total) {
  if (total <= 0) return 0;
  return ((value % total) + total) % total;
}

function getRelativePosition(itemIndex, carouselPosition, total) {
  if (total <= 1) return 0;

  const wrappedPosition = wrapIndex(carouselPosition, total);
  let relative = itemIndex - wrappedPosition;

  if (relative > total / 2) relative -= total;
  if (relative < -total / 2) relative += total;

  return relative;
}

function getHorizontalPosition(relative, activeWidth, sideWidth, gap) {
  const distance = Math.abs(relative);
  if (distance === 0) return 0;

  const firstSidePosition = activeWidth / 2 + gap + sideWidth / 2;
  const additionalStep = sideWidth + gap;
  const position = firstSidePosition + Math.max(0, distance - 1) * additionalStep;

  return relative < 0 ? -position : position;
}

export default function HorizonSlatCarousel({
  slides = DEFAULT_SLIDES,
  autoplay = true,
  autoplayDirection = "rightToLeft",
  autoplayDelay = 2400,
  transitionDuration = 560,
  showArrows = true,
  showContent = true,
  pauseOnHover = true,
  className = "",
  style,
  onIndexChange,
}) {
  const gallerySlides = slides.length > 0 ? slides : DEFAULT_SLIDES;
  const slideCount = gallerySlides.length;

  const rootRef = useRef(null);
  const transitionTimerRef = useRef(null);
  const swipeStartRef = useRef(null);
  const suppressClickRef = useRef(false);

  const [carouselPosition, setCarouselPosition] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(1100);
  const [isPaused, setIsPaused] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);

  const activeWidth = useMemo(
    () => Math.round(clamp(containerWidth * 0.55, 330, 620)),
    [containerWidth]
  );
  const activeHeight = Math.round(activeWidth * 0.66);

  const sideWidth = useMemo(
    () => Math.round(clamp(containerWidth * 0.115, 72, 150)),
    [containerWidth]
  );
  const sideHeight = Math.round(clamp(activeHeight * 0.73, 210, 305));

  const cardGap = useMemo(
    () => Math.round(clamp(containerWidth * 0.022, 14, 30)),
    [containerWidth]
  );

  const visibleRange = Math.max(1, Math.min(4, Math.floor((slideCount - 1) / 2)));

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const updateWidth = () => setContainerWidth(root.getBoundingClientRect().width);
    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    gallerySlides.forEach((slide) => {
      const image = new Image();
      image.src = slide.image;
    });
  }, [gallerySlides]);

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current !== null) {
        window.clearTimeout(transitionTimerRef.current);
      }
    };
  }, []);

  const moveBy = useCallback(
    (direction) => {
      if (slideCount < 2) return;

      setCarouselPosition((currentPosition) => {
        const nextPosition = currentPosition + direction;
        const nextIndex = wrapIndex(nextPosition, slideCount);
        setActiveIndex(nextIndex);
        onIndexChange?.(nextIndex);
        return nextPosition;
      });

      if (transitionTimerRef.current !== null) {
        window.clearTimeout(transitionTimerRef.current);
      }
      transitionTimerRef.current = window.setTimeout(() => {}, transitionDuration);
    },
    [onIndexChange, slideCount, transitionDuration]
  );

  const moveToSlide = useCallback(
    (requestedIndex) => {
      if (requestedIndex === activeIndex || slideCount < 2 || suppressClickRef.current) {
        return;
      }

      let distance = requestedIndex - activeIndex;
      if (distance > slideCount / 2) distance -= slideCount;
      if (distance < -slideCount / 2) distance += slideCount;

      setCarouselPosition((currentPosition) => {
        const nextPosition = currentPosition + distance;
        const nextIndex = wrapIndex(nextPosition, slideCount);
        setActiveIndex(nextIndex);
        onIndexChange?.(nextIndex);
        return nextPosition;
      });

      if (transitionTimerRef.current !== null) {
        window.clearTimeout(transitionTimerRef.current);
      }
      transitionTimerRef.current = window.setTimeout(() => {}, transitionDuration);
    },
    [activeIndex, onIndexChange, slideCount, transitionDuration]
  );

  const openSlide = (index) => {
  console.log("openSlide called", index, "activeIndex:", activeIndex);
  if (index !== activeIndex) {
    moveToSlide(index);
    return;
  }
  setOpenIndex(index);
};
  const closeSlide = () => setOpenIndex(null);

  useEffect(() => {
    if (!autoplay || isPaused || slideCount < 2) return;

    const direction = autoplayDirection === "leftToRight" ? -1 : 1;
    const interval = window.setInterval(() => {
      moveBy(direction);
    }, Math.max(900, autoplayDelay));

    return () => window.clearInterval(interval);
  }, [autoplay, autoplayDelay, autoplayDirection, isPaused, moveBy, slideCount]);

  const handleKeyboard = useCallback(
    (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        moveBy(-1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        moveBy(1);
      }
    },
    [moveBy]
  );

  const handlePointerDown = (event) => {
  swipeStartRef.current = event.clientX;
};

const handlePointerUp = (event) => {
  if (swipeStartRef.current === null) return;

  const distance = event.clientX - swipeStartRef.current;
  swipeStartRef.current = null;

  if (Math.abs(distance) < 48) return;

  suppressClickRef.current = true;
  moveBy(distance < 0 ? 1 : -1);

  window.setTimeout(() => {
    suppressClickRef.current = false;
  }, 120);
};

  const rootStyle = {
    ...style,
    "--slat-duration": `${transitionDuration}ms`,
  };

  return (
    <>
      <style>{`
        .horizon-slat {
          position: relative; width: 100%; height: 100%;
          min-width: 280px; min-height: 560px;
          display: flex; align-items: center; justify-content: center;
          overflow: hidden; isolation: isolate; outline: none;
          user-select: none; touch-action: pan-y;
          background: transparent;

        }
        .horizon-slat::before {
          content: ""; position: absolute; inset: 0; z-index: -2; pointer-events: none; opacity: 0.38;
          background-image:
            linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px);
          background-size: 54px 54px;
          mask-image: radial-gradient(circle at center, black, transparent 72%);
        }
        .horizon-slat::after {
          content: ""; position: absolute; left: 50%; bottom: 57px;
          width: min(660px, 72vw); height: 70px; z-index: -1; pointer-events: none;
          border-radius: 50%; background: rgba(0,0,0,0.7); filter: blur(37px);
          transform: translateX(-50%);
        }
        .horizon-slat__stage { position: absolute; inset: 0; overflow: hidden; isolation: isolate; }
        .horizon-slat__card {
          position: absolute; left: 50%; top: 50%; padding: 0; border: 0; overflow: hidden;
          appearance: none; background: #15171a; transform-origin: center; backface-visibility: hidden;
          -webkit-tap-highlight-color: transparent;
          transition:
            transform var(--slat-duration) cubic-bezier(0.22,1,0.36,1),
            width var(--slat-duration) cubic-bezier(0.22,1,0.36,1),
            height var(--slat-duration) cubic-bezier(0.22,1,0.36,1),
            border-radius var(--slat-duration) cubic-bezier(0.22,1,0.36,1),
            opacity var(--slat-duration) ease,
            filter var(--slat-duration) ease,
            box-shadow var(--slat-duration) ease;
          will-change: transform, width, height, opacity, filter;
        }
        .horizon-slat__card:focus-visible { outline: 2px solid rgba(255,255,255,0.95); outline-offset: 5px; }
        .horizon-slat__card--active {
          box-shadow: 0 35px 95px rgba(0,0,0,0.58), 0 12px 30px rgba(0,0,0,0.36), inset 0 0 0 1px rgba(255,255,255,0.1);
        }
        .horizon-slat__card--side {
          box-shadow: 0 18px 50px rgba(0,0,0,0.46), inset 0 0 0 1px rgba(255,255,255,0.06);
        }
        .horizon-slat__image {
          position: absolute; inset: 0; width: 100%; height: 100%; display: block; object-fit: cover;
          pointer-events: none; user-select: none; transform: scale(1.035);
          transition: transform 850ms cubic-bezier(0.22,1,0.36,1), filter var(--slat-duration) ease;
        }
        .horizon-slat__card--active .horizon-slat__image { transform: scale(1); }
        .horizon-slat__surface {
          position: absolute; inset: 0; z-index: 2; pointer-events: none;
          background: linear-gradient(112deg, rgba(255,255,255,0.18), transparent 22%, transparent 68%, rgba(255,255,255,0.035));
          mix-blend-mode: screen; opacity: 0.36;
        }
        .horizon-slat__side-shade {
          position: absolute; inset: 0; z-index: 2; pointer-events: none;
          background: rgba(0,0,0,0.18); transition: opacity var(--slat-duration) ease;
        }
        .horizon-slat__card--active .horizon-slat__side-shade { opacity: 0; }
        .horizon-slat__content-gradient {
          position: absolute; inset: 0; z-index: 2; pointer-events: none;
          background: linear-gradient(180deg, transparent 34%, rgba(0,0,0,0.82) 100%);
          opacity: 0; transition: opacity 400ms ease;
        }
        .horizon-slat__card--active .horizon-slat__content-gradient { opacity: 1; }
        .horizon-slat__content {
          position: absolute; left: 30px; right: 30px; bottom: 27px; z-index: 3;
          color: #ffffff; text-align: left; pointer-events: none;
          opacity: 0; transform: translateY(15px);
          transition: opacity 380ms ease 120ms, transform 520ms cubic-bezier(0.22,1,0.36,1) 80ms;
        }
        .horizon-slat__card--active .horizon-slat__content { opacity: 1; transform: translateY(0); }
        .horizon-slat__label {
          display: block; margin-bottom: 10px; font-family: Inter, Arial, Helvetica, sans-serif;
          font-size: 10px; font-weight: 700; line-height: 1; letter-spacing: 0.18em;
          text-transform: uppercase; opacity: 0.68;
        }
        .horizon-slat__title {
          display: block; white-space: pre-line; font-family: Inter, Arial, Helvetica, sans-serif;
          font-size: clamp(31px, 4vw, 48px); font-weight: 650; line-height: 0.9;
          letter-spacing: -0.06em; text-shadow: 0 5px 28px rgba(0,0,0,0.52);
        }
        .horizon-slat__arrow {
          position: absolute; top: 50%; z-index: 1000; width: 54px; height: 54px;
          display: grid; place-items: center; padding: 0; border: 1px solid rgba(255,255,255,0.22);
          border-radius: 999px; color: #111111; background: rgba(255,255,255,0.94);
          box-shadow: 0 13px 35px rgba(0,0,0,0.35); backdrop-filter: blur(15px);
          transform: translateY(-50%); cursor: pointer;
          transition: transform 220ms ease, background-color 220ms ease;
        }
        .horizon-slat__arrow:hover { transform: translateY(-50%) scale(1.06); background: #ffffff; }
        .horizon-slat__arrow:active { transform: translateY(-50%) scale(0.96); }
        .horizon-slat__arrow--left { left: clamp(14px, 3.5vw, 54px); }
        .horizon-slat__arrow--right { right: clamp(14px, 3.5vw, 54px); }
        .horizon-slat__arrow svg { width: 21px; height: 21px; pointer-events: none; }
        .horizon-slat__counter {
          position: absolute; left: 50%; bottom: 27px; z-index: 100; display: flex;
          align-items: center; gap: 9px; color: rgba(255,255,255,0.58);
          font-family: Inter, Arial, Helvetica, sans-serif; font-size: 10px; font-weight: 700;
          letter-spacing: 0.13em; transform: translateX(-50%); pointer-events: none;
        }
        .horizon-slat__counter-line { width: 34px; height: 1px; overflow: hidden; background: rgba(255,255,255,0.2); }
        .horizon-slat__counter-progress {
          height: 100%; background: rgba(255,255,255,0.9); transform-origin: left;
          transition: transform var(--slat-duration) cubic-bezier(0.22,1,0.36,1);
        }
        @media (max-width: 680px) {
          .horizon-slat { min-height: 480px; }
          .horizon-slat__arrow { width: 45px; height: 45px; }
          .horizon-slat__content { left: 21px; right: 21px; bottom: 21px; }
          .horizon-slat__counter { bottom: 18px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .horizon-slat__card, .horizon-slat__image, .horizon-slat__content, .horizon-slat__counter-progress {
            transition-duration: 1ms !important;
          }
        }
                .horizon-slat__fullscreen {
          position: fixed;
          inset: 0;
          z-index: 2000;
          background: rgba(0, 0, 0, 0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: horizonFullscreenFade 0.2s ease;
        }

        @keyframes horizonFullscreenFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .horizon-slat__fullscreen-image {
          max-width: 92vw;
          max-height: 92vh;
          border-radius: 12px;
          object-fit: contain;
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6);
        }

        .horizon-slat__fullscreen-close {
          position: fixed;
          top: 24px;
          right: 28px;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: none;
          background: rgba(255, 255, 255, 0.12);
          color: #ffffff;
          font-size: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 2001;
          transition: background 0.2s ease;
        }

        .horizon-slat__fullscreen-close:hover {
          background: rgba(255, 255, 255, 0.25);
        }
      `}</style>

      <section
        ref={rootRef}
        className={`horizon-slat ${className}`}
        style={rootStyle}
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label="Works gallery"
        onKeyDown={handleKeyboard}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => { swipeStartRef.current = null; }}
        onMouseEnter={() => pauseOnHover && setIsPaused(true)}
        onMouseLeave={() => pauseOnHover && setIsPaused(false)}
        onFocus={() => pauseOnHover && setIsPaused(true)}
        onBlur={() => pauseOnHover && setIsPaused(false)}
      >
        <div className="horizon-slat__stage">
          {gallerySlides.map((slide, index) => {
            const relative = getRelativePosition(index, carouselPosition, slideCount);
            const distance = Math.abs(relative);
            const isActive = distance < 0.5;
            const isVisible = distance <= visibleRange;

            const horizontalPosition = getHorizontalPosition(relative, activeWidth, sideWidth, cardGap);
            const cardWidth = isActive ? activeWidth : sideWidth;
            const cardHeight = isActive ? activeHeight : sideHeight;

            const opacity =
              distance <= visibleRange - 0.5 ? 1 : distance <= visibleRange ? 0.35 : 0;

            return (
              <button
                key={slide.id}
                type="button"
                className={["horizon-slat__card", isActive ? "horizon-slat__card--active" : "horizon-slat__card--side"].join(" ")}
                style={{
                  width: cardWidth,
                  height: cardHeight,
                  borderRadius: isActive ? 24 : 17,
                  opacity,
                  zIndex: Math.round(100 - distance * 10),
                  filter: isActive ? "brightness(1) saturate(1)" : `brightness(${Math.max(0.53, 0.76 - distance * 0.055)}) saturate(0.72)`,
                  transform: ["translate(-50%, -50%)", `translate3d(${horizontalPosition}px, 0, 0)`].join(" "),
                  pointerEvents: isVisible ? "auto" : "none",
                  cursor: isActive ? "default" : "pointer",
                }}
                onClick={() => openSlide(index)}
                aria-label={isActive ? `${slide.title.replace("\n", " ")}, current slide` : `Show ${slide.title.replace("\n", " ")}`}
                aria-current={isActive ? "true" : undefined}
                tabIndex={isVisible ? 0 : -1}
              >
                <img
                  className="horizon-slat__image"
                  src={slide.image}
                  alt={slide.alt}
                  draggable={false}
                  style={{ objectPosition: slide.objectPosition || "center" }}
                />
                <span className="horizon-slat__surface" />
                <span className="horizon-slat__side-shade" />

                {showContent && (
                  <>
                    <span className="horizon-slat__content-gradient" />
                    <span className="horizon-slat__content">
                      <span className="horizon-slat__label">{slide.label}</span>
                      <span className="horizon-slat__title">{slide.title}</span>
                    </span>
                  </>
                )}
              </button>
            );
          })}
        </div>

        {showArrows && slideCount > 1 && (
          <>
            <button
              type="button"
              className="horizon-slat__arrow horizon-slat__arrow--left"
              aria-label="Previous slide"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => { e.stopPropagation(); moveBy(-1); }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18 9 12l6-6" />
              </svg>
            </button>
            <button
              type="button"
              className="horizon-slat__arrow horizon-slat__arrow--right"
              aria-label="Next slide"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => { e.stopPropagation(); moveBy(1); }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </>
        )}

        <div className="horizon-slat__counter" aria-hidden="true">
          <span>{String(activeIndex + 1).padStart(2, "0")}</span>
          <span className="horizon-slat__counter-line">
            <span
              className="horizon-slat__counter-progress"
              style={{ display: "block", transform: `scaleX(${(activeIndex + 1) / slideCount})` }}
            />
          </span>
          <span>{String(slideCount).padStart(2, "0")}</span>
        </div>

        {openIndex !== null && gallerySlides[openIndex] && createPortal(
        <div
          className="horizon-slat__fullscreen"
          onClick={closeSlide}
        >
          <button
            type="button"
            className="horizon-slat__fullscreen-close"
            onClick={(e) => {
              e.stopPropagation();
              closeSlide();
            }}
            aria-label="Close"
          >
            ✕
          </button>
          <img
            src={gallerySlides[openIndex].image}
            alt={gallerySlides[openIndex].alt}
            className="horizon-slat__fullscreen-image"
            onClick={(e) => e.stopPropagation()}
          />
        </div>,
        document.body
      )}
      </section>   
    </>
  );
}