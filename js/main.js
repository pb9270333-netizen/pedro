(() => {
  const siteData = window.BlackNaipeData || {};
  const brand = siteData.brand || {};
  const WHATSAPP_NUMBER = brand.whatsappNumber || "5511948399275";
  const DEFAULT_WHATSAPP_MESSAGE = brand.whatsappMessage || "Olá, vim pelo site e quero agendar um horário.";
  const INSTAGRAM_URL = brand.instagramUrl || "https://www.instagram.com/ton.baroni/";
  const whatsappUrl = message => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message || DEFAULT_WHATSAPP_MESSAGE)}`;
  const root = document.documentElement;
  const menuButton = document.querySelector(".menu-btn");
  const nav = document.querySelector(".nav");
  const currency = value => typeof value === "number"
    ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 }).format(value)
    : value;
  const escapeHtml = value => String(value || "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]);

  menuButton?.addEventListener("click", () => {
    const open = root.classList.toggle("menu-open");
    menuButton.setAttribute("aria-expanded", String(open));
  });

  nav?.addEventListener("click", event => {
    if (event.target.closest("a")) {
      root.classList.remove("menu-open");
      menuButton?.setAttribute("aria-expanded", "false");
    }
  });

  const applyWhatsappLinks = () => {
    document.querySelectorAll("[data-whatsapp]").forEach(link => {
      const message = link.dataset.whatsapp || DEFAULT_WHATSAPP_MESSAGE;
      link.href = whatsappUrl(message);
      link.target = "_self";
    });
  };

  const renderPlans = () => {
    const grid = document.querySelector("[data-plans-grid]");
    if (!grid || !siteData.plans?.length) return;
    grid.innerHTML = siteData.plans.map((plan, index) => `
      <article class="tier ${plan.featured ? "featured" : ""}" data-reveal>
        <div class="membership-card">
          <div>
            <span class="eyebrow">${plan.featured ? "Mais escolhido" : `Sociedade 0${index + 1}`}</span>
            <strong>${escapeHtml(plan.name)}</strong>
          </div>
        </div>
        <div class="tier-price">${escapeHtml(plan.price)}</div>
        <ul>${plan.items.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        <a class="btn ${plan.featured ? "btn-solid" : ""}" href="${whatsappUrl(`Olá! Quero entrar no plano ${plan.name} da The Black Naipe.`)}">Entrar no clube</a>
      </article>`).join("");
  };

  const renderProducts = () => {
    const carousel = document.querySelector("[data-products-grid]");
    if (!carousel || !siteData.products?.length) return;
    carousel.innerHTML = siteData.products.map(product => `
      <article class="product-card" data-name="${escapeHtml(product.name)}" data-price="${escapeHtml(product.price)}" data-description="${escapeHtml(product.benefit)}" data-sprite="${escapeHtml(product.sprite)}" data-reveal>
        <div class="product-visual"><div class="product-sprite ${escapeHtml(product.sprite)}" role="img" aria-label="${escapeHtml(product.name)}"></div></div>
        <div class="product-card-copy">
          <h3>${escapeHtml(product.name)}</h3>
          <p>${escapeHtml(product.price)}</p>
          <button type="button">Ver produto</button>
        </div>
      </article>`).join("");
  };

  const renderGallery = () => {
    const gallery = document.querySelector("[data-album-gallery]");
    if (!gallery || !siteData.gallery?.length) return;
    gallery.innerHTML = siteData.gallery.map((item, index) => `
      <figure class="gallery-frame album-frame" data-reveal>
        <img decoding="async" loading="lazy" src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}">
        <figcaption><small>${String(index + 1).padStart(2, "0")}</small><span>${escapeHtml(item.title)}</span></figcaption>
      </figure>`).join("");
  };

  const renderStyleProfile = () => {
    const target = document.querySelector("[data-style-profile]");
    if (!target || !siteData.styleProfile) return;
    const profile = siteData.styleProfile;
    target.innerHTML = `
      <div class="style-profile-card" data-reveal>
        <div>
          <span class="eyebrow">Meu Estilo</span>
          <h2 class="section-title">Sua cadeira<br><span class="gold">lembra você.</span></h2>
          <p class="lead">Um perfil simples para repetir o que funciona e evoluir o visual sem explicar tudo de novo.</p>
        </div>
        <div class="style-profile-grid">
          <div><span>Último corte</span><strong>${escapeHtml(profile.lastCut)}</strong></div>
          <div><span>Corte favorito</span><strong>${escapeHtml(profile.favoriteCut)}</strong></div>
          <div><span>Barbeiro</span><strong>${escapeHtml(profile.favoriteBarber)}</strong></div>
          <div><span>Frequência</span><strong>${escapeHtml(profile.frequency)}</strong></div>
        </div>
        <div class="style-profile-note"><span>Notas do barbeiro</span><p>${escapeHtml(profile.notes)}</p><strong>${escapeHtml(profile.nextSuggestion)}</strong></div>
        <a class="btn btn-solid" href="${whatsappUrl("Olá, quero agendar mantendo meu estilo Black Naipe.")}">Agendar meu estilo</a>
      </div>`;
  };

  const renderBottomNav = () => {
    if (document.querySelector(".mobile-bottom-nav")) return;
    const path = location.pathname.split("/").pop() || "index.html";
    const active = file => path === file ? "active" : "";
    document.body.insertAdjacentHTML("beforeend", `
      <nav class="mobile-bottom-nav" aria-label="Ações rápidas">
        <a class="${active("index.html")}" href="index.html"><span>Início</span></a>
        <a class="${active("servicos.html")}" href="servicos.html"><span>Cortes</span></a>
        <a class="${active("contato.html")}" href="contato.html"><span>Agenda</span></a>
        <a class="${active("planos.html")}" href="planos.html"><span>Planos</span></a>
        <a class="whatsapp" href="${whatsappUrl(DEFAULT_WHATSAPP_MESSAGE)}"><span>WhatsApp</span></a>
      </nav>`);
  };

  renderPlans();
  renderProducts();
  renderGallery();
  renderStyleProfile();
  renderBottomNav();
  applyWhatsappLinks();

  const revealItems = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("visible"));
  }

  const filterButtons = document.querySelectorAll("[data-filter]");
  const productCards = document.querySelectorAll(".product-card[data-category]");
  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      filterButtons.forEach(item => item.classList.remove("active"));
      button.classList.add("active");
      const filter = button.dataset.filter;
      productCards.forEach(card => {
        card.hidden = filter !== "todos" && card.dataset.category !== filter;
      });
    });
  });

  const modal = document.querySelector(".modal");
  const modalName = modal?.querySelector("[data-modal-name]");
  const modalPrice = modal?.querySelector("[data-modal-price]");
  const modalDescription = modal?.querySelector("[data-modal-description]");
  const modalWhatsApp = modal?.querySelector("[data-modal-whatsapp]");
  const modalSprite = modal?.querySelector("[data-modal-sprite]");

  const closeModal = () => modal?.classList.remove("open");
  document.querySelectorAll(".product-card").forEach(card => {
    card.addEventListener("click", () => {
      if (!modal) return;
      const name = card.dataset.name || "Produto The Black Naipe";
      modalName.textContent = name;
      modalPrice.textContent = card.dataset.price || "";
      modalDescription.textContent = card.dataset.description || "";
      if (modalSprite && card.dataset.sprite) {
        modalSprite.className = `product-sprite-modal ${card.dataset.sprite}`;
      }
      modalWhatsApp.dataset.whatsapp = `Olá! Quero comprar o produto ${name}.`;
      modalWhatsApp.href = whatsappUrl(modalWhatsApp.dataset.whatsapp);
      modal.classList.add("open");
    });
  });
  modal?.querySelector(".modal-close")?.addEventListener("click", closeModal);
  modal?.addEventListener("click", event => {
    if (event.target === modal) closeModal();
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeModal();
  });

  document.querySelector(".booking-form")?.addEventListener("submit", event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = form.get("nome") || "cliente";
    const service = form.get("servico") || "um atendimento";
    const date = form.get("data") || "a combinar";
    const message = `${DEFAULT_WHATSAPP_MESSAGE}\n\nNome: ${name}\nServiço: ${service}\nData desejada: ${date}`;
    const feedback = event.currentTarget.querySelector(".form-feedback");
    if (feedback) feedback.textContent = "Perfeito. Abrindo o WhatsApp para confirmar seu horário.";
    window.location.assign(whatsappUrl(message));
  });

  document.querySelectorAll("[data-year]").forEach(item => {
    item.textContent = new Date().getFullYear();
  });

  const lowestService = siteData.services?.reduce((min, service) => service.price < min.price ? service : min, siteData.services[0]);
  const featuredPlan = siteData.plans?.find(plan => plan.featured) || siteData.plans?.[0];
  const barber = siteData.barbers?.[0];

  const chatMarkup = `
    <button class="crown-chat-launcher" type="button" aria-label="Abrir concierge Black Naipe" aria-expanded="false">
      <img src="assets/images/logo.jpg" alt="">
      <span aria-hidden="true"></span>
    </button>
    <section class="crown-chat" aria-label="Concierge Black Naipe" aria-hidden="true">
      <header class="crown-chat-head">
        <img class="crown-chat-logo" src="assets/images/logo.jpg" alt="The Black Naipe">
        <div><strong>Concierge Black Naipe</strong><small>Atendimento da casa</small></div>
        <button class="crown-chat-close" type="button" aria-label="Fechar conversa">X</button>
      </header>
      <div class="crown-chat-messages" aria-live="polite">
        <p class="crown-message">Bem-vindo à Cultura na Régua. Como posso ajudar você hoje?</p>
        <div class="crown-chat-actions">
          <button type="button" data-chat-question="preços">Ver preços</button>
          <button type="button" data-chat-question="planos">Conhecer planos</button>
          <button type="button" data-chat-question="agendar">Agendar horário</button>
          <button type="button" data-chat-question="localização">Localização</button>
        </div>
      </div>
      <form class="crown-chat-form">
        <input type="text" name="pergunta" placeholder="Digite sua dúvida" autocomplete="off" aria-label="Digite sua dúvida">
        <button class="crown-chat-send" type="submit" aria-label="Enviar">OK</button>
      </form>
    </section>`;

  document.body.insertAdjacentHTML("beforeend", chatMarkup);
  const chatLauncher = document.querySelector(".crown-chat-launcher");
  const chatPanel = document.querySelector(".crown-chat");
  const chatMessages = document.querySelector(".crown-chat-messages");
  const chatForm = document.querySelector(".crown-chat-form");
  let dragStart = null;
  let dragged = false;

  const setChatOpen = open => {
    chatPanel.classList.toggle("open", open);
    chatPanel.setAttribute("aria-hidden", String(!open));
    chatLauncher.setAttribute("aria-expanded", String(open));
    if (open) chatForm.querySelector("input").focus();
  };

  const addChatMessage = (text, sender = "assistant") => {
    const message = document.createElement("p");
    message.className = `crown-message${sender === "user" ? " user" : ""}`;
    message.textContent = text;
    chatMessages.appendChild(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  };

  const replyTo = question => {
    const normalized = question.toLocaleLowerCase("pt-BR");
    if (normalized.includes("preço") || normalized.includes("valor") || normalized.includes("corte")) {
      const serviceList = (siteData.services || []).slice(0, 4).map(service => `${service.name}: ${currency(service.price)}`).join("; ");
      return serviceList ? `Os principais valores são: ${serviceList}. O ${lowestService?.name || "atendimento"} começa em ${currency(lowestService?.price || 0)}. Posso te levar para reservar agora.` : "Quero garantir a informação correta para você. Fale com nossa equipe no WhatsApp.";
    }
    if (normalized.includes("plano") || normalized.includes("clube") || normalized.includes("sociedade")) {
      const planList = (siteData.plans || []).map(plan => `${plan.name} ${plan.price}`).join("; ");
      return planList ? `Os planos do clube são: ${planList}. O mais escolhido hoje é o ${featuredPlan?.name}.` : "Temos planos mensais. Fale com a equipe para escolher o melhor.";
    }
    if (normalized.includes("horário") || normalized.includes("funciona")) {
      return `Atendemos ${brand.hours || "de terça a sábado, das 9h às 20h"}.`;
    }
    if (normalized.includes("local") || normalized.includes("onde") || normalized.includes("endereço")) {
      return `Estamos em ${brand.address || "São Paulo, SP"}. Para receber o endereço certinho e confirmar a cadeira, fale pelo WhatsApp.`;
    }
    if (normalized.includes("instagram") || normalized.includes("rede social")) {
      return `Acompanhe ${barber?.name || "Wellington Baroni"} no Instagram: ${brand.instagram || "@ton.baroni"}.`;
    }
    if (normalized.includes("telefone") || normalized.includes("whatsapp") || normalized.includes("contato")) {
      return `Nosso WhatsApp oficial é ${brand.phoneDisplay || "11 94839-9275"}.`;
    }
    if (normalized.includes("agendar") || normalized.includes("reserva")) {
      return "Perfeito. Em um toque você fala com a equipe e confirma sua cadeira pelo WhatsApp.";
    }
    if (normalized.includes("barba")) {
      const barba = siteData.services?.find(service => service.name.toLowerCase().includes("barba"));
      return barba ? `Fazemos ${barba.name}. O valor é ${currency(barba.price)} e a duração média é ${barba.duration}.` : "Fazemos barba e combos com corte. Posso te encaminhar para o WhatsApp.";
    }
    return "Quero garantir a informação correta para você. Fale com nossa equipe no WhatsApp, Instagram ou ligação para atendimento humano.";
  };

  chatLauncher.addEventListener("pointerdown", event => {
    dragStart = { x: event.clientX, y: event.clientY, left: chatLauncher.offsetLeft, top: chatLauncher.offsetTop };
    dragged = false;
    chatLauncher.setPointerCapture(event.pointerId);
  });
  chatLauncher.addEventListener("pointermove", event => {
    if (!dragStart) return;
    const dx = event.clientX - dragStart.x;
    const dy = event.clientY - dragStart.y;
    if (Math.abs(dx) + Math.abs(dy) < 8) return;
    dragged = true;
    const left = Math.max(8, Math.min(window.innerWidth - chatLauncher.offsetWidth - 8, dragStart.left + dx));
    const top = Math.max(8, Math.min(window.innerHeight - chatLauncher.offsetHeight - 8, dragStart.top + dy));
    chatLauncher.style.left = `${left}px`;
    chatLauncher.style.top = `${top}px`;
    chatLauncher.style.right = "auto";
    chatLauncher.style.bottom = "auto";
  });
  chatLauncher.addEventListener("pointerup", () => {
    dragStart = null;
    if (!dragged) setChatOpen(!chatPanel.classList.contains("open"));
  });
  document.querySelector(".crown-chat-close").addEventListener("click", () => setChatOpen(false));
  document.querySelectorAll("[data-chat-question]").forEach(button => {
    button.addEventListener("click", () => {
      const question = button.dataset.chatQuestion;
      addChatMessage(question, "user");
      window.setTimeout(() => addChatMessage(replyTo(question)), 180);
    });
  });
  chatForm.addEventListener("submit", event => {
    event.preventDefault();
    const input = chatForm.querySelector("input");
    const question = input.value.trim();
    if (!question) return;
    addChatMessage(question, "user");
    input.value = "";
    window.setTimeout(() => addChatMessage(replyTo(question)), 180);
  });
})();
