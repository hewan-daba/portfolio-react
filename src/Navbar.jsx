import { NavLink } from "react-router-dom";
import ShiningHeadline from "./ShiningHeadline";

function Navbar() {
  return (
    <header>
      <div className="logoarea">
        <div className="logo">
          <p>
            <ShiningHeadline baseColor="white" shineColor="#ff0000" duration={3}>
              ROBOX
            </ShiningHeadline>
          </p>
        </div>
        <div className="logosub">
          <p>
            <ShiningHeadline baseColor="white" shineColor="#ff0000" duration={3}>
              PORTFOLIO
            </ShiningHeadline>
          </p>
        </div>
      </div>
        <nav className="nav">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/works">Works</NavLink>
        </nav>

        <button className="contact">
          <ShiningHeadline baseColor="white" shineColor="#ff0000" duration={3}>
            Get In Touch
          </ShiningHeadline>
        </button>
    </header>
  );
}

export default Navbar;