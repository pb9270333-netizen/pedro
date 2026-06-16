(() => {
  const siteData = window.BlackNaipeData || {};
  const brand = siteData.brand || {};
  const WHATSAPP_NUMBER = brand.whatsappNumber || "5511948399275";
  const INSTAGRAM_URL = brand.instagramUrl || "https://www.instagram.com/ton.baroni/";
  const DEFAULT_MESSAGE = brand.whatsappMessage || "Olá, vim pelo site e quero agendar um horário.";
  const whatsappUrl = message => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  const services = siteData.services || [];
  const barbers = siteData.barbers?.length ? siteData.barbers : [{ name: "Wellington Baroni", specialty: "Especialista em crespos, cacheados e degradê." }];

  const state = {
    service: null,
    mode: "detail",
    step: 1,
    barber: barbers[0]?.name || "Wellington Baroni",
    date: "",
    time: "",
    client: { name: "", whatsapp: "", instagram: "" },
    preferences: { side: "", line: "", beard: "", dislikes: "", fragrance: "" }
  };

  const grid = document.querySelector("#services-grid");
  const overlay = document.querySelector("#service-experience");
  const content = document.querySelector("#service-experience-content");
  const closeButton = document.querySelector(".service-experience-close");
  if (!grid || !overlay || !content || !services.length) return;

  const currency = value => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 }).format(value);
  const escapeHtml = value => String(value || "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]);
  const persist = () => localStorage.setItem("blackNaipeBooking", JSON.stringify({ ...state, service: state.service?.slug || null }));
  const formatDate = date => new Intl.DateTimeFormat("pt-BR", { weekday: "short", day: "2-digit", month: "short" }).format(new Date(`${date}T12:00:00`));
  const longDate = date => new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" }).format(new Date(`${date}T12:00:00`));

  const availableDates = () => {
    const result = [];
    const cursor = new Date();
    cursor.setDate(cursor.getDate() + 1);
    while (result.length < 12) {
      if (![0, 1].includes(cursor.getDay())) result.push(cursor.toISOString().slice(0, 10));
      cursor.setDate(cursor.getDate() + 1);
    }
    return result;
  };

  const renderCards = () => {
    grid.innerHTML = services.map(service => `
      <article class="service-campaign-card" tabindex="0" role="button" data-service="${service.slug}" aria-label="Reservar ${escapeHtml(service.name)}">
        <img class="service-campaign-image" src="${service.mainImage}" alt="${escapeHtml(service.name)}" loading="lazy">
        <span class="service-campaign-duration">${escapeHtml(service.duration)}</span>
        <span class="service-campaign-badge">${escapeHtml(service.badge || service.category)}</span>
        <div class="service-campaign-body">
          <span class="service-campaign-category">${escapeHtml(service.category)}</span>
          <h3>${escapeHtml(service.name)}</h3>
          <p>${escapeHtml(service.shortDescription)}</p>
          <div class="service-campaign-foot"><strong class="service-campaign-price">${currency(service.price)}</strong><span class="service-card-cta">Reservar</span></div>
        </div>
      </article>`).join("");
  };

  const openOverlay = service => {
    state.service = service;
    state.mode = "detail";
    state.step = 1;
    render();
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("service-overlay-open");
    overlay.scrollTop = 0;
    persist();
  };

  const closeOverlay = () => {
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("service-overlay-open");
  };

  const renderDetail = () => {
    const service = state.service;
    content.innerHTML = `
      <section class="service-detail-hero">
        <img src="${service.mainImage}" alt="${escapeHtml(service.name)}">
        <div class="service-detail-hero-copy">
          <span class="eyebrow">${escapeHtml(service.badge || service.category)}</span>
          <h2>${escapeHtml(service.name)}</h2>
          <p class="lead">${escapeHtml(service.shortDescription)}</p>
          <div class="service-detail-meta"><span>${escapeHtml(service.duration)}</span><span>${currency(service.price)}</span></div>
        </div>
      </section>
      <div class="service-detail-content">
        <div class="service-detail-intro"><h3>Identidade<br>no detalhe.</h3><p>${escapeHtml(service.fullDescription)}</p></div>
        <div class="service-benefits">${service.benefits.map((benefit, index) => `<div class="service-benefit"><span>${index + 1}</span><strong>${escapeHtml(benefit)}</strong></div>`).join("")}</div>
        <p class="service-gallery-title">Referências reais deste estilo. Deslize para ver.</p>
        <div class="service-detail-gallery">${service.galleryImages.map((image, index) => `<img src="${image}" alt="${escapeHtml(service.name)}, referência ${index + 1}" loading="lazy">`).join("")}</div>
      </div>
      <div class="service-reserve-sticky"><div><strong>${currency(service.price)}</strong><small>${escapeHtml(service.duration)}</small></div><button class="btn btn-solid" type="button" data-start-booking>Reservar agora</button></div>`;
  };

  const progress = () => `<div class="booking-progress">${Array.from({ length: 6 }, (_, index) => `<span class="${index < state.step ? "active" : ""}"></span>`).join("")}</div>`;
  const nav = (nextLabel = "Continuar") => `<p class="booking-error" aria-live="polite"></p><div class="booking-nav"><button class="btn" type="button" data-booking-back>${state.step === 1 ? "Ver detalhes" : "Voltar"}</button><button class="btn btn-solid" type="button" data-booking-next>${nextLabel}</button></div>`;
  const heading = (label, title, copy) => `<span class="booking-step-label">${label}</span><h2 class="booking-title">${title}</h2><p class="booking-copy">${copy}</p>${progress()}`;
  const option = (key, value, selected, label = value) => `<button class="booking-option ${selected === value ? "selected" : ""}" type="button" data-pref-key="${key}" data-pref-value="${escapeHtml(value)}"><strong>${escapeHtml(label)}</strong></button>`;

  const renderBooking = () => {
    let body = "";
    if (state.step === 1) body = `${heading("Etapa 1 de 6", "Escolha o barbeiro.", "Quem vai cuidar da sua assinatura hoje?")}
      <div class="booking-options barber-options">${barbers.map(barber => `<button class="booking-option ${state.barber === barber.name ? "selected" : ""}" type="button" data-barber="${escapeHtml(barber.name)}"><strong>${escapeHtml(barber.name)}</strong><small>${escapeHtml(barber.specialty || "")}</small></button>`).join("")}</div>${nav()}`;
    if (state.step === 2) body = `${heading("Etapa 2 de 6", "Escolha a data.", "Selecione um dia disponível para ocupar sua cadeira.")}
      <div class="booking-options">${availableDates().map((date, index) => `<button class="booking-option ${state.date === date ? "selected" : ""}" type="button" data-date="${date}" ${index === 4 ? "disabled" : ""}><strong>${formatDate(date)}</strong><small>${index === 4 ? "Indisponível" : "Disponível"}</small></button>`).join("")}</div>${nav()}`;
    if (state.step === 3) body = `${heading("Etapa 3 de 6", "Escolha o horário.", `Horários disponíveis para ${state.date ? longDate(state.date) : "a data escolhida"}.`)}
      <div class="booking-options">${state.service.availableTimes.map((time, index) => `<button class="booking-option ${state.time === time ? "selected" : ""}" type="button" data-time="${time}" ${index === 2 ? "disabled" : ""}><strong>${time}</strong><small>${index === 2 ? "Indisponível" : "Disponível"}</small></button>`).join("")}</div>${nav()}`;
    if (state.step === 4) body = `${heading("Etapa 4 de 6", "Como você gosta?", "Preferências rápidas para o barbeiro já chegar entendendo sua presença.")}
      <div class="preference-block"><span>Lateral</span><div class="booking-options mini-options">${["Baixa", "Média", "Alta"].map(value => option("side", value, state.preferences.side)).join("")}</div></div>
      <div class="preference-block"><span>Risca</span><div class="booking-options mini-options">${["Sim", "Não"].map(value => option("line", value, state.preferences.line)).join("")}</div></div>
      <div class="preference-block"><span>Barba</span><div class="booking-options mini-options">${["Sim", "Não"].map(value => option("beard", value, state.preferences.beard)).join("")}</div></div>
      <div class="preference-block"><span>Fragrância</span><div class="booking-options mini-options">${["Amadeirado", "Fresco", "Doce suave", "Sem perfume"].map(value => option("fragrance", value, state.preferences.fragrance)).join("")}</div></div>
      <div class="booking-fields"><label>O que você não gosta?<textarea name="dislikes" placeholder="Ex: não deixar muito alto, não marcar demais, não tirar volume...">${escapeHtml(state.preferences.dislikes)}</textarea></label></div>${nav()}`;
    if (state.step === 5) body = `${heading("Etapa 5 de 6", "Seus dados.", "Usamos apenas para confirmar sua reserva e chamar no WhatsApp.")}
      <div class="booking-fields"><label>Nome completo<input name="name" value="${escapeHtml(state.client.name)}" autocomplete="name" placeholder="Seu nome completo"></label><label>WhatsApp<input name="whatsapp" value="${escapeHtml(state.client.whatsapp)}" inputmode="tel" autocomplete="tel" placeholder="(11) 99999-9999"></label><label>Instagram opcional<input name="instagram" value="${escapeHtml(state.client.instagram)}" placeholder="@seuusuario"></label></div>${nav()}`;
    if (state.step === 6) body = `${heading("Etapa 6 de 6", "Revise e confirme.", "Tudo certo? O próximo toque abre o WhatsApp com a mensagem pronta.")}
      <div class="booking-summary">${summaryRows()}</div>${nav("Confirmar no WhatsApp")}`;
    content.innerHTML = `<form class="booking-flow" novalidate>${body}</form>`;
  };

  const summaryRows = () => [
    ["Serviço", state.service.name], ["Barbeiro", state.barber], ["Data", longDate(state.date)], ["Horário", state.time],
    ["Duração", state.service.duration], ["Valor", currency(state.service.price)], ["Lateral", state.preferences.side],
    ["Risca", state.preferences.line], ["Barba", state.preferences.beard], ["Fragrância", state.preferences.fragrance],
    ["Evitar", state.preferences.dislikes || "Não informado"], ["Nome", state.client.name], ["WhatsApp", state.client.whatsapp]
  ].map(([label, value]) => `<div class="booking-summary-row"><span>${label}</span><strong>${escapeHtml(value)}</strong></div>`).join("");

  const bookingMessage = () => `${DEFAULT_MESSAGE}\n\nServiço: ${state.service.name}\nBarbeiro: ${state.barber}\nData: ${longDate(state.date)}\nHorário: ${state.time}\nDuração: ${state.service.duration}\nValor: ${currency(state.service.price)}\nNome: ${state.client.name}\nWhatsApp: ${state.client.whatsapp}\nInstagram: ${state.client.instagram || "Não informado"}\nLateral: ${state.preferences.side}\nRisca: ${state.preferences.line}\nBarba: ${state.preferences.beard}\nFragrância: ${state.preferences.fragrance}\nNão gosto: ${state.preferences.dislikes || "Não informado"}`;

  const renderSuccess = () => {
    content.innerHTML = `<section class="booking-success"><div class="booking-success-inner"><div class="booking-success-mark">OK</div><span class="eyebrow">Mensagem pronta</span><h2>Agora é só confirmar.</h2><p>Envie no WhatsApp para Wellington Baroni fechar sua cadeira. Dúvidas: ${brand.phoneDisplay || "11 94839-9275"}.</p><div class="booking-success-actions"><a class="btn btn-solid" href="${whatsappUrl(bookingMessage())}">Abrir WhatsApp</a><a class="btn" href="${INSTAGRAM_URL}" target="_blank" rel="noopener">Ver Instagram</a><a class="btn" href="index.html">Voltar ao início</a></div></div></section>`;
  };

  const render = () => {
    if (state.mode === "detail") renderDetail();
    if (state.mode === "booking") renderBooking();
    if (state.mode === "success") renderSuccess();
    overlay.scrollTop = 0;
  };

  const syncInputs = () => {
    const values = Object.fromEntries(new FormData(content.querySelector(".booking-flow") || document.createElement("form")).entries());
    if (state.step === 4) state.preferences.dislikes = values.dislikes || "";
    if (state.step === 5) state.client = { name: values.name || "", whatsapp: values.whatsapp || "", instagram: values.instagram || "" };
    persist();
  };

  const validationError = () => {
    if (state.step === 1 && !state.barber) return "Escolha quem vai cuidar do seu corte.";
    if (state.step === 2 && !state.date) return "Escolha uma data disponível para continuar.";
    if (state.step === 3 && !state.time) return "Escolha um horário disponível para continuar.";
    if (state.step === 4 && (!state.preferences.side || !state.preferences.line || !state.preferences.beard || !state.preferences.fragrance)) return "Marque suas preferências principais para continuar.";
    if (state.step === 5 && (!state.client.name.trim() || !state.client.whatsapp.replace(/\D/g, "").match(/\d{10,}/))) return "Informe seu nome completo e um WhatsApp válido.";
    return "";
  };

  grid.addEventListener("click", event => {
    const card = event.target.closest("[data-service]");
    if (card) openOverlay(services.find(service => service.slug === card.dataset.service));
  });
  grid.addEventListener("keydown", event => {
    if (["Enter", " "].includes(event.key)) {
      const card = event.target.closest("[data-service]");
      if (card) {
        event.preventDefault();
        openOverlay(services.find(service => service.slug === card.dataset.service));
      }
    }
  });
  closeButton.addEventListener("click", closeOverlay);
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && overlay.classList.contains("open")) closeOverlay();
  });

  content.addEventListener("click", event => {
    if (event.target.closest("[data-start-booking]")) {
      state.mode = "booking";
      state.step = 1;
      render();
      return;
    }
    const barber = event.target.closest("[data-barber]");
    if (barber) { state.barber = barber.dataset.barber; persist(); render(); return; }
    const date = event.target.closest("[data-date]");
    if (date && !date.disabled) { state.date = date.dataset.date; state.time = ""; persist(); render(); return; }
    const time = event.target.closest("[data-time]");
    if (time && !time.disabled) { state.time = time.dataset.time; persist(); render(); return; }
    const pref = event.target.closest("[data-pref-key]");
    if (pref) { state.preferences[pref.dataset.prefKey] = pref.dataset.prefValue; persist(); render(); return; }
    if (event.target.closest("[data-booking-back]")) {
      syncInputs();
      if (state.step === 1) state.mode = "detail"; else state.step -= 1;
      render();
      return;
    }
    if (event.target.closest("[data-booking-next]")) {
      syncInputs();
      const error = validationError();
      if (error) { content.querySelector(".booking-error").textContent = error; return; }
      if (state.step === 6) {
        state.mode = "success";
        localStorage.removeItem("blackNaipeBooking");
        render();
      } else {
        state.step += 1;
        render();
      }
    }
  });
  content.addEventListener("submit", event => event.preventDefault());

  try {
    const saved = JSON.parse(localStorage.getItem("blackNaipeBooking") || "null");
    if (saved) {
      state.barber = saved.barber || state.barber;
      state.date = saved.date || "";
      state.time = saved.time || "";
      state.client = saved.client || state.client;
      state.preferences = saved.preferences || state.preferences;
    }
  } catch (_) {
    localStorage.removeItem("blackNaipeBooking");
  }
  window.blackNaipeServices = services;
  renderCards();
})();
