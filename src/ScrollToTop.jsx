import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // If the URL has a hash (like /#contact), let the hash-scroll
    // logic in Home handle it instead of forcing scroll to top.
    if (hash) return;

    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}

export default ScrollToTop;