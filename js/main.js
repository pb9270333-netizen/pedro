(() => {
  const WHATSAPP_NUMBER = "5511948399275";
  const DEFAULT_WHATSAPP_MESSAGE = "Olá, vim pelo site e quero agendar um horário.";
  const whatsappUrl = message => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  const root = document.documentElement;
  const menuButton = document.querySelector(".menu-btn");
  const nav = document.querySelector(".nav");

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

  document.querySelectorAll("[data-whatsapp]").forEach(link => {
    const message = link.dataset.whatsapp || DEFAULT_WHATSAPP_MESSAGE;
    link.href = whatsappUrl(message);
    link.target = "_self";
  });

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
      modalWhatsApp.dataset.whatsapp = `Ola! Quero comprar o produto ${name}.`;
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
    if (feedback) feedback.textContent = "Perfeito. Abrindo o WhatsApp para confirmar seu horario.";
    window.location.assign(whatsappUrl(message));
  });

  document.querySelectorAll("[data-year]").forEach(item => {
    item.textContent = new Date().getFullYear();
  });

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
      return "O corte custa R$ 50. Corte e barba sai por R$ 80, e o combo completo por R$ 90. Posso levar você ao menu de serviços.";
    }
    if (normalized.includes("plano") || normalized.includes("sociedade")) {
      return "Temos os planos Bronze, Ouro e Preto, com benefícios de R$ 79 a R$ 249 por mês.";
    }
    if (normalized.includes("horário") || normalized.includes("funciona")) {
      return "Atendemos de terça a sábado, das 9h às 20h.";
    }
    if (normalized.includes("local") || normalized.includes("onde") || normalized.includes("endereço")) {
      return "Estamos em São Paulo. Para garantir o endereço correto, fale com nossa equipe pelo WhatsApp.";
    }
    if (normalized.includes("instagram") || normalized.includes("rede social")) {
      return "Acompanhe o trabalho de Wellington Baroni no Instagram: @ton.baroni.";
    }
    if (normalized.includes("telefone") || normalized.includes("whatsapp") || normalized.includes("contato")) {
      return "Nosso telefone e WhatsApp oficial é 11 94839-9275.";
    }
    if (normalized.includes("agendar") || normalized.includes("reserva")) {
      return "Perfeito. Vá para a página Agendar ou fale com nossa equipe pelo WhatsApp para reservar sua cadeira.";
    }
    if (normalized.includes("barba")) {
      return "Fazemos barba, corte e barba, pigmentação e combo completo. A barba individual custa R$ 45.";
    }
    return "Quero garantir a informação correta para você. Fale com nossa equipe no WhatsApp 11 94839-9275.";
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
