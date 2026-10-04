import { useEffect, useRef, useState } from "react";
import { Routes, Route } from "react-router-dom";
import RippleGrid from "./RippleGrid";
import Navbar from "./Navbar";
import AboutT from "./AboutT";
import Works from "./Works";
import "./App.css";
import Footer from "./Footer";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faLinkedin,
  faTelegram
} from "@fortawesome/free-brands-svg-icons";

function ScrollService({
  title,
  description,
  leftImage,
  rightImage,
}) {
  const serviceRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const section = serviceRef.current;

      if (!section) return;

      const rect = section.getBoundingClientRect();

      /*
        0 = service is just entering
        1 = service has moved through the viewport
      */

      let progress =
        1 - rect.top / window.innerHeight;

      progress = Math.max(0, Math.min(1, progress));

      /*
        How far the images move outward.
        0 = together
        1 = far apart
      */

      const movement = progress * 35;

      const leftImageElement =
        section.querySelector(".service-image-left");

      const rightImageElement =
        section.querySelector(".service-image-right");

      if (leftImageElement) {
        leftImageElement.style.transform =
          `translateX(calc(-50% - ${movement}vw))rotate(-2deg)`;
      }

      if (rightImageElement) {
        rightImageElement.style.transform =
          `translateX(calc(-50% + ${movement}vw))rotate(2deg)`;
      }
    };

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    );

    window.addEventListener(
      "resize",
      handleScroll
    );

    handleScroll();

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );

      window.removeEventListener(
        "resize",
        handleScroll
      );
    };
  }, []);
  
  return (
    <div
      className="service-scroll"
      ref={serviceRef}
    >

      <div className="service-text">

        <p className="content">
          {title}
        </p>

        <p className="contentin">
          {description}
        </p>

      </div>

      <img
        className="service-image service-image-left"
        src={leftImage}
        alt=""
      />

      <img
        className="service-image service-image-right"
        src={rightImage}
        alt=""
      />

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
        <section className="services" ref={servicesRef}>
          <ScrollService
            title={
              <>
                STORY
                <br />
                TELLING
              </>
            }
            description={
              <>
                Every Cut Has a Purpose
              </>
            }
            leftImage="/images/storyleft.jpg"
            rightImage="/images/storyright.jpg"
          />


          <ScrollService
            title={
              <>
                COLOR
                <br />
                GRADING
              </>
            }
            description={
              <>
                Mood, Tone,
                <br />
                Consistancy
              </>
            }
            leftImage="/images/colorleft.jpg"
            rightImage="/images/colorright.jpg"
          />


          <ScrollService
            title={
              <>
                MOTION &
                <br />
                GRAPHICS
              </>
            }
            description={
              <>
                Turning Ideas
                <br />
                Into Motion
              </>
            }
            leftImage="/images/motionleft.jpg"
            rightImage="/images/motionright.jpg"
          />


          <ScrollService
            title={
              <>
                SOUND &
                <br />
                MUSIC
              </>
            }
            description={
              <>
                The Feeling Between
                <br />
                The Frames
              </>
            }
            leftImage="/images/musicleft.jpg"
            rightImage="/images/musicright.jpg"
          />

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