(() => {
  const routes = [
    [/\/dashboard(?:\.txt)?\/?$/, "/dashboard"],
    [/\/login(?:\.txt)?\/?$/, "/login"],
  ];

  document.addEventListener(
    "click",
    (event) => {
      const element =
        event.target instanceof Element ? event.target : event.target?.parentElement;
      const link = element?.closest("a");

      if (!link) return;

      const pathname = new URL(link.href, window.location.href).pathname;
      const destination = routes.find(([pattern]) => pattern.test(pathname))?.[1];

      if (!destination) return;

      event.preventDefault();
      event.stopImmediatePropagation();
      window.location.assign(destination);
    },
    true,
  );
})();
