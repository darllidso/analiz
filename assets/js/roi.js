// =========================================================
// ROI (Estudos aplicados) - JS da página
// Arquivo: assets/js/roi.js
// =========================================================

// Tabs
function initTabs() {
  const btns = document.querySelectorAll(".tab-btn");
  const panes = document.querySelectorAll(".tab-pane");

  if (!btns.length || !panes.length) return;

  btns.forEach((b) => {
    b.addEventListener("click", () => {
      btns.forEach((x) => {
        x.classList.remove("active");
        x.setAttribute("aria-selected", "false");
      });

      panes.forEach((p) => {
        p.classList.remove("active");
        p.setAttribute("aria-hidden", "true");
      });

      b.classList.add("active");
      b.setAttribute("aria-selected", "true");

      const pane = document.getElementById(b.dataset.tab);
      if (pane) {
        pane.classList.add("active");
        pane.setAttribute("aria-hidden", "false");
      }
    });
  });
}

// Accordion
function initAccordions() {
  const accs = document.querySelectorAll(".acc");
  if (!accs.length) return;

  function toggleAcc(item, acc) {
    const isOpen = item.classList.contains("open");

    acc.querySelectorAll(".acc-item").forEach((i) => i.classList.remove("open"));
    acc.querySelectorAll(".acc-head").forEach((h) => h.setAttribute("aria-expanded", "false"));
    acc.querySelectorAll(".acc-head strong").forEach((s) => (s.textContent = "+"));

    if (!isOpen) {
      item.classList.add("open");
      const head = item.querySelector(".acc-head");
      if (head) {
        head.setAttribute("aria-expanded", "true");
        const icon = head.querySelector("strong");
        if (icon) icon.textContent = "−";
      }
    }
  }

  accs.forEach((acc) => {
    acc.querySelectorAll(".acc-head").forEach((head) => {
      head.addEventListener("click", () => toggleAcc(head.closest(".acc-item"), acc));
      head.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleAcc(head.closest(".acc-item"), acc);
        }
      });
    });
  });
}

// Simulador
function initSimulator() {
  const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

  const fieldIds = ["custo-dev", "custo-train", "custo-infra", "custo-outros", "beneficio"];
  const fields = fieldIds.map((id) => document.getElementById(id)).filter(Boolean);

  // Se não existir simulador na página, não faz nada
  if (fields.length === 0) return;

  function onlyNumber(v) {
    if (typeof v !== "string") return 0;
    v = v.replace(/\./g, "").replace(",", ".");
    const n = parseFloat(v.replace(/[^\d.-]/g, ""));
    return Number.isNaN(n) ? 0 : n;
  }

  function unformat(inp) {
    const n = onlyNumber(inp.value);
    inp.value = n ? String(n) : "";
  }

  function formatMoney(inp) {
    const n = onlyNumber(inp.value);
    inp.value = n ? BRL.format(n) : "";
  }

  function getVal(id) {
    const el = document.getElementById(id);
    return el ? onlyNumber(el.value) : 0;
  }

  function labelFor(roi) {
    if (!Number.isFinite(roi)) return { txt: "—", cls: "neg" };
    if (roi < 0) return { txt: "Negativo", cls: "neg" };
    if (roi < 50) return { txt: "Baixo", cls: "low" };
    if (roi < 200) return { txt: "Bom", cls: "good" };
    return { txt: "Excelente", cls: "excellent" };
  }

  function calc() {
    const custo =
      getVal("custo-dev") +
      getVal("custo-train") +
      getVal("custo-infra") +
      getVal("custo-outros");

    const benef = getVal("beneficio");
    const roi = custo > 0 ? (benef / custo) * 100 : 0;

    const kCustos = document.getElementById("k-custos");
    const kBenef = document.getElementById("k-benef");
    const kRoi = document.getElementById("k-roi");
    const badge = document.getElementById("k-badge");

    if (kCustos) kCustos.textContent = BRL.format(custo || 0);
    if (kBenef) kBenef.textContent = BRL.format(benef || 0);
    if (kRoi) kRoi.textContent = `${(Number.isFinite(roi) ? roi : 0).toFixed(1)}%`;

    if (badge) {
      const lab = labelFor(roi);
      badge.textContent = lab.txt;
      badge.className = `badge ${lab.cls}`;
    }
  }

  fields.forEach((inp) => {
    inp.addEventListener("blur", () => {
      formatMoney(inp);
      calc();
    });

    inp.addEventListener("focus", () => {
      unformat(inp);
    });

    inp.addEventListener("input", () => {
      calc();
    });
  });

  // Inicializa valores
  calc();
}

// Boot
document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  initAccordions();
  initSimulator();
});
