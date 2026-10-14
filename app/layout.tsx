import type { Metadata } from "next";
import localFont from "next/font/local";
import { Lato } from "next/font/google";
import { AccessibilityToolbar } from "@/components/accessibility/AccessibilityToolbar";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SITE_URL } from "@/lib/wordpress";
import "./globals.css";

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

const helveticaNeue = localFont({
  variable: "--font-helvetica",
  display: "swap",
  src: [
    {
      path: "../public/fonts/HelveticaNeueLTLight.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/HelveticaNeueLTRegular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/HelveticaNeueLTBold.otf",
      weight: "700",
      style: "normal",
    },
  ],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Mobilidade, acessibilidade e tecnologia assistiva",
    template: "%s · Mobility Brasil",
  },
  description:
    "Conteúdo sobre cadeiras de rodas, acessibilidade e tecnologia assistiva para apoiar escolhas de mobilidade no dia a dia.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Blog Mobility Brasil",
    title: "Mobilidade, acessibilidade e tecnologia assistiva · Mobility Brasil",
    description:
      "Conteúdo sobre cadeiras de rodas, acessibilidade e tecnologia assistiva para apoiar escolhas de mobilidade no dia a dia.",
    url: SITE_URL,
  },
  twitter: { card: "summary" },
  verification: {
    google: "AU9xWjED2iLEMEHRugX1nvQkv6IafdKiZkvjoZ2icoo",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${lato.variable} ${helveticaNeue.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-neutral-50 text-neutral-900">
        <Header />
        <AccessibilityToolbar />

        <main className="flex-1">{children}</main>

        <Footer />
      </body>
    </html>
  );
}
