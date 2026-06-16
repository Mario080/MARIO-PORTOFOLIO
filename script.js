(function () {
  const header = document.querySelector("[data-header]");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const navMenu = document.querySelector("[data-nav-menu]");

  function updateHeader() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  }

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      document.body.classList.toggle("nav-open", isOpen);
    });

    navMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("nav-open");
      });
    });
  }

  const revealItems = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  // ===========================
  // INFINITE CAROUSEL
  // ===========================

  document.querySelectorAll("[data-carousel]").forEach((carousel) => {

    const track = carousel.querySelector("[data-carousel-track]");
    const prev = carousel.querySelector("[data-carousel-prev]");
    const next = carousel.querySelector("[data-carousel-next]");

    if (!track) return;

    let startX = 0;
    let isPointerDown = false;

    function slideWidth() {
      const slide = track.querySelector(".gallery-slide");
      return slide ? slide.offsetWidth + 24 : track.clientWidth;
    }

    function move(direction) {

      const maxScroll =
        track.scrollWidth - track.clientWidth;

      const currentScroll =
        track.scrollLeft;

      if (direction > 0) {

        // NEXT
        if (currentScroll >= maxScroll - 20) {

          track.scrollTo({
            left: 0,
            behavior: "smooth"
          });

        } else {

          track.scrollBy({
            left: slideWidth(),
            behavior: "smooth"
          });

        }

      } else {

        // PREVIOUS
        if (currentScroll <= 20) {

          track.scrollTo({
            left: maxScroll,
            behavior: "smooth"
          });

        } else {

          track.scrollBy({
            left: -slideWidth(),
            behavior: "smooth"
          });

        }

      }

    }

    if (prev) {
      prev.addEventListener("click", () => move(-1));
    }

    if (next) {
      next.addEventListener("click", () => move(1));
    }

    // Swipe Support

    track.addEventListener("pointerdown", (event) => {
      isPointerDown = true;
      startX = event.clientX;
      track.setPointerCapture(event.pointerId);
    });

    track.addEventListener("pointerup", (event) => {

      if (!isPointerDown) return;

      isPointerDown = false;

      const distance =
        startX - event.clientX;

      if (Math.abs(distance) > 48) {

        move(
          distance > 0
            ? 1
            : -1
        );

      }

    });

    track.addEventListener("pointercancel", () => {
      isPointerDown = false;
    });

  });

})();