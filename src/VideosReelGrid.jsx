import { useEffect, useRef, useState, useCallback } from "react";
import "./VideosReelGrid.css";

function VideoReelGrid({ videos }) {
  const rowRefs = useRef([]);
  const videoRefs = useRef({});
  const [openId, setOpenId] = useState(null);

  // group videos into rows of 2
  const rows = [];
  for (let i = 0; i < videos.length; i += 2) {
    rows.push(videos.slice(i, i + 2));
  }

  // ---- scroll-based row focus (center row sharp, others dimmed) ----
  const updateRowFocus = useCallback(() => {
    const viewportCenter = window.innerHeight / 2;

    rowRefs.current.forEach((row) => {
      if (!row) return;

      const rect = row.getBoundingClientRect();
      const rowCenter = rect.top + rect.height / 2;
      const distance = Math.abs(viewportCenter - rowCenter);

      // 0 = perfectly centered, 1 = far from center
      const normalized = Math.min(distance / (window.innerHeight * 0.7), 1);

      const opacity = 1 - normalized * 0.65;
      const blur = normalized * 4;
      const scale = 1 - normalized * 0.05;

      row.style.opacity = opacity.toFixed(2);
      row.style.filter = `blur(${blur.toFixed(1)}px)`;
      row.style.transform = `scale(${scale.toFixed(3)})`;
    });
  }, []);

  useEffect(() => {
    let frame = null;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        updateRowFocus();
        frame = null;
      });
    };

    updateRowFocus();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [updateRowFocus]);

  // ---- hover-to-preview (muted autoplay) ----
  const handleEnter = (id) => {
    const el = videoRefs.current[id];
    if (el) {
      el.muted = true;
      el.play().catch(() => {});
    }
  };

  const handleLeave = (id) => {
    const el = videoRefs.current[id];
    if (el) {
      el.pause();
      el.currentTime = 0;
    }
  };

  // ---- click to open fullscreen reel ----
  const openReel = (id) => {
    const el = videoRefs.current[id];
    if (el) {
      el.pause();
      el.currentTime = 0;
    }
    setOpenId(id);
  };

  const closeReel = () => setOpenId(null);

  const openVideo = videos.find((v) => v.id === openId);

  return (
    <div className="reel-grid">
      {rows.map((row, rowIndex) => (
        <div
          className="reel-row"
          key={rowIndex}
          ref={(el) => (rowRefs.current[rowIndex] = el)}
        >
          {row.map((video) => (
            <button
              type="button"
              key={video.id}
              className="reel-card"
              onMouseEnter={() => handleEnter(video.id)}
              onMouseLeave={() => handleLeave(video.id)}
              onClick={() => openReel(video.id)}
              aria-label={`Play ${video.title}`}
            >
              <video
                ref={(el) => (videoRefs.current[video.id] = el)}
                src={video.src}
                muted
                loop
                playsInline
                preload="metadata"
                className="reel-video"
              />
              {video.title && <span className="reel-title">{video.title}</span>}
            </button>
          ))}
        </div>
      ))}

      {openVideo && (
        <div className="reel-overlay" onClick={closeReel}>
          <button
            type="button"
            className="reel-close"
            onClick={(e) => {
              e.stopPropagation();
              closeReel();
            }}
            aria-label="Close"
          >
            ✕
          </button>

          <video
            src={openVideo.src}
            controls
            autoPlay
            playsInline
            className="reel-fullscreen-video"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

export default VideoReelGrid;