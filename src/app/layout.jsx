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
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon.png?v=2" type="image/png" sizes="32x32" />
        <link rel="shortcut icon" href="/favicon.png?v=2" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png?v=2" />
        <link
          href="https://fonts.googleapis.com/css2?family=Forum&family=Montserrat:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
