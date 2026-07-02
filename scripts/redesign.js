const counters = document.querySelectorAll("[data-count]");

function countTo(el) {
  const target = Number(el.dataset.count || 0);
  const suffix = el.dataset.suffix || "";
  const prefix = el.dataset.prefix || "";
  const duration = Number(el.dataset.duration || 1100);
  const start = performance.now();

  function frame(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(target * eased);
    el.innerHTML = `${prefix}<span class="count-value">${value}</span>${suffix ? `<small class="count-unit">${suffix}</small>` : ""}`;
    if (progress < 1) requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    if (el.dataset.played === "1") return;
    el.dataset.played = "1";
    countTo(el);
  });
}, { threshold: 0.35 });

counters.forEach((el) => countObserver.observe(el));

const gauges = document.querySelectorAll("[data-gauge]");

function animateGauge(el) {
  const target = Number(el.dataset.gauge || 0);
  const duration = Number(el.dataset.duration || 1200);
  const start = performance.now();

  function frame(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.style.setProperty("--p", (target * eased).toFixed(2));
    if (progress < 1) requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

const gaugeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    if (el.dataset.played === "1") return;
    el.dataset.played = "1";
    animateGauge(el);
  });
}, { threshold: 0.45 });

gauges.forEach((el) => gaugeObserver.observe(el));

function setupCarousel(carousel, slideSelector, intervalMs) {
  const slides = Array.from(carousel.querySelectorAll(slideSelector));
  if (slides.length < 2) return;
  const dots = carousel.parentElement?.querySelector(".scene-dots");
  const dotItems = dots ? Array.from(dots.querySelectorAll("span")) : [];

  let activeIndex = slides.findIndex((slide) => slide.classList.contains("is-active"));
  if (activeIndex < 0) {
    activeIndex = 0;
    slides[0].classList.add("is-active");
  }
  if (dotItems[activeIndex]) dotItems[activeIndex].classList.add("is-active");

  window.setInterval(() => {
    const current = slides[activeIndex];
    const nextIndex = (activeIndex + 1) % slides.length;
    const next = slides[nextIndex];

    current.classList.remove("is-active");
    current.classList.add("is-exiting");
    next.classList.add("is-active");
    dotItems.forEach((dot, index) => dot.classList.toggle("is-active", index === nextIndex));

    window.setTimeout(() => current.classList.remove("is-exiting"), 760);
    activeIndex = nextIndex;
  }, intervalMs);
}

document.querySelectorAll(".product-carousel").forEach((carousel) => {
  setupCarousel(carousel, ".product-slide", 3000);
});

document.querySelectorAll(".scene-carousel").forEach((carousel) => {
  setupCarousel(carousel, ".scene-slide", 3600);
});

const leadToggle = document.querySelector(".lead-toggle");
const leadForm = document.querySelector("#leadForm");

if (leadToggle && leadForm) {
  leadToggle.addEventListener("click", () => {
    const isOpen = leadToggle.getAttribute("aria-expanded") === "true";
    leadToggle.setAttribute("aria-expanded", String(!isOpen));
    leadForm.hidden = isOpen;
  });
}

const revealItems = document.querySelectorAll(".metric, .model-card, .panel, .data-card, .kb-card, .flow-step, .quote-card, .contact-card, .process-node, .use-process");

revealItems.forEach((el, index) => {
  el.style.opacity = "0";
  el.style.transform = "translateY(18px)";
  el.style.transition = "opacity .65s ease, transform .65s ease";
  el.style.transitionDelay = `${Math.min(index % 8, 6) * 45}ms`;
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    el.style.opacity = "1";
    el.style.transform = "translateY(0)";
    revealObserver.unobserve(el);
  });
}, { threshold: 0.14 });

revealItems.forEach((el) => revealObserver.observe(el));
