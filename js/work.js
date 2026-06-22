import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/all";
import { campaigns } from "./cms-data.js";

document.addEventListener("DOMContentLoaded", () => {
  const isWorkPage = document.querySelector(".page.work-page");
  if (!isWorkPage) return;

  gsap.registerPlugin(ScrollTrigger, SplitText);

  // --- CMS INJECTION ---
  const workItemsContainer = document.querySelector(".work-items");
  if (workItemsContainer) {
    let rowsHtml = "";
    for (let i = 0; i < campaigns.length; i += 2) {
      const item1 = campaigns[i];
      const item2 = campaigns[i + 1];
      
      rowsHtml += `<div class="row">`;
      
      // First item
      rowsHtml += `
        <div class="work-item">
          <div class="work-item-img">
            <a href="/project.html?id=${item1.id}">
              <img src="${item1.previewImage}" alt="${item1.title}" />
            </a>
          </div>
          <div class="work-item-content">
            <h3>${item1.title}</h3>
            <p class="mn">${item1.category}</p>
          </div>
        </div>
      `;
      
      // Second item (if exists)
      if (item2) {
        rowsHtml += `
          <div class="work-item">
            <div class="work-item-img">
              <a href="/project.html?id=${item2.id}">
                <img src="${item2.previewImage}" alt="${item2.title}" />
              </a>
            </div>
            <div class="work-item-content">
              <h3>${item2.title}</h3>
              <p class="mn">${item2.category}</p>
            </div>
          </div>
        `;
      }
      
      rowsHtml += `</div>`;
    }
    workItemsContainer.innerHTML = rowsHtml;
  }
  // ---------------------

  let scrollTriggerInstances = [];

  const initHeaderAnimations = () => {
    gsap.set(".work-profile-icon", { scale: 0 });
    gsap.set(".work-header-arrow-icon", { scale: 0 });

    const feastText = SplitText.create(".work-header-content p", {
      type: "lines",
      mask: "lines",
    });

    const titleText = SplitText.create(".work-header-title h1", {
      type: "lines",
      mask: "lines",
    });

    gsap.set([feastText.lines, titleText.lines], {
      y: "120%",
    });

    const headerTl = gsap.timeline({ delay: 0.75 });

    headerTl.to(".work-profile-icon", {
      scale: 1,
      duration: 1,
      ease: "power4.out",
    });

    headerTl.to(
      feastText.lines,
      {
        y: "0%",
        duration: 1,
        ease: "power4.out",
      },
      "-=0.9"
    );

    headerTl.to(
      titleText.lines,
      {
        y: "0%",
        duration: 1,
        ease: "power4.out",
        stagger: 0.1,
      },
      "-=0.9"
    );

    headerTl.to(
      ".work-header-arrow-icon",
      {
        scale: 1,
        duration: 0.75,
        ease: "power4.out",
      },
      "-=0.9"
    );
  };

  const initAnimations = () => {
    scrollTriggerInstances.forEach((instance) => {
      if (instance) instance.kill();
    });
    scrollTriggerInstances = [];

    gsap.set(".work-item", {
      opacity: 0,
      scale: 0.75,
    });

    document.querySelectorAll(".work-items .row").forEach((row, index) => {
      const workItems = row.querySelectorAll(".work-item");

      workItems.forEach((item, itemIndex) => {
        const fromLeft = itemIndex % 2 === 0;

        gsap.set(item, {
          x: fromLeft ? -1000 : 1000,
          rotation: fromLeft ? -50 : 50,
          transformOrigin: "center center",
        });
      });

      const trigger = ScrollTrigger.create({
        trigger: row,
        start: "top 75%",
        onEnter: () => {
          gsap.timeline().to(workItems, {
            duration: 1,
            x: 0,
            rotation: 0,
            opacity: 1,
            scale: 1,
            ease: "power4.out",
          });
        },
      });
      scrollTriggerInstances.push(trigger);
    });

    ScrollTrigger.refresh();
  };

  initHeaderAnimations();
  initAnimations();

  window.addEventListener("resize", () => {
    initAnimations();
  });
});
