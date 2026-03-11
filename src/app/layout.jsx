import "./globals.css";
import "yet-another-react-lightbox/styles.css";

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuatrobistro.com"),
  title: {
    default: "Cuatro Bistro",
    template: "%s | Cuatro Bistro",
  },
  description: "Restaurante en Chía con cocina contemporánea y experiencias gastronómicas.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta
          name="google-site-verification"
          content="KO0zZlGWwESWGVjU-Jtwdmv2u8CFarHlLiNR1s5ro-c"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Forum&family=Montserrat:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
