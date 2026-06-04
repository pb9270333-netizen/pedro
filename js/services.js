(() => {
  const WHATSAPP_NUMBER = "5511982356076";
  const INSTAGRAM_URL = "https://www.instagram.com/ton.baroni/";
  const whatsappUrl = message => `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}&type=phone_number&app_absent=0`;
  const images = {
    design: "assets/images/corte-02.jpg",
    power: "assets/images/corte-01.jpg",
    beard: "assets/images/corte-03.jpg",
    signature: "assets/images/corte-04.jpg",
    ritual: "assets/images/barbeiro.jpg",
    hero: "assets/images/corte-hero.jpg"
  };

  const services = [
    {
      id: 1, slug: "corte-sobrancelhas", name: "Corte e Sobrancelhas",
      shortDescription: "Precisão que organiza toda a expressão.",
      fullDescription: "Corte masculino construído para o seu rosto, finalizado com desenho e limpeza das sobrancelhas para uma presença mais nítida.",
      price: 60, duration: "50 min", mainImage: images.design,
      galleryImages: [images.design, images.signature, images.hero],
      benefits: ["Acabamento alinhado", "Sobrancelha natural", "Leitura personalizada", "Finalização profissional"],
      category: "Precisão", availableTimes: ["09:00", "10:00", "11:30", "14:00", "16:00", "18:30"]
    },
    {
      id: 2, slug: "corte-black-power", name: "Corte Black Power",
      shortDescription: "Presença, volume e identidade.",
      fullDescription: "Modelagem feita com tesoura para respeitar volume, textura e movimento. O formato é desenhado para valorizar sua identidade.",
      price: 80, duration: "1h20", mainImage: images.power,
      galleryImages: [images.power, images.hero, images.design],
      benefits: ["Textura respeitada", "Volume equilibrado", "Formato personalizado", "Finalização dos cachos"],
      category: "Textura", availableTimes: ["09:00", "10:30", "13:30", "15:00", "17:00", "18:30"]
    },
    {
      id: 3, slug: "barba", name: "Barba",
      shortDescription: "Contorno limpo. Presença marcante.",
      fullDescription: "Desenho e alinhamento da barba com atenção ao perfil, densidade dos fios e acabamento que conversa com seu rosto.",
      price: 45, duration: "30 min", mainImage: images.beard,
      galleryImages: [images.beard, images.signature, images.ritual],
      benefits: ["Desenho de perfil", "Contorno preciso", "Cuidado com a pele", "Acabamento profissional"],
      category: "Barba", availableTimes: ["09:00", "09:45", "11:00", "14:30", "16:30", "19:00"]
    },
    {
      id: 4, slug: "corte-barba", name: "Corte e Barba",
      shortDescription: "Imagem completa, do topo ao perfil.",
      fullDescription: "Uma composição completa para alinhar cabelo, barba e perfil em uma única assinatura visual.",
      price: 80, duration: "1h20", mainImage: images.signature,
      galleryImages: [images.signature, images.beard, images.design],
      benefits: ["Visual integrado", "Barba alinhada", "Corte personalizado", "Direção de imagem"],
      category: "Assinatura", availableTimes: ["09:00", "10:30", "13:00", "15:00", "17:00", "18:30"]
    },
    {
      id: 5, slug: "combo-completo", name: "Combo Completo",
      shortDescription: "O ritual inteiro. Sem atalhos.",
      fullDescription: "Corte, barba e sobrancelhas conduzidos como uma experiência única para elevar sua presença por completo.",
      price: 90, duration: "1h30", mainImage: images.ritual,
      galleryImages: [images.ritual, images.beard, images.power],
      benefits: ["Experiência completa", "Prioridade no ritual", "Acabamento integral", "Presença renovada"],
      category: "Ritual", availableTimes: ["09:00", "10:30", "13:30", "15:30", "17:30"]
    },
    {
      id: 6, slug: "pigmentacao", name: "Pigmentação Perfil e/ou Barba",
      shortDescription: "Realce sutil. Resultado natural.",
      fullDescription: "Pigmentação estratégica para realçar o perfil, preencher pontos e valorizar o desenho sem pesar o resultado.",
      price: 30, duration: "30 min", mainImage: images.hero,
      galleryImages: [images.hero, images.beard, images.signature],
      benefits: ["Realce natural", "Cobertura sutil", "Perfil definido", "Aplicação personalizada"],
      category: "Acabamento", availableTimes: ["09:30", "10:30", "12:00", "14:00", "16:00", "18:00"]
    }
  ];

  const state = {
    service: null, mode: "detail", step: 1, date: "", time: "",
    client: { name: "", whatsapp: "", instagram: "" },
    preferences: "", reference: "", referenceFile: "", payment: ""
  };

  const grid = document.querySelector("#services-grid");
  const overlay = document.querySelector("#service-experience");
  const content = document.querySelector("#service-experience-content");
  const closeButton = document.querySelector(".service-experience-close");
  if (!grid || !overlay || !content) return;

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
      <article class="service-campaign-card" tabindex="0" role="button" data-service="${service.slug}" aria-label="Ver detalhes de ${service.name}">
        <img class="service-campaign-image" src="${service.mainImage}" alt="${service.name}" loading="lazy">
        <span class="service-campaign-duration">${service.duration}</span>
        <div class="service-campaign-body">
          <span class="service-campaign-category">${service.category}</span>
          <h3>${service.name}</h3>
          <p>${service.shortDescription}</p>
          <div class="service-campaign-foot"><strong class="service-campaign-price">${currency(service.price)}</strong><span class="service-card-cta">Ver detalhes →</span></div>
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
        <img src="${service.mainImage}" alt="${service.name}">
        <div class="service-detail-hero-copy">
          <span class="eyebrow">${service.category}</span>
          <h2>${service.name}</h2>
          <p class="lead">${service.shortDescription}</p>
          <div class="service-detail-meta"><span>${service.duration}</span><span>${currency(service.price)}</span></div>
        </div>
      </section>
      <div class="service-detail-content">
        <div class="service-detail-intro"><h3>Feito para<br>sustentar presença.</h3><p>${service.fullDescription}</p></div>
        <div class="service-benefits">${service.benefits.map((benefit, index) => `<div class="service-benefit"><span>${index + 1}</span><strong>${benefit}</strong></div>`).join("")}</div>
        <p class="service-gallery-title">Referências reais deste estilo · deslize para ver</p>
        <div class="service-detail-gallery">${service.galleryImages.map((image, index) => `<img src="${image}" alt="${service.name}, referência ${index + 1}" loading="lazy">`).join("")}</div>
      </div>
      <div class="service-reserve-sticky"><div><strong>${currency(service.price)}</strong><small>${service.duration}</small></div><button class="btn btn-solid" type="button" data-start-booking>Reservar agora</button></div>`;
  };

  const progress = () => `<div class="booking-progress">${Array.from({ length: 7 }, (_, index) => `<span class="${index < state.step ? "active" : ""}"></span>`).join("")}</div>`;
  const nav = (nextLabel = "Continuar") => `<p class="booking-error" aria-live="polite"></p><div class="booking-nav"><button class="btn" type="button" data-booking-back>${state.step === 1 ? "Ver detalhes" : "Voltar"}</button><button class="btn btn-solid" type="button" data-booking-next>${nextLabel}</button></div>`;
  const heading = (label, title, copy) => `<span class="booking-step-label">${label}</span><h2 class="booking-title">${title}</h2><p class="booking-copy">${copy}</p>${progress()}`;

  const renderBooking = () => {
    let body = "";
    if (state.step === 1) body = `${heading("Etapa 1 de 7", "Escolha a data.", "Selecione o melhor dia disponível para viver seu ritual.")}
      <div class="booking-options">${availableDates().map((date, index) => `<button class="booking-option ${state.date === date ? "selected" : ""}" type="button" data-date="${date}" ${index === 4 ? "disabled" : ""}><strong>${formatDate(date)}</strong><small>${index === 4 ? "Indisponível" : "Disponível"}</small></button>`).join("")}</div>${nav()}`;
    if (state.step === 2) body = `${heading("Etapa 2 de 7", "Escolha o horário.", `Horários disponíveis para ${state.date ? longDate(state.date) : "a data escolhida"}.`)}
      <div class="booking-options">${state.service.availableTimes.map((time, index) => `<button class="booking-option ${state.time === time ? "selected" : ""}" type="button" data-time="${time}" ${index === 2 ? "disabled" : ""}><strong>${time}</strong><small>${index === 2 ? "Indisponível" : "Disponível"}</small></button>`).join("")}</div>${nav()}`;
    if (state.step === 3) body = `${heading("Etapa 3 de 7", "Quem vai ocupar a cadeira?", "Seus dados são usados somente para confirmar e acompanhar a reserva.")}
      <div class="booking-fields"><label>Nome completo<input name="name" value="${escapeHtml(state.client.name)}" autocomplete="name" placeholder="Seu nome completo"></label><label>WhatsApp<input name="whatsapp" value="${escapeHtml(state.client.whatsapp)}" inputmode="tel" autocomplete="tel" placeholder="(11) 99999-9999"></label><label>Instagram opcional<input name="instagram" value="${escapeHtml(state.client.instagram)}" placeholder="@seuusuario"></label></div>${nav()}`;
    if (state.step === 4) body = `${heading("Etapa 4 de 7", "Como você gosta do seu corte?", "Conte o que deve ser preservado e o que você deseja transformar.")}
      <div class="booking-fields"><label>Preferências e cuidados<textarea name="preferences" placeholder="Conte como você gosta do corte, o que não gosta, altura do degradê, formato da barba, acabamento, referências ou qualquer detalhe importante.">${escapeHtml(state.preferences)}</textarea></label></div>${nav()}`;
    if (state.step === 5) body = `${heading("Etapa 5 de 7", "Mostre sua referência.", "Envie uma foto ou cole um link. Isso ajuda nossa leitura antes do atendimento.")}
      <div class="booking-fields"><label>Link do Instagram, Pinterest ou referência<input name="reference" value="${escapeHtml(state.reference)}" placeholder="https://..."></label><label>Enviar foto ou print<input name="referenceFile" type="file" accept="image/*"></label>${state.referenceFile ? `<p class="form-feedback">Arquivo selecionado: ${escapeHtml(state.referenceFile)}</p>` : ""}</div>${nav()}`;
    if (state.step === 6) body = `${heading("Etapa 6 de 7", "Como prefere pagar?", "A demonstração registra sua preferência. O pagamento online será integrado futuramente.")}
      <div class="booking-options"><button class="booking-option ${state.payment === "Pagar no local" ? "selected" : ""}" type="button" data-payment="Pagar no local"><strong>Pagar no local</strong><small>Na cadeira</small></button><button class="booking-option ${state.payment === "Pagar sinal" ? "selected" : ""}" type="button" data-payment="Pagar sinal"><strong>Pagar sinal</strong><small>Reserva antecipada</small></button><button class="booking-option ${state.payment === "Pagar agora" ? "selected" : ""}" type="button" data-payment="Pagar agora"><strong>Pagar agora</strong><small>Pix ou cartão futuramente</small></button></div>${nav()}`;
    if (state.step === 7) body = `${heading("Etapa 7 de 7", "Revise sua reserva.", "Confira os detalhes antes de garantir seu horário.")}
      <div class="booking-summary">${summaryRows()}</div>${nav("Confirmar agendamento")}`;
    content.innerHTML = `<form class="booking-flow" novalidate>${body}</form>`;
  };

  const summaryRows = () => [
    ["Serviço", state.service.name], ["Data", longDate(state.date)], ["Horário", state.time],
    ["Duração", state.service.duration], ["Valor", currency(state.service.price)], ["Nome", state.client.name],
    ["WhatsApp", state.client.whatsapp], ["Preferências", state.preferences || "Não informado"],
    ["Referência", state.referenceFile || state.reference || "Não enviada"], ["Pagamento", state.payment]
  ].map(([label, value]) => `<div class="booking-summary-row"><span>${label}</span><strong>${escapeHtml(value)}</strong></div>`).join("");

  const renderSuccess = () => {
    const message = bookingMessage();
    const calendarUrl = calendarLink();
    content.innerHTML = `<section class="booking-success"><div class="booking-success-inner"><div class="booking-success-mark">✓</div><span class="eyebrow">Reserva registrada</span><h2>Seu horário está garantido.</h2><p>Envie a confirmação para Wellington Baroni concluir o atendimento. Dúvidas: 11 98235-6076.</p><div class="booking-success-actions"><a class="btn btn-solid" href="${whatsappUrl(message)}">Enviar no WhatsApp</a><a class="btn" href="${INSTAGRAM_URL}" target="_blank" rel="noopener">Ver Instagram</a><a class="btn" href="${calendarUrl}" download="black-naipe-agendamento.ics">Adicionar ao calendário</a><a class="btn" href="index.html">Voltar para o início</a></div></div></section>`;
  };

  const bookingMessage = () => `Olá, vim pelo site e quero agendar um horário.\n\nServiço: ${state.service.name}\nData: ${longDate(state.date)}\nHorário: ${state.time}\nDuração: ${state.service.duration}\nValor: ${currency(state.service.price)}\nNome: ${state.client.name}\nWhatsApp: ${state.client.whatsapp}\nPreferências: ${state.preferences || "Não informado"}\nReferência: ${state.referenceFile || state.reference || "Não enviada"}\nPagamento: ${state.payment}`;
  const calendarLink = () => {
    const start = new Date(`${state.date}T${state.time}:00`);
    const hours = Number(state.service.duration.match(/(\d+)h/)?.[1]) || 0;
    const trailingMinutes = Number(state.service.duration.match(/h(\d+)/)?.[1]) || Number(state.service.duration.match(/(\d+)\s*min/)?.[1]) || 0;
    const minutes = hours * 60 + trailingMinutes;
    const end = new Date(start.getTime() + minutes * 60000);
    const stamp = date => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nDTSTART:${stamp(start)}\nDTEND:${stamp(end)}\nSUMMARY:${state.service.name} - The Black Naipe\nDESCRIPTION:Experiência The Black Naipe\nEND:VEVENT\nEND:VCALENDAR`;
    return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
  };

  const render = () => {
    if (state.mode === "detail") renderDetail();
    if (state.mode === "booking") renderBooking();
    if (state.mode === "success") renderSuccess();
    overlay.scrollTop = 0;
  };

  const syncInputs = () => {
    const values = Object.fromEntries(new FormData(content.querySelector(".booking-flow") || document.createElement("form")).entries());
    if (state.step === 3) state.client = { name: values.name || "", whatsapp: values.whatsapp || "", instagram: values.instagram || "" };
    if (state.step === 4) state.preferences = values.preferences || "";
    if (state.step === 5) state.reference = values.reference || "";
    persist();
  };

  const validationError = () => {
    if (state.step === 1 && !state.date) return "Escolha uma data disponível para continuar.";
    if (state.step === 2 && !state.time) return "Escolha um horário disponível para continuar.";
    if (state.step === 3 && (!state.client.name.trim() || !state.client.whatsapp.replace(/\D/g, "").match(/\d{10,}/))) return "Informe seu nome completo e um WhatsApp válido.";
    if (state.step === 4 && state.preferences.trim().length < 10) return "Conte um pouco mais sobre como você gosta do seu corte.";
    if (state.step === 6 && !state.payment) return "Escolha uma forma de pagamento.";
    return "";
  };

  grid.addEventListener("click", event => {
    const card = event.target.closest("[data-service]");
    if (card) openOverlay(services.find(service => service.slug === card.dataset.service));
  });
  grid.addEventListener("keydown", event => {
    if (["Enter", " "].includes(event.key)) {
      const card = event.target.closest("[data-service]");
      if (card) { event.preventDefault(); openOverlay(services.find(service => service.slug === card.dataset.service)); }
    }
  });
  closeButton.addEventListener("click", closeOverlay);
  document.addEventListener("keydown", event => { if (event.key === "Escape" && overlay.classList.contains("open")) closeOverlay(); });

  content.addEventListener("click", event => {
    if (event.target.closest("[data-start-booking]")) { state.mode = "booking"; state.step = 1; render(); return; }
    const date = event.target.closest("[data-date]"); if (date && !date.disabled) { state.date = date.dataset.date; state.time = ""; persist(); render(); return; }
    const time = event.target.closest("[data-time]"); if (time && !time.disabled) { state.time = time.dataset.time; persist(); render(); return; }
    const payment = event.target.closest("[data-payment]"); if (payment) { state.payment = payment.dataset.payment; persist(); render(); return; }
    if (event.target.closest("[data-booking-back]")) {
      syncInputs();
      if (state.step === 1) state.mode = "detail"; else state.step -= 1;
      render(); return;
    }
    if (event.target.closest("[data-booking-next]")) {
      syncInputs();
      const error = validationError();
      if (error) { content.querySelector(".booking-error").textContent = error; return; }
      if (state.step === 7) {
        const button = event.target.closest("[data-booking-next]");
        button.disabled = true; button.textContent = "Confirmando...";
        setTimeout(() => { state.mode = "success"; localStorage.removeItem("blackNaipeBooking"); render(); }, 650);
      } else { state.step += 1; render(); }
    }
  });
  content.addEventListener("change", event => {
    if (event.target.name === "referenceFile") { state.referenceFile = event.target.files?.[0]?.name || ""; persist(); render(); }
  });
  content.addEventListener("submit", event => event.preventDefault());

  window.blackNaipeServices = services;
  try {
    const saved = JSON.parse(localStorage.getItem("blackNaipeBooking") || "null");
    if (saved) {
      state.date = saved.date || "";
      state.time = saved.time || "";
      state.client = saved.client || state.client;
      state.preferences = saved.preferences || "";
      state.reference = saved.reference || "";
      state.referenceFile = saved.referenceFile || "";
      state.payment = saved.payment || "";
    }
  } catch (_) {
    localStorage.removeItem("blackNaipeBooking");
  }
  renderCards();
})();
