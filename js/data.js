window.BlackNaipeData = {
  brand: {
    name: "The Black Naipe",
    whatsappNumber: "5511948399275",
    phoneDisplay: "11 94839-9275",
    whatsappMessage: "Olá, vim pelo site e quero agendar um horário.",
    instagram: "@ton.baroni",
    instagramUrl: "https://www.instagram.com/ton.baroni/",
    address: "São Paulo, SP",
    hours: "terça a sábado, das 9h às 20h"
  },
  hero: {
    eyebrow: "Barbearia premium urbana",
    title: "Corte não é detalhe. É identidade.",
    subtitle: "Barbearia masculina com estética urbana, atendimento premium e agenda rápida no celular.",
    primaryCta: "Agendar agora",
    secondaryCta: "Ver cortes"
  },
  images: {
    design: "assets/images/corte-02.jpg",
    power: "assets/images/corte-01.jpg",
    beard: "assets/images/corte-03.jpg",
    signature: "assets/images/corte-04.jpg",
    ritual: "assets/images/barbeiro.jpg",
    hero: "assets/images/corte-hero.jpg",
    mural: "assets/images/mural.jpg",
    products: "assets/images/produtos-premium.png"
  },
  barbers: [
    {
      name: "Wellington Baroni",
      specialty: "Especialista em crespos, cacheados, degradê e direção de imagem.",
      since: "Desde 2017 deixando o povo ainda mais lindo."
    }
  ],
  services: [
    {
      id: 1,
      slug: "degrade-navalhado",
      name: "Degradê Navalhado",
      shortDescription: "Transição limpa, pele baixa e presença forte.",
      fullDescription: "Degradê construído para encaixar no formato do rosto, com acabamento navalhado, textura preservada e finalização de impacto.",
      price: 70,
      duration: "55 min",
      mainImage: "assets/images/corte-02.jpg",
      galleryImages: ["assets/images/corte-02.jpg", "assets/images/corte-04.jpg", "assets/images/corte-hero.jpg"],
      benefits: ["Pele limpa", "Acabamento navalhado", "Leitura do rosto", "Finalização premium"],
      category: "Faixa 01",
      badge: "Mais pedido",
      availableTimes: ["09:00", "10:00", "11:30", "14:00", "16:00", "18:30"]
    },
    {
      id: 2,
      slug: "corte-social-premium",
      name: "Corte Social Premium",
      shortDescription: "Clássico, alinhado e com assinatura.",
      fullDescription: "Corte social com acabamento moderno para trabalho, evento ou rotina. Limpo sem perder personalidade.",
      price: 65,
      duration: "50 min",
      mainImage: "assets/images/corte-03.jpg",
      galleryImages: ["assets/images/corte-03.jpg", "assets/images/barbeiro.jpg", "assets/images/corte-02.jpg"],
      benefits: ["Visual limpo", "Caimento preciso", "Perfil alinhado", "Acabamento discreto"],
      category: "Faixa 02",
      badge: "Executivo",
      availableTimes: ["09:00", "10:30", "13:00", "15:00", "17:00", "18:30"]
    },
    {
      id: 3,
      slug: "corte-barba",
      name: "Corte + Barba",
      shortDescription: "Imagem completa em um ritual só.",
      fullDescription: "Cabelo, barba e perfil alinhados como uma assinatura única. Ideal para renovar presença sem perder identidade.",
      price: 95,
      duration: "1h20",
      mainImage: "assets/images/corte-04.jpg",
      galleryImages: ["assets/images/corte-04.jpg", "assets/images/corte-03.jpg", "assets/images/barbeiro.jpg"],
      benefits: ["Cabelo e barba", "Perfil marcado", "Ritual completo", "Foto final opcional"],
      category: "Faixa 03",
      badge: "Completo",
      availableTimes: ["09:00", "10:30", "13:30", "15:30", "17:30"]
    },
    {
      id: 4,
      slug: "barba-marcada",
      name: "Barba Marcada",
      shortDescription: "Contorno firme, pele cuidada e presença.",
      fullDescription: "Desenho de barba com atenção ao rosto, densidade dos fios e acabamento natural ou marcado.",
      price: 45,
      duration: "30 min",
      mainImage: "assets/images/corte-03.jpg",
      galleryImages: ["assets/images/corte-03.jpg", "assets/images/corte-04.jpg", "assets/images/barbeiro.jpg"],
      benefits: ["Contorno preciso", "Toalha quente", "Pele cuidada", "Acabamento limpo"],
      category: "Faixa 04",
      badge: "Barba",
      availableTimes: ["09:00", "09:45", "11:00", "14:30", "16:30", "19:00"]
    },
    {
      id: 5,
      slug: "black-power-alinhado",
      name: "Black Power Alinhado",
      shortDescription: "Volume respeitado, forma definida.",
      fullDescription: "Modelagem com tesoura para organizar volume, respeitar textura e valorizar o formato natural do cabelo.",
      price: 85,
      duration: "1h20",
      mainImage: "assets/images/corte-01.jpg",
      galleryImages: ["assets/images/corte-01.jpg", "assets/images/corte-hero.jpg", "assets/images/corte-02.jpg"],
      benefits: ["Volume equilibrado", "Textura respeitada", "Formato personalizado", "Finalização dos cachos"],
      category: "Faixa 05",
      badge: "Textura",
      availableTimes: ["09:00", "10:30", "13:30", "15:00", "17:00", "18:30"]
    },
    {
      id: 6,
      slug: "nudred",
      name: "Nudred",
      shortDescription: "Textura definida com estética urbana.",
      fullDescription: "Definição de textura com acabamento limpo, ideal para quem quer movimento, volume e personalidade.",
      price: 80,
      duration: "1h10",
      mainImage: "assets/images/corte-hero.jpg",
      galleryImages: ["assets/images/corte-hero.jpg", "assets/images/corte-01.jpg", "assets/images/corte-04.jpg"],
      benefits: ["Definição", "Volume", "Acabamento leve", "Estilo urbano"],
      category: "Faixa 06",
      badge: "90's",
      availableTimes: ["09:30", "10:30", "12:00", "14:00", "16:00", "18:00"]
    },
    {
      id: 7,
      slug: "sobrancelha",
      name: "Sobrancelha",
      shortDescription: "Limpeza natural sem pesar o rosto.",
      fullDescription: "Retirada do excesso e alinhamento dos fios para manter expressão natural e acabamento discreto.",
      price: 25,
      duration: "15 min",
      mainImage: "assets/images/barbeiro.jpg",
      galleryImages: ["assets/images/barbeiro.jpg", "assets/images/corte-02.jpg", "assets/images/corte-03.jpg"],
      benefits: ["Natural", "Rápido", "Perfil limpo", "Sem exagero"],
      category: "Faixa 07",
      badge: "Detalhe",
      availableTimes: ["09:00", "10:00", "12:00", "15:00", "17:00", "19:00"]
    },
    {
      id: 8,
      slug: "corte-infantil",
      name: "Corte Infantil",
      shortDescription: "Cuidado, paciência e estilo desde cedo.",
      fullDescription: "Atendimento cuidadoso para criança, com acabamento leve, textura respeitada e experiência tranquila.",
      price: 60,
      duration: "45 min",
      mainImage: "assets/images/corte-01.jpg",
      galleryImages: ["assets/images/corte-01.jpg", "assets/images/corte-02.jpg", "assets/images/mural.jpg"],
      benefits: ["Paciência", "Acabamento leve", "Textura respeitada", "Experiência tranquila"],
      category: "Faixa 08",
      badge: "Kids",
      availableTimes: ["09:00", "10:00", "11:00", "14:00", "16:00"]
    }
  ],
  plans: [
    { name: "Favela Elegante", price: "R$89/mês", items: ["2 cortes por mês", "Prioridade na agenda", "Lembrete automático", "Desconto em produtos"] },
    { name: "Patrão da Semana", price: "R$149/mês", featured: true, items: ["4 cortes por mês", "1 barba inclusa", "Prioridade na agenda", "10% off em produtos"] },
    { name: "Relíquia 90's", price: "R$199/mês", items: ["Corte semanal", "Barba", "Sobrancelha", "Fragrância premium", "Prioridade total"] }
  ],
  products: [
    { name: "Pomada", price: "R$ 34,90", benefit: "Fixação leve e acabamento natural.", sprite: "p3" },
    { name: "Óleo de Barba", price: "R$ 29,90", benefit: "Brilho controlado e pele cuidada.", sprite: "p4" },
    { name: "Shampoo Masculino", price: "R$ 39,90", benefit: "Limpeza diária sem ressecar.", sprite: "p1" },
    { name: "Pente Garfo", price: "R$ 24,90", benefit: "Volume, forma e presença.", sprite: "p5" },
    { name: "Boné", price: "R$ 79,90", benefit: "Peça urbana para fechar o visual.", sprite: "p7" },
    { name: "Camiseta", price: "R$ 99,90", benefit: "Streetwear da casa.", sprite: "p8" },
    { name: "Perfume Pós-Corte", price: "R$ 49,90", benefit: "Fragrância discreta de saída.", sprite: "p6" }
  ],
  gallery: [
    { title: "Faixa 01 — Degradê Baixo", image: "assets/images/corte-02.jpg" },
    { title: "Faixa 02 — Black Power Alinhado", image: "assets/images/corte-01.jpg" },
    { title: "Faixa 03 — Nudred", image: "assets/images/corte-hero.jpg" },
    { title: "Faixa 04 — Corte Social Premium", image: "assets/images/corte-03.jpg" },
    { title: "Faixa 05 — Barba Marcada", image: "assets/images/corte-04.jpg" }
  ],
  styleProfile: {
    lastCut: "Degradê baixo com textura preservada",
    favoriteCut: "Black Power Alinhado",
    favoriteBarber: "Wellington Baroni",
    frequency: "A cada 14 dias",
    notes: "Prefere lateral média, acabamento natural e fragrância amadeirada.",
    nextSuggestion: "Voltar em 12 dias para manter o desenho limpo."
  }
};
