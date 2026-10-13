import { useState, useEffect } from "react";            // NEW: added useState, useEffect
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import ShiningHeadline from "./ShiningHeadline";


function Navbar() {
  const location = useLocation();
  const contactHref = location.pathname === "/about" ? "/#contact" : "#contact";
  const navigate = useNavigate();
  const [open,setOpen]= useState(false);
  const close=() => setOpen(false);

  const handleContactClick = (e) => {
  const contactEl = document.getElementById("contact");
  if (contactEl) {
      // Footer exists on this page (Home or Works) — scroll smoothly, no navigation.
      e.preventDefault();
      close();                              // closes the mobile menu
      contactEl.scrollIntoView({ behavior: "smooth" });
    } else {
      // No footer here (About) — navigate to Home with #contact,
      // Home's own useEffect will smooth-scroll once it mounts.
      e.preventDefault();
      navigate("/#contact");
    }
  };

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className={open ? "menu-open" : ""}>
      <div className="logoarea">
        <div className="logo">
          <a href="/">
            <ShiningHeadline baseColor="white" shineColor="#ff0000" duration={3}>
              ROBOX
            </ShiningHeadline>
          </a>
        </div>
        <div className="logosub">
          <p>
            <ShiningHeadline baseColor="white" shineColor="#ff0000" duration={3}>
              PORTFOLIO
            </ShiningHeadline>
          </p>
        </div>
      </div>
        <button
          type="button"
          className="burger"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>
        <div className="menu" id="site-menu">
          <nav className="nav">
            <NavLink to="/" onClick={close}>Home</NavLink>
            <NavLink to="/about"onClick={close}>About</NavLink>
            <NavLink to="/works"onClick={close}>Works</NavLink>
          </nav>

          <a href={contactHref} className="contact" onClick={handleContactClick}>
            <ShiningHeadline baseColor="white" shineColor="#ff0000" duration={3}>
              Get In Touch
            </ShiningHeadline>
          </a>
        </div>
    </header>
  );
}

export default Navbar;