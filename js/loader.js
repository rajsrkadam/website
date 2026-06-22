
import gsap from "gsap";

document.addEventListener("DOMContentLoaded", () => {
  const isHomePage = document.querySelector(".page.home-page");
  if (!isHomePage) {
    const loader = document.querySelector(".loader-overlay");
    if(loader) loader.style.display = "none";
    return;
  }
  document.fonts.ready.then(() => {
    const tl = gsap.timeline();
    const counterElement = document.querySelector(".loader-counter");
    let progressObj = { value: 0 };

  // Animate counter from 0 to 100
  tl.to(progressObj, {
    value: 100,
    duration: 1.8,
    ease: "power2.inOut",
    onUpdate: () => {
      if (counterElement) {
        counterElement.innerHTML = Math.floor(progressObj.value) + "%";
      }
    }
  }, 0)
  .from(".loader-title", {
    y: 50,
    opacity: 0,
    duration: 1,
    ease: "power3.out"
  }, 0.2)
  .from(".loader-subtitle", {
    y: 20,
    opacity: 0,
    duration: 0.8,
    ease: "power3.out"
  }, 0.5)
  .to(".loader-overlay", {
    yPercent: -100,
    duration: 1.2,
    ease: "power4.inOut",
    delay: 0.2 // waits briefly after counter hits 100%
  });
  });
});
