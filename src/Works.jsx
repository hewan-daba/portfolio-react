import { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./Works.css";
import VideoReelGrid from "./VideosReelGrid";
import HorizonSlatCarousel from "./HorizonSlatCarousel";
import AuroraGradient from "./AuroraGradient";

const myWorks = [
  {
    id: "project-1",
    image: "/images/homesale.jpg",
    alt: "Social media reel thumbnail",
    label: "Project 01",
    title: "Social Media\nPost",
  },
  {
    id: "project-2",
    image: "/images/crestline-ad.jpg",
    alt: "Brand promo video thumbnail",
    label: "Project 02",
    title: "Business\nCard",
  },
  {
    id: "project-3",
    image: "/images/crestline-logo.jpg",
    alt: "Music video thumbnail",
    label: "Project 03",
    title: "Logo",
  },
  {
    id: "project-4",
    image: "/images/ethiopian-visit.jpg",
    alt: "Documentary edit thumbnail",
    label: "Project 04",
    title: "Social Media\nPost",
  },
  {
    id: "project-5",
    image: "/images/mens-fashion.jpg",
    alt: "Documentary edit thumbnail",
    label: "Project 05",
    title: "Banner",
  },
  {
    id: "project-6",
    image: "/images/find-style.jpg",
    alt: "Social media reel thumbnail",
    label: "Project 06",
    title: "Social Media\nPost",
  },
  
  {
    id: "project-7",
    image: "/images/bebi.jpg",
    alt: "Social media reel thumbnail",
    label: "Project 07",
    title: "Illustration",
  },
  {
    id: "project-8",
    image: "/images/companylogo.jpg",
    alt: "Social media reel thumbnail",
    label: "Project 08",
    title: "Business\nCard",
  },{
    id: "project-9",
    image: "/images/graphicsexpert.jpg",
    alt: "Social media reel thumbnail",
    label: "Project 09",
    title: "Social Media\n Post",
  },{
    id: "project-10",
    image: "/images/man.jpg",
    alt: "Social media reel thumbnail",
    label: "Project 10",
    title: "Illustration",
  },{
    id: "project-11",
    image: "/images/tech.jpg",
    alt: "Social media reel thumbnail",
    label: "Project 11",
    title: "Business\nCard",
  },{
    id: "project-12",
    image: "/images/toplogo.jpg",
    alt: "Social media reel thumbnail",
    label: "Project 12",
    title: "Logo",
  },{
    id: "project-13",
    image: "/images/agency.jpg",
    alt: "Social media reel thumbnail",
    label: "Project 13",
    title: "Banner",
  },
];

const myVideos = [
  { id: "v1", src:"/videos/instaPost01.mp4", title:"Reel"},
  { id: "v2", src:"/videos/instaPost2.mp4", title:"Reel"},
  { id: "v3", src: "/videos/calander.mp4", title: "Brand promo" },
  { id: "v4", src: "/videos/company.mp4", title: "Edit reel" },
  { id: "v5", src: "/videos/illegal.mp4", title: "Motion piece" },
  { id: "v6", src: "/videos/createnewedit.mp4", title: "Short film" },
  { id: "v7", src: "/videos/callme.mp4", title: "Short film" },
  { id: "v8", src: "/videos/firstedit.mp4", title: "Short film" },
  { id: "v9", src: "/videos/imangazi.mp4", title: "Short film" },
  { id: "v10", src: "/videos/linkedinport.mp4", title: "Short film" },
  { id: "v11", src: "/videos/paper.mp4", title: "Short film" },
  { id: "v12", src: "/videos/parlama.mp4", title: "Short film" },
  { id: "v13", src: "/videos/youtube.mp4", title: "Short film" },

];

const pad = (n) => String(n).padStart(2, "0");

function Works() {
  const [tab, setTab] = useState("all");

  const tabs = [
    ["all", "All work", myWorks.length + myVideos.length],
    ["design", "Graphic design", myWorks.length],
    ["video", "Video", myVideos.length],
  ];

  return (
    <div className="wk-root">
      {/* aurora stays fixed behind the whole page */}
      <div className="aurora-background">
        <AuroraGradient />
      </div>

      <div className="wk-layer">
        <Navbar />

        <div className="works-page">
          <div className="wk-wrap">
            <section className="wk-hero">
              <h1>
                Selected
                <br />
                work
              </h1>
              <div className="wk-stats">
                <div>
                  <b>{pad(myVideos.length)}</b>
                  <span>Videos</span>
                </div>
                <div>
                  <b>{pad(myWorks.length)}</b>
                  <span>Designs</span>
                </div>
              </div>
            </section>
          </div>

          <div className="wk-bar">
            <div className="wk-wrap" role="group" aria-label="Filter work">
              {tabs.map(([key, label, count]) => (
                <button
                  key={key}
                  type="button"
                  className="wk-chip"
                  aria-pressed={tab === key}
                  onClick={() => setTab(key)}
                >
                  {label}
                  <span>{count}</span>
                </button>
              ))}
            </div>
          </div>

          <main>
            {(tab === "all" || tab === "design") && (
              <section className="wk-block">
                <div className="wk-wrap">
                  <div className="wk-head">
                    <div>
                      <h2>Graphic design</h2>
                      <p>Ads, logos, posters and social content.</p>
                    </div>
                  </div>
                </div>
                <div className="works-carousel-wrap">
                  <HorizonSlatCarousel
                    slides={myWorks}
                    autoplay
                    autoplayDirection="rightToLeft"
                    autoplayDelay={2400}
                  />
                </div>
              </section>
            )}

            {(tab === "all" || tab === "video") && (
              <section className="wk-block">
                <div className="wk-wrap">
                  <div className="wk-head">
                    <div>
                      <h2>Video</h2>
                      <p>Hover a reel to preview it. Click to watch full screen.</p>
                    </div>
                  </div>
                </div>
                <VideoReelGrid videos={myVideos} />
              </section>
            )}
          </main>
        </div>
        {/* new footer (replaces the old "Have a project in mind?" block) */}
        <div style={{ marginTop: 96 }}>
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default Works;
