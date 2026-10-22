import Image from "next/image";
import Link from "next/link";
import { getFooter } from "@/lib/uappi/footer";
import type { FooterSocialNetwork } from "@/types/wordpress";
import { FooterAccordion } from "./FooterAccordion";
import { FooterNewsletterForm } from "./FooterNewsletterForm";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  TiktokIcon,
  WhatsappIcon,
  YoutubeIcon,
} from "./icons";

const SOCIAL_ICON_BY_NETWORK: Record<
  FooterSocialNetwork,
  {
    Icon: (props: React.SVGProps<SVGSVGElement>) => React.JSX.Element;
    label: string;
  }
> = {
  instagram: { Icon: InstagramIcon, label: "Instagram" },
  facebook: { Icon: FacebookIcon, label: "Facebook" },
  tiktok: { Icon: TiktokIcon, label: "TikTok" },
  youtube: { Icon: YoutubeIcon, label: "YouTube" },
  linkedin: { Icon: LinkedinIcon, label: "LinkedIn" },
  whatsapp: { Icon: WhatsappIcon, label: "WhatsApp" },
};

/**
 * Footer global do blog. O conteúdo comercial/legal vem dos menus da Uappi;
 * a renderização replica a faixa inferior do rodapé da loja.
 */
export async function Footer() {
  const data = await getFooter();
  const newsletter = data.newsletter;
  const bottom = data.bottom;

  return (
    <footer className="bg-[color:var(--color-brand-footer)] text-[color:var(--color-brand-text)]">
      <div className="border-t border-[color:var(--color-brand-divider)]" />

      <div className="flex flex-col border-b border-[color:var(--color-brand-divider)] lg:flex-row lg:items-stretch">
        <div className="flex flex-col gap-4 px-[18px] pr-8 py-8 lg:w-[578px] lg:shrink-0 lg:border-r lg:border-[color:var(--color-brand-divider)] lg:p-8">
          {newsletter?.titulo && (
            <p className="font-display text-[16px] font-medium tracking-[0.2em] uppercase">
              {newsletter.titulo}
            </p>
          )}
          <div className="border-t border-[color:var(--color-brand-divider)]" />

          {(newsletter?.textoPrincipal || newsletter?.textoSecundario) && (
            <div className="flex flex-col gap-1 text-[12px] leading-[1.4] tracking-[0.05em] text-[color:var(--color-brand-gray)]">
              {newsletter.textoPrincipal && (
                <p className="opacity-70">{newsletter.textoPrincipal}</p>
              )}
              {newsletter.textoSecundario && (
                <p className="opacity-70">{newsletter.textoSecundario}</p>
              )}
            </div>
          )}

          <FooterNewsletterForm
            placeholder={newsletter?.placeholderEmail ?? "E-mail"}
            ctaLabel={newsletter?.ctaLabel ?? "Inscrever-se"}
          />

          {newsletter?.textoPrivacidade && (
            <p className="text-[12px] leading-[1.4] tracking-[0.05em] text-[color:var(--color-brand-gray)] opacity-70">
              {newsletter.urlPoliticaPrivacidade ? (
                <>
                  Ao inscrever-se, você concorda com a nossa{" "}
                  <Link href={newsletter.urlPoliticaPrivacidade} className="underline">
                    política de privacidade.
                  </Link>
                </>
              ) : (
                newsletter.textoPrivacidade
              )}
            </p>
          )}
        </div>

        {data.colunas.length > 0 && (
          <div className="border-t border-[color:var(--color-brand-divider)] px-3 pr-6 py-3 lg:flex-1 lg:border-t-0 lg:py-3 lg:pl-6 lg:pr-[46px]">
            <FooterAccordion columns={data.colunas} />
          </div>
        )}
      </div>

      <div className="flex flex-col items-center gap-[18px] px-[18px] pb-5 pt-8 lg:gap-3">
        {data.redesSociais.length > 0 && (
          <ul className="flex items-center gap-3 lg:mb-[6px]">
            {data.redesSociais.map((social) => {
              const config = SOCIAL_ICON_BY_NETWORK[social.rede];
              if (!config) return null;
              const Icon = config.Icon;
              return (
                <li key={social.rede}>
                  <a
                    href={social.url}
                    target={social.abrirEmNovaAba ? "_blank" : undefined}
                    rel={social.abrirEmNovaAba ? "noreferrer" : undefined}
                    aria-label={social.label ?? config.label}
                    className="flex size-[30px] items-center justify-center rounded-full bg-white text-black"
                  >
                    {social.icone ? (
                      <Image
                        src={social.icone}
                        alt=""
                        width={20}
                        height={20}
                        className="size-5 object-contain"
                      />
                    ) : (
                      <Icon className="size-4" />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        )}

        <Link href="/" aria-label="Mobility Brasil — Home" className="block">
          <Image
            src={bottom?.logoUrl ?? "/logo-mobility-white.svg"}
            alt={bottom?.logoAlt ?? "Mobility Brasil"}
            width={124}
            height={26}
            className={bottom?.logoUrl ? "h-[26px] w-auto object-contain" : "invert"}
          />
        </Link>

        {bottom && bottom.linksLegais.length > 0 && (
          <ul className="flex items-center divide-x divide-[color:var(--color-brand-gray)]">
            {bottom.linksLegais.map((link, index) => (
              <li key={link.label + "-" + index} className="px-3 first:pl-0 last:pr-0">
                <Link
                  href={link.url}
                  className="text-[12px] text-[color:var(--color-brand-text)] underline opacity-70 hover:opacity-100"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        )}

        {bottom?.copyright && (
          <p className="text-center text-[12px] text-[color:var(--color-brand-text)] opacity-70">
            {bottom.copyright}
          </p>
        )}

        <div className="flex flex-col items-center gap-1 text-[12px] text-[color:var(--color-brand-text)]">
          {bottom?.textoTecnologia && (
            <div className="flex items-center gap-2">
              <span className="opacity-70">{bottom.textoTecnologia}</span>
              {bottom.urlTecnologia ? (
                <a href={bottom.urlTecnologia} target="_blank" rel="noreferrer" className="text-[10px] underline">
                  Uappi
                </a>
              ) : (
                <span className="text-[10px] underline">Uappi</span>
              )}
            </div>
          )}
          {bottom?.textoDesenvolvido && (
            <div className="flex items-center gap-1">
              <span>{bottom.textoDesenvolvido}</span>
              {bottom.urlDesenvolvedor ? (
                <a href={bottom.urlDesenvolvedor} target="_blank" rel="noreferrer" className="font-display font-bold tracking-wide">
                  TEC4U
                </a>
              ) : (
                <span className="font-display font-bold tracking-wide">TEC4U</span>
              )}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
