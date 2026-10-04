import Navbar from "./Navbar";
import "./AboutT.css";
import TestimonialWall from "./TestimonialWall";

import portrait from "/images/robera.jpg";


const tools = [
  { src: "/icons/premiere.svg", alt: "Premiere Pro", label: ["Adobe", "Premiere Pro"] },
  { src: "/icons/after-effect.svg", alt: "After Effects", label: ["Adobe", "After Effects"] },
  { src: "/icons/photoshop.svg", alt: "Photoshop", label: ["Adobe", "Photoshop"] },
  { src: "/icons/illustrator.svg", alt: "Illustrator", label: ["Adobe", "Illustrator"] },
  { src: "/icons/indesign.svg", alt: "Indesign", label: ["Adobe", "Indesign"] },
  { src: "/icons/figma.svg", alt: "Figma", label: ["Figma"] },
];

const Arrow = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2"
      strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function AboutT() {
  return (
    <div className="about-root">
      <Navbar />
      <div className="about-page">
        <section className="hero">
          <div className="photo-frame">
            <span className="edge tl" />
            <span className="edge br" />
            <div className="pic">
              <img src={portrait} alt="Robera Daba" />
            </div>
            <div className="badge">
              <span className="dot" />Available for work
            </div>
          </div>
          <div className="copy">
            <div className="eyebrow">Founder of ROBOX</div>
            <h1>
              Robera Daba
              <br />
              <span className="accent">makes brands look bigger.</span>
            </h1>
            <p className="role">Video Editor &amp; Motion Designer</p>
            <p className="bio">"I make brands look bigger than they are."</p>

            <div className="statbar">
              <div><b>+1 yr</b><span>Experience</span></div>
              <div><b>20+</b><span>Projects delivered</span></div>
              <div><b>Addis Ababa</b><span>Based in</span></div>
            </div>
          </div>
        </section>
        <div className="about-content">
          <div className="ability">
            <div className="ability-cat"> 
              <h3 className="ability-main">Premier Pro + After Effects</h3>
              <p className="ability-sub">My core video and motion workflow</p>
            </div>
            <div className="ability-cat">
              <h3 className="ability-main">Photoshop + Illustrator</h3>
              <p className="ability-sub">Posters, social content, logos</p>
            </div>
            <div className="ability-cat">
              <h3 className="ability-main">Documentary to promo</h3>
              <p className="ability-sub">Long-form, social, and brand video</p>
            </div>
          </div>
          <div className="ability-story">
            <h2>My story</h2>
            <p>
              Every frame, beat, and detail changes how an audience experiences a
              story. That belief shapes how I edit, animate, and design.
            </p>
            <p>
              In Premiere Pro, I handle advanced trimming, smooth cuts, transitions,
              color grading, sound design, and music. In After Effects, I bring
              visuals to life with motion graphics, animated typography, and visual
              effects.
            </p>
            <p>
              Alongside video, I design with Photoshop and Illustrator: posters,
              banners, social media content, photo edits, and clean, versatile logos.
              Whether it's a documentary, a social video, or promotional content, my
              goal is to make it clear, engaging, and professional.
            </p>
          </div>
        </div>
        <div className="bring">
          <h3> What I bring </h3>
          <div className="bring-cat">
            <div className="bring-cats">
              <h4>Video editing</h4>
              <p>Smooth transitions</p>
              <p>Advanced trimming</p>
              <p>Storytelling and pacing</p>
              <p>Color grading</p>
              <p>Sound design and music</p>
            </div>
            <div className="bring-cats">
              <h4>Motion graphics</h4>
              <p>Animated typography</p>
              <p>Motion design</p>
              <p>Visual effects</p>
              <p>Logo animation</p>
              <p>2D animation</p>
            </div>
            <div className="bring-cats">
              <h4>Graphic design</h4>
              <p>Posters and banners</p>
              <p>Social media designs</p>
              <p>Photo editing</p>
              <p>Logo design</p>
              <p>Visual assets</p>
            </div>
          </div>
        </div>
        <div className="work-flow">
          <h3>My workflow</h3>
          <p>From raw footage to final delivery, each tool has a clear job.</p>
          <div className="work-flow-cat">
            <div className="work-flow-cats">
              <h4>Shape the story</h4>
              <p>Premiere Pro: trimming, cuts, pacing, and transitions build the structure.</p>
            </div>
            <div className="work-flow-cats">
              <h4>Bring it to life</h4>
              <p>After Effects: motion graphics, animated type, and effects add energy and clarity.</p>
            </div>
            <div className="work-flow-cats">
              <h4>Design the details</h4>
              <p>Photoshop and Illustrator: supporting visuals, thumbnails, and logos keep everything consistent.</p>
            </div>
            <div className="work-flow-cats">
              <h4>Finish and polish</h4>
              <p>Color grading, sound design, and music pull it together into a final cut.</p>
            </div>
          </div>
        </div>
        <div className="tools">
          <h3>Software Proficiency</h3>
          <div className="tool-marquee">
            <div className="tool-track">
              {[...tools, ...tools].map((t, i) => (
                <div className="tool-pill" key={i} aria-hidden={i >= tools.length}>
                  <img src={t.src} alt={t.alt} className="tool-icon" />
                  <span>
                    {t.label.map((line, j) => (
                      <span key={j} style={{ display: "block" }}>{line}</span>
                    ))}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="power">
          <h3>Timing, rhythm, visual<br /> consistency, and sound<br /> all count.</h3>
          <div className="power-cat">
            <div className="power-cats">
              <h4>Story first</h4>
              <p>Every project starts with what you want the audience to feel and understand.</p>
            </div>
            <div className="power-cats">
              <h4>Detail always</h4>
              <p>Small choices in timing and sound decide how a piece feels.</p>
            </div>
            <div className="power-cats">
              <h4>Built to perform</h4>
              <p>Content that is meaningful and effective, not only good-looking.</p>
            </div>
          </div>
        </div>
        
        <div className="footer2">
          <div className="footer2-left">
            <h3>Let's make<br /> something people<br/> <span>remember.</span></h3>
            <p>Tell me about your project and I'll get back to you.</p>
            <div className="buttons">
              <button className="cta cta-primary" type="button">
                <div className="cta-layer">
                  <span>Email me <Arrow /></span>
                </div>
                <div className="cta-layer">
                  <span>Let's talk <Arrow /></span>
                </div>
              </button>

              <button className="cta cta-secondary" type="button">
                <div className="cta-layer">
                  <span>View my work <Arrow /></span>
                </div>
                <div className="cta-layer">
                  <span>Enjoy <Arrow /></span>
                </div>
              </button>
            </div>
          </div>
          <div className="footer2-right">
            <TestimonialWall />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutT;