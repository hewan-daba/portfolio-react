import { useEffect, useRef, useState } from "react";
import { Routes, Route } from "react-router-dom";
import RippleGrid from "./RippleGrid";
import Navbar from "./Navbar";
import AboutT from "./AboutT";
import Works from "./Works";
import "./App.css";
import Footer from "./Footer";

const SERVICES = [
  {
    title: ["STORY", "TELLING"],
    description: [
      "Not just cutting clips.",
      "I Control Timing, Rhythm, Attention",
      "Frame by frame,",
      "I build the experience",
    ],
    leftImage: "/images/storyleft.jpg",
    rightImage: "/images/storyright.jpg",
    type: "story",
    labels: ["Setup", "Conflict", "Payoff"],
  },
  {
    title: ["COLOR", "GRADING"],
    description: [
      "Light set the mood.",
      "Color brings it to life.",
      "Contrast gives it depth.",
      "Every frame tells story.",
    ],
    leftImage: "/images/colorleft.jpg",
    rightImage: "/images/colorright.jpg",
    type: "color",
    labels: ["Shadows", "Mids", "Highlights"],
  },
  {
    title: ["MOTION &", "GRAPHICS"],
    description: [
      "Ideas take shape.",
      "Design gives them meaning.",
      "Motion brings them to life.",
      "Every frame makes an impact.",
    ],
    leftImage: "/images/motionleft.jpg",
    rightImage: "/images/motionright.jpg",
    type: "motion",
    labels: ["Keyframe", "Ease", "Keyframe"],
  },
  {
    title: ["SOUND &", "MUSIC"],
    description: [
      "Sound sets the mood.",
      "Music sets the emotion.",
      "Every beat finds its place.",
      "Every moment feels alive.",
    ],
    leftImage: "/images/musicleft.jpg",
    rightImage: "/images/musicright.jpg",
    type: "sound",
    labels: ["Dialogue", "Music", "FX"],
  },
];

function ServiceViz({ type, labels }) {
  let visual = null;

  if (type === "story") {
    visual = (
      <svg className="cin-viz" viewBox="0 0 160 50">
        <path
          className="cin-draw"
          pathLength="1"
          d="M4 42C40 42 44 10 80 10S124 40 156 8"
          fill="none"
          stroke="#E63946"
          strokeWidth="2"
        />
        <circle className="cin-dot" style={{ "--t": 0 }} cx="4" cy="42" r="3" />
        <circle className="cin-dot" style={{ "--t": 0.45 }} cx="80" cy="10" r="3" />
        <circle className="cin-dot" style={{ "--t": 0.95 }} cx="156" cy="8" r="3" />
      </svg>
    );
  }

  if (type === "color") {
    visual = (
      <div className="cin-swatches">
        {["#0f4c5c", "#1d7a86", "#e36414", "#fb8b24", "#f5f1ee"].map((color, n) => (
          <i key={color} style={{ background: color, "--i": n }} />
        ))}
      </div>
    );
  }

  if (type === "motion") {
    visual = (
      <svg className="cin-viz" viewBox="0 0 160 50">
        <path
          className="cin-draw"
          pathLength="1"
          d="M4 46C60 46 70 4 156 4"
          fill="none"
          stroke="#E63946"
          strokeWidth="2"
        />
        <g className="cin-dia" style={{ "--t": 0 }}>
          <rect x="2" y="44" width="6" height="6" transform="rotate(45 5 47)" />
        </g>
        <g className="cin-dia" style={{ "--t": 0.95 }}>
          <rect x="153" y="1" width="6" height="6" transform="rotate(45 156 4)" />
        </g>
        <circle className="cin-orb" r="4">
          <animateMotion dur="2.6s" repeatCount="indefinite" path="M4 46C60 46 70 4 156 4" />
        </circle>
      </svg>
    );
  }

  if (type === "sound") {
    visual = (
      <div className="cin-wave">
        {Array.from({ length: 26 }, (_, k) => (
          <i key={k} style={{ "--k": k, "--d": Math.abs(k - 12.5) }} />
        ))}
      </div>
    );
  }

  return (
    <>
      {visual}
      <div className="cin-acts">
        {labels.map((label, n) => (
          <span key={label} style={{ "--i": n }}>{label}</span>
        ))}
      </div>
    </>
  );
}

function ScrollService({ title, description, leftImage, rightImage, type, labels }) {
  const rowRef = useRef(null);
  const [inView, setInView] = useState(false);

  /* scroll progress (--p) for the side images (desktop and tablet) */
  useEffect(() => {
    const update = () => {
      const row = rowRef.current;
      if (!row) return;
      const top = row.getBoundingClientRect().top;
      const vh = window.innerHeight;
      const progress = Math.max(0, Math.min(1, (vh * 0.95 - top) / (vh * 0.6)));
      row.style.setProperty("--p", progress.toFixed(3));
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  /* start the text animations when the text card scrolls into view,
     reset when it has fully left, so they play again next time */
  useEffect(() => {
    const card = rowRef.current?.querySelector(".cin-c");
    if (!card) return;
    if (!("IntersectionObserver" in window)) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.3) setInView(true);
        else if (entry.intersectionRatio === 0) setInView(false);
      },
      { threshold: [0, 0.3] }
    );
    io.observe(card);
    return () => io.disconnect();
  }, []);

  const hideBrokenImage = (e) => {
    e.currentTarget.style.display = "none";
  };

  return (
    <div className={`cin-svc ${inView ? "is-in" : ""}`} ref={rowRef}>
      <figure className="cin-im l">
        <img src={leftImage} alt="" onError={hideBrokenImage} />
      </figure>

      <div className="cin-c">
        <div className="cin-frame">
          <h2 className="cin-title">
            {title.map((line, n) => (
              <span className="cin-line" key={line}>
                <span style={{ "--i": n }}>{line}</span>
              </span>
            ))}
          </h2>

          <div className="cin-rule" />

          <p className="cin-desc">
            {description.map((line, n) => (
              <span key={line} style={{ "--i": n }}>{line}</span>
            ))}
          </p>

          <ServiceViz type={type} labels={labels} />
        </div>
      </div>

      <figure className="cin-im r">
        <img src={rightImage} alt="" onError={hideBrokenImage} />
      </figure>
    </div>
  );
}


function HeroVideos({ show }) {
  const videos = [
    "/videos/photograph.mp4",
    "/videos/editweb.mp4",
    "/videos/motionweb.mp4",
    "/videos/emotion.mp4",
  ];

  const [videoOrder, setVideoOrder] = useState([0, 1, 2, 3]);
  const [cycling, setCycling] = useState(false);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (!show) return;

    // last card starts dropping at 0.45s, drop takes 0.6s -> finishes ~1.05s
    const enterTimer = setTimeout(() => setEntered(true), 500);

    const interval = setInterval(() => {
      setCycling(true);
    }, 3000);

    return () => {
      clearTimeout(enterTimer);
      clearInterval(interval);
    };
  }, [show]);

  const handleCycleEnd = () => {
    setVideoOrder((prev) => [...prev.slice(1), prev[0]]);
    setCycling(false);
  };

  return (
    <div
      className={`hero-videos ${show ? "show" : ""} ${
        entered ? "entered" : ""
      }`}
    >
      {videoOrder.map((videoIndex, position) => (
        <video
          key={videos[videoIndex]}
          src={videos[videoIndex]}
          autoPlay
          muted
          loop
          playsInline
          onAnimationEnd={position === 0 ? handleCycleEnd : undefined}
          className={`hero-video video-position-${position} ${
            cycling && position === 0 ? "video-cycling" : ""
          }`}
        />
      ))}
    </div>
  );
}
function Home() {
  const [heroSplit, setHeroSplit] = useState(false);
  const servicesRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHeroSplit(true);
    }, 1900);

    return () => clearTimeout(timer);
  }, []);
    useEffect(() => {
    if (window.location.hash === "#contact") {
      const target = document.getElementById("contact");
      if (target) {
        // small delay so the page has fully painted before scrolling
        setTimeout(() => {
          target.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, []);
  useEffect(() => {
  const SLOW_FACTOR = 0.25; // lower = slower

  const handleWheel = (event) => {
    const section = servicesRef.current;
    if (!section) return;

    const rect = section.getBoundingClientRect();

    // true any time .services is anywhere on screen —
    // from the moment it starts entering from the bottom
    // to the moment it fully leaves off the top
    const isInView = rect.bottom > 0 && rect.top < window.innerHeight;

    if (isInView) {
      event.preventDefault();
      window.scrollBy({
        top: event.deltaY * SLOW_FACTOR,
        behavior: "auto",
      });
    }
  };

  window.addEventListener("wheel", handleWheel, { passive: false });

  return () => {
    window.removeEventListener("wheel", handleWheel);
  };
  }, []);
  return (
    <div style={{ width: "100%", height: "100%", backgroundColor:"black" }}>
      <div className="page">
        <section className="herosec">
          <div className="background">
          <RippleGrid gridColor="#FF0000"/>
          </div>
          <Navbar />
          <div className="hero1">
              <div className={`herotext ${heroSplit ? "split" : ""}`}>
                <div className="hero-line">

                  <div className="hero-side hero-left">
                    {"I TURN".split("").map((letter, index) => (
                      <span
                        key={`first-left-${index}`}
                        className="letter"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        {letter === " " ? "\u00A0" : letter}
                      </span>
                    ))}
                  </div>

                  <div className="hero-side hero-right">
                    {"FOOTAGE".split("").map((letter, index) => (
                      <span
                        key={`first-right-${index}`}
                        className="letter"
                        style={{ animationDelay: `${(index + 7) * 0.05}s` }}
                      >
                        {letter}
                      </span>
                    ))}
                  </div>

                </div>


                <div className="hero-line">

                  <div className="hero-side hero-left2">
                    {"INTO".split("").map((letter, index) => (
                      <span
                        key={`second-${index}`}
                        className="letter"
                        style={{ animationDelay: `${(index + 14) * 0.05}s` }}
                      >
                        {letter}
                      </span>
                    ))}
                  </div>

                  <div className="hero-side hero-right2">
                    {"STORIES.".split("").map((letter, index) => (
                      <span
                        key={`third-${index}`}
                        className="letter redtext"
                        style={{ animationDelay: `${(index + 18) * 0.05}s` }}
                      >
                        {letter}
                      </span>
                    ))}
                  </div>

                </div>

                <HeroVideos show={heroSplit} />

              </div>
            <div className="herosub">
              <p>One Frame at a Time</p>
            </div>
          </div>
        </section>
        <section className="services cinema" ref={servicesRef}>
          {SERVICES.map((service, index) => (
            <ScrollService
              key={service.type}
              index={index}
              title={service.title}
              description={service.description}
              leftImage={service.leftImage}
              rightImage={service.rightImage}
              type={service.type}
              labels={service.labels}
            />
          ))}
        </section>
       <Footer />
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<AboutT />} />
      <Route path="/works" element={<Works />} />
    </Routes>
  );
}

export default App;