import "./TestimonialWall.css";

const testimonials = [
  { name: "Ava Green", username: "@ava", body: "This completely transformed the way our team works.", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=85", country: "🇦🇺 Australia" },
  { name: "Ana Miller", username: "@ana", body: "The experience feels incredibly smooth and premium.", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=85", country: "🇩🇪 Germany" },
  { name: "Mateo Rossi", username: "@mat", body: "One of the cleanest components I have ever used.", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=85", country: "🇮🇹 Italy" },
  { name: "Maya Patel", username: "@maya", body: "It worked beautifully right out of the box.", image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=200&q=85", country: "🇮🇳 India" },
  { name: "Noah Smith", username: "@noah", body: "The animation instantly makes the page feel expensive.", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=85", country: "🇺🇸 USA" },
  { name: "Lucas Stone", username: "@luc", body: "Beautifully designed and surprisingly easy to customize.", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=85", country: "🇫🇷 France" },
  { name: "Haruto Sato", username: "@haru", body: "Performance is excellent, even on mobile devices.", image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=85", country: "🇯🇵 Japan" },
  { name: "Emma Lee", username: "@emma", body: "The depth and perspective effect looks incredible.", image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=85", country: "🇨🇦 Canada" },
  { name: "Carlos Ray", username: "@carl", body: "Perfect for testimonials, reviews and social proof.", image: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?auto=format&fit=crop&w=200&q=85", country: "🇪🇸 Spain" },
];

function TestimonialCard({ testimonial }) {
  return (
    <article className="tw-card">
      <div className="tw-card-highlight" />

      <div className="tw-profile-row">
        <img className="tw-avatar" src={testimonial.image} alt={testimonial.name} />

        <div className="tw-profile-information">
          <div className="tw-name-row">
            <span className="tw-name">{testimonial.name}</span>
            <span className="tw-verified">✓</span>
          </div>
          <span className="tw-username">{testimonial.username}</span>
        </div>
      </div>

      <p className="tw-testimonial-body">{testimonial.body}</p>

      <div className="tw-card-footer">
        <span>{testimonial.country}</span>
        <span className="tw-rating">★★★★★</span>
      </div>
    </article>
  );
}

function MarqueeColumn({ reverse = false, duration = 32, delay = 0 }) {
  const repeated = [...testimonials, ...testimonials];

  return (
    <div className="tw-marquee-column">
      <div
        className={`tw-marquee-track ${reverse ? "reverse" : ""}`}
        style={{ "--duration": `${duration}s`, "--delay": `${delay}s` }}
      >
        {repeated.map((testimonial, index) => (
          <TestimonialCard key={`${testimonial.username}-${index}`} testimonial={testimonial} />
        ))}
      </div>
    </div>
  );
}

export default function TestimonialWall() {
  return (
    <div className="tw-scene">
      <div className="tw-perspective-stage">
        <MarqueeColumn duration={35} />
        <MarqueeColumn reverse duration={30} delay={-6} />
        <MarqueeColumn duration={38} delay={-12} />
      </div>
    </div>
  );
}