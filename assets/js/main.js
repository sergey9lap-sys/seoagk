const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reduceMotion) {
  const revealItems = Array.from(document.querySelectorAll(".reveal"));
  const counterItems = Array.from(document.querySelectorAll("[data-count]"));
  const numberFormatter = new Intl.NumberFormat("ru-RU");

  const formatCounter = (value, suffix) => `${numberFormatter.format(value)}${suffix || ""}`;

  const runCounter = (item) => {
    if (item.dataset.counted === "true") return;

    const target = Number(item.dataset.count || 0);
    const suffix = item.dataset.suffix || "";
    const duration = target > 1000 ? 1500 : 1200;
    const startTime = performance.now();

    item.dataset.counted = "true";
    item.textContent = formatCounter(0, suffix);

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);

      item.textContent = formatCounter(value, suffix);

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        item.textContent = formatCounter(target, suffix);
      }
    };

    requestAnimationFrame(tick);
  };

  const runCountersInside = (root) => {
    if (root.matches?.("[data-count]")) {
      runCounter(root);
    }

    root.querySelectorAll?.("[data-count]").forEach(runCounter);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          runCountersInside(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: "0px 0px -10% 0px",
      threshold: 0.12,
    },
  );

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index % 8, 5) * 70}ms`;
    observer.observe(item);
  });

  requestAnimationFrame(() => {
    document.body.classList.add("motion-ready");
    revealItems.forEach((item) => {
      const rect = item.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.92) {
        item.classList.add("is-visible");
        runCountersInside(item);
      }
    });
  });

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          runCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: "0px 0px -8% 0px",
      threshold: 0.3,
    },
  );

  counterItems.forEach((item) => counterObserver.observe(item));
}
