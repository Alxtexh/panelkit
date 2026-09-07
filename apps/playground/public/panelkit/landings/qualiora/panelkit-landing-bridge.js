(() => {
  const landingRoot = "/panelkit/landings/qualiora/";

  document.addEventListener("click", (event) => {
    const element = event.target instanceof Element
      ? event.target
      : event.target?.parentElement;
    const link = element?.closest("a");

    if (!link) return;

    const url = new URL(link.href, window.location.href);

    if (!url.pathname.startsWith(landingRoot)) return;

    if (/\/(?:dashboard|dashboards\/analytics)(?:\/|$)/.test(url.pathname)) {
      event.preventDefault();
      window.location.assign("/dashboard");
      return;
    }

    if (/\/(?:en\/|ar\/)?(?:login|register|sign-in)(?:\/|$)/.test(url.pathname)) {
      event.preventDefault();
      window.location.assign("/login");
    }
  }, true);
})();
