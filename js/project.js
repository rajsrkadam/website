import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/all";
import { campaigns } from "./cms-data.js";

document.addEventListener("DOMContentLoaded", () => {
  const isProjectPage = document.querySelector(".page.project-page");
  if (!isProjectPage) return;

  gsap.registerPlugin(ScrollTrigger, SplitText);

  // --- CMS INJECTION ---
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  const campaign = campaigns.find(c => c.id === id) || campaigns[0];

  const titleEl = document.querySelector(".project-hero-header-h1 h1");
  if(titleEl) titleEl.textContent = campaign.title;

  const tagsEl = document.querySelector(".project-tags");
  if(tagsEl) {
    tagsEl.innerHTML = `
      <p class="mn">${campaign.category}</p>
      <p class="mn">//</p>
      <p class="mn">${campaign.segment || 'Campaign'}</p>
    `;
  }

  const descEl = document.querySelector(".project-hero-description p");
  if(descEl) {
    if(campaign.description) {
      descEl.textContent = campaign.description;
    } else {
      descEl.innerHTML = `<strong>Challenge:</strong> ${campaign.challenge}<br><br><strong>Solution:</strong> ${campaign.solution}<br><br><strong>Result:</strong> ${campaign.result}`;
    }
  }

  const mainImgEl = document.querySelector(".preview-img.main-preview-img img");
  if(mainImgEl) mainImgEl.src = campaign.heroImage;

  // Remove the client feedback and snapshots sections
  const feedbackEl = document.querySelector(".project-client-feedback");
  if(feedbackEl) feedbackEl.style.display = 'none';

  const snapshotsEl = document.querySelector(".project-snapshots");
  if(snapshotsEl) snapshotsEl.style.display = 'none';
  // ---------------------

  const initHeroAnimations = () => {
    const heroTitle = SplitText.create(".project-hero-header-h1 h1", {
      type: "lines",
      mask: "lines",
    });

    const projectTags = SplitText.create(".project-tags p", {
      type: "lines",
      mask: "lines",
    });

    const heroDescription = SplitText.create(".project-hero-description p", {
      type: "lines",
      mask: "lines",
    });

    gsap.set([heroTitle.lines, projectTags.lines, heroDescription.lines], {
      position: "relative",
      y: "120%",
      willChange: "transform",
    });

    gsap.set(".project-hero-header-h1 img", {
      scale: 0,
      willChange: "transform",
    });

    const heroTl = gsap.timeline({ delay: 0.85 });

    heroTl.to(heroTitle.lines, {
      y: "0%",
      duration: 1,
      ease: "power4.out",
    });

    heroTl.to(
      ".project-hero-header-h1 img",
      {
        scale: 1,
        duration: 1,
        ease: "power4.out",
      },
      "-=1"
    );

    heroTl.to(
      projectTags.lines,
      {
        y: "0%",
        duration: 1,
        ease: "power4.out",
        stagger: 0.1,
      },
      "-=0.9"
    );

    heroTl.to(
      heroDescription.lines,
      {
        y: "0%",
        duration: 1,
        ease: "power4.out",
        stagger: 0.1,
      },
      "-=0.9"
    );
  };

  // Give DOM a tick to update before Splitting Text
  setTimeout(() => {
    initHeroAnimations();
  }, 100);

  ScrollTrigger.create({
    trigger: ".project-page-whitespace",
    start: "top bottom",
    end: "bottom bottom",
    scrub: 1,
    onUpdate: (self) => {
      const projectPreviewWrapper = document.querySelector(
        ".project-preview-wrapper"
      );
      const previewCols = document.querySelectorAll(
        ".preview-col:not(.main-preview-col)"
      );
      const mainPreviewImg = document.querySelector(
        ".preview-img.main-preview-img img"
      );

      const previewScreenWidth = window.innerWidth;
      const previewMaxScale = previewScreenWidth < 900 ? 4 : 2.65;

      const scale = 1 + self.progress * previewMaxScale;
      const yPreviewColTranslate = self.progress * 300;
      const mainPreviewImgScale = 2 - self.progress * 0.85;

      if(projectPreviewWrapper) projectPreviewWrapper.style.transform = `translate(-50%, -50%) scale(${scale})`;

      previewCols.forEach((previewCol) => {
        previewCol.style.transform = `translateY(${yPreviewColTranslate}px)`;
      });

      if(mainPreviewImg) mainPreviewImg.style.transform = `scale(${mainPreviewImgScale})`;
    },
  });
});
