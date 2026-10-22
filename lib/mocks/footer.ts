// Fallback granular usado por lib/uappi/footer.ts quando um endpoint
// específico da Uappi falha (cada slot — newsletter, colunas, redesSociais,
// bottom — pode cair pra esses defaults sem derrubar o footer inteiro).

import type { FooterData } from "@/types/wordpress";

export const MOCK_FOOTER: FooterData = {
  newsletter: {
    titulo: "Newsletter",
    textoPrincipal: "Cadastre-se e ganhe 5% de desconto na primeira compra*",
    textoSecundario:
      "*Cupom não acumulativo com outros descontos e promoções (válido para compras acima de R$ 5.000)",
    placeholderEmail: "E-mail",
    ctaLabel: "Inscrever-se",
    textoPrivacidade: "Ao inscrever-se, você concorda com a nossa política de privacidade.",
    urlPoliticaPrivacidade: "/politica-de-privacidade",
  },
  colunas: [
    {
      titulo: "Sobre Mobility",
      links: [
        { label: "Quem somos", url: "/sobre-1", abrirEmNovaAba: false },
        { label: "Nossa história", url: "/historia", abrirEmNovaAba: false },
        { label: "Trabalhe conosco", url: "/carreiras", abrirEmNovaAba: false },
      ],
    },
    {
      titulo: "Área do Cliente",
      links: [
        { label: "Meus pedidos", url: "https://mobilitybrasil.com.br/conta", abrirEmNovaAba: true },
        { label: "Trocas e devoluções", url: "/trocas", abrirEmNovaAba: false },
        { label: "Acompanhar pedido", url: "/rastreio", abrirEmNovaAba: false },
      ],
    },
    {
      titulo: "Contato",
      links: [
        { label: "Fale conosco", url: "/contato", abrirEmNovaAba: false },
        { label: "Atendimento", url: "/atendimento", abrirEmNovaAba: false },
        { label: "WhatsApp", url: "https://wa.me/5500000000000", abrirEmNovaAba: true },
      ],
    },
    {
      titulo: "Políticas",
      links: [
        { label: "Política de privacidade", url: "/politica-de-privacidade", abrirEmNovaAba: false },
        { label: "Termos de uso", url: "/termos-de-uso", abrirEmNovaAba: false },
        { label: "Política de trocas", url: "/politica-trocas", abrirEmNovaAba: false },
      ],
    },
  ],
  redesSociais: [
    {
      rede: "instagram",
      label: "Instagram",
      url: "https://www.instagram.com/mobilitybrasil/",
      icone: "https://www.mobilitybrasil.com.br/upload/menu/icons-footer/c28ca5ddd64641a3324feca8c1a3226d.webp",
      abrirEmNovaAba: true,
    },
    {
      rede: "facebook",
      label: "Facebook",
      url: "https://www.facebook.com/mobility.cadeirasderodas",
      icone: "https://www.mobilitybrasil.com.br/upload/menu/icons-footer/b7640f033081ed13a30916a90e3bc93b.webp",
      abrirEmNovaAba: true,
    },
    {
      rede: "youtube",
      label: "YouTube",
      url: "https://youtube.com.br/channel/UC9P58Kq_PWEoZSRAkBN3ZqQ",
      icone: "https://www.mobilitybrasil.com.br/upload/menu/icons-footer/79520d416e50023b423eaa5ea4e825d3.webp",
      abrirEmNovaAba: true,
    },
    {
      rede: "tiktok",
      label: "TikTok",
      url: "https://www.tiktok.com/@mobilitybrasil",
      icone: "https://www.mobilitybrasil.com.br/upload/menu/icons-footer/8a6b3b8a0e3f9b4c840f88912f50839e.webp",
      abrirEmNovaAba: true,
    },
    {
      rede: "linkedin",
      label: "LinkedIn",
      url: "https://www.linkedin.com/company/mobility-brasil/",
      icone: "https://www.mobilitybrasil.com.br/upload/menu/icons-footer/6381b431db379c53c7920d6dea25bf83.webp",
      abrirEmNovaAba: true,
    },
    {
      rede: "whatsapp",
      label: "WhatsApp",
      url: "https://api.whatsapp.com/send/?phone=5511999096060",
      icone: "https://www.mobilitybrasil.com.br/upload/menu/icons-footer/dee1517613e9c5417aad021db4c4d71b.webp",
      abrirEmNovaAba: true,
    },
  ],
  bottom: {
    copyright:
      "© " +
      new Date().getFullYear() +
      ", Mobility Brasil Importação e Comércio de Cadeiras de Rodas Ltda. Todos os direitos reservados.",
    linksLegais: [
      { label: "Endereço", url: "https://maps.app.goo.gl/S2HuFb5WWZtXhkP79" },
      {
        label: "Atendimento",
        url: "https://api.whatsapp.com/send/?phone=5511999096060&text=Ol%C3%A1%21+Estava+no+site+e+gostaria+de+mais+informa%C3%A7%C3%B5es.&type=phone_number&app_absent=0",
      },
      {
        label: "CNPJ: 13.827.655/0001-80",
        url: "https://www.mobilitybrasil.com.br/pagina/sobre-nos",
      },
      {
        label: "Copyright",
        url: "https://www.mobilitybrasil.com.br/pagina/politica-de-privacidade",
      },
    ],
    textoTecnologia: "Tecnologia de e-commerce",
    urlTecnologia: "https://uappi.com.br",
    textoDesenvolvido: "Desenvolvido por",
    urlDesenvolvedor: "https://tec4udigital.com",
    logoUrl:
      "https://www.mobilitybrasil.com.br/upload/menu/copyright-footer/ba6a9e038fd138c108493da51b6b3358.webp",
    logoAlt: "Mobility Brasil",
  },
};
