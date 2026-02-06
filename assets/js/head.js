// assets/js/head.js
(function () {
  // Descobre qual prefixo usar com base no caminho atual.
  // Home (raiz) -> ""
  // Subpastas (ex: /automacoes/index.html) -> "../"
  const path = window.location.pathname;
  const isRoot = path.endsWith("/index.html") ? path.split("/").length <= 2 : path.split("/").length <= 2;
  const prefix = isRoot ? "" : "../";

  const cssHref = prefix + "styles.css";

  // Preload do CSS
  const preload = document.createElement("link");
  preload.rel = "preload";
  preload.as = "style";
  preload.href = cssHref;
  document.head.appendChild(preload);

  // CSS principal
  const css = document.createElement("link");
  css.rel = "stylesheet";
  css.href = cssHref;
  css.onload = () => {
    // Assim que o CSS carregar, libera a página
    document.documentElement.style.visibility = "visible";
  };
  css.onerror = () => {
    // Se o CSS falhar, não deixa a página sumir
    document.documentElement.style.visibility = "visible";
  };
  document.head.appendChild(css);

  // Anti-FOUC: esconde só no início (e libera no onload/onerror)
  const antiFouc = document.createElement("style");
  antiFouc.textContent = "html{visibility:hidden}";
  document.head.appendChild(antiFouc);

  // Fail-safe: se por algum motivo nada disparar, libera em 1s
  setTimeout(() => {
    document.documentElement.style.visibility = "visible";
  }, 1000);
})();
