import { useEffect, useRef, useState } from "react";
import "./Footer.css";

/* ---------- EDIT THESE ---------- */
const EMAIL = "you@example.com";

/* Your social links. Shown in this order.
   - To REMOVE an icon: delete its line.
   - To ADD one: add a line with an id from this list:
     instagram, linkedin, telegram, tiktok, youtube, behance, x, facebook, whatsapp
   - href must be the FULL link and start with https://        */
const SOCIALS = [
  { id: "instagram", label: "Instagram", href: "https://instagram.com/YOUR_USERNAME" },
  { id: "linkedin",  label: "LinkedIn",  href: "https://www.linkedin.com/in/YOUR_NAME" },
  { id: "telegram",  label: "Telegram",  href: "https://t.me/YOUR_USERNAME" },
  { id: "tiktok",    label: "TikTok",    href: "https://www.tiktok.com/@YOUR_USERNAME" },
  { id: "youtube",   label: "YouTube",   href: "https://www.youtube.com/@YOUR_HANDLE" },
  // { id: "behance",  label: "Behance",  href: "https://www.behance.net/YOUR_USERNAME" },
  // { id: "x",        label: "X",        href: "https://x.com/YOUR_USERNAME" },
  // { id: "facebook", label: "Facebook", href: "https://facebook.com/YOUR_USERNAME" },
  // { id: "whatsapp", label: "WhatsApp", href: "https://wa.me/251XXXXXXXXX" },
];
/* -------------------------------- */

const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinejoin: "round" };
const ICONS = {
  instagram: (
    <svg viewBox="0 0 24 24" {...stroke}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r=".9" fill="currentColor" stroke="none" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M6.9 9.6H3.7V20h3.2V9.6zM5.3 4.5a1.9 1.9 0 100 3.8 1.9 1.9 0 000-3.8zM20.3 13.7c0-3.1-1.7-4.4-3.9-4.4-1.8 0-2.6 1-3 1.7V9.6h-3.2c0 .9 0 10.4 0 10.4h3.2v-5.8c0-.3 0-.6.1-.8.3-.6.8-1.3 1.8-1.3 1.3 0 1.8 1 1.8 2.4V20h3.2l0-6.3z" />
    </svg>
  ),
  telegram: (
    <svg viewBox="0 0 24 24" {...stroke}>
      <path d="M21 4L3 11l6 2.2L18 7l-7.5 7.8V20l3-3.4 4.5 3.4L21 4z" />
    </svg>
  ),
  tiktok: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
  behance: <span className="rbx-txt">Bē</span>,
  x: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
  whatsapp: (
    <svg viewBox="0 0 24 24" {...stroke}>
      <path d="M3.5 20.5l1.3-4.6A8.5 8.5 0 1 1 8.300 19.300z" />
      <path d="M9 8.500c0 3.600 2.900 6.500 6.500 6.500l1-1.600-2-1-1 .8c-1-.4-1.800-1.200-2.200-2.200l.8-1-1-2z" fill="currentColor" stroke="none" />
    </svg>
  ),
};

const ext = (href) =>
  href && href !== "#" ? { target: "_blank", rel: "noopener noreferrer" } : {};

function Footer() {
  const markRef = useRef(null);
  const [time, setTime] = useState("");
  const [msg, setMsg] = useState("");
  const [toastOn, setToastOn] = useState(false);

  /* live Addis Ababa time */
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Africa/Addis_Ababa",
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  /* hide the toast after a moment */
  useEffect(() => {
    if (!toastOn) return;
    const id = setTimeout(() => setToastOn(false), 1800);
    return () => clearTimeout(id);
  }, [toastOn]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setMsg("Email copied");
    } catch {
      setMsg(EMAIL);
    }
    setToastOn(true);
  };

  /* red spotlight follows the cursor over the ROBOX wordmark */
  const onMove = (e) => {
    const m = markRef.current;
    if (!m) return;
    const r = m.getBoundingClientRect();
    m.style.setProperty("--mx", `${e.clientX - r.left}px`);
    m.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  const onLeave = () => {
    const m = markRef.current;
    if (!m) return;
    m.style.removeProperty("--mx");
    m.style.removeProperty("--my");
  };

  const toTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <>
      <footer className="rbx-foot" onPointerMove={onMove} onPointerLeave={onLeave}>
        <div className="rbx-wrap rbx-top">
          {/* left */}
          <div className="rbx-about">
            <p>Video editing, motion design, and graphic design by Robera Daba.</p>
          </div>

          {/* center */}
          <div className="rbx-center">
            <a className="rbx-contact" href={`mailto:${EMAIL}`}>
              Contact me
            </a>
            <div className="rbx-dock" aria-label="Social links">
              {SOCIALS.map((s) => (
                <a
                  key={s.id}
                  className={`rbx-s rbx-s-${s.id}`}
                  data-tip={s.label}
                  href={s.href}
                  aria-label={s.label}
                  {...ext(s.href)}
                >
                  {ICONS[s.id]}
                </a>
              ))}
            </div>
          </div>

          {/* right */}
          <div className="rbx-info">
            <div className="rbx-mailrow">
              <a className="rbx-mail" href={`mailto:${EMAIL}`}>{EMAIL}</a>
              <button type="button" className="rbx-copy" onClick={copyEmail}>Copy</button>
            </div>
            <div className="rbx-row">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 21s-7-6.2-7-11.5a7 7 0 0114 0C19 14.8 12 21 12 21z" />
                <circle cx="12" cy="9.5" r="2.5" />
              </svg>
              Addis Ababa, Ethiopia
            </div>
            <div className="rbx-row">
              <i />
              Replies within 24 hours
            </div>
          </div>
        </div>

        <p className="rbx-mark" ref={markRef} aria-hidden="true">ROBOX</p>

        <div className="rbx-bar">
          <div className="rbx-wrap rbx-barin">
            <span>© 2026 Robera Daba. All rights reserved.</span>
            <span className="rbx-mid">
              Addis Ababa, Ethiopia · <b>{time}</b> local time · Working worldwide
            </span>
            <button type="button" className="rbx-up" onClick={toTop}>
              Back to top
              <span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 19V5M5 12l7-7 7 7" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </footer>

      <div className={`rbx-toast ${toastOn ? "on" : ""}`} role="status">{msg}</div>
    </>
  );
}

export default Footer;
