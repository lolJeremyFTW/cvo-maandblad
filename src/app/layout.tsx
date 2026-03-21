import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CLUBvanONS | Magazine Generator",
  description: "De meest hip-hop weekblad/maandblad generator van Breda. Snel, rauw, en ready to print.",
  keywords: ["CLUBvanONS", "Breda", "Urban Living Lab", "Magazine Generator", "Hip-Hop Newspaper"],
  authors: [{ name: "Urban Living Lab Breda" }],
  openGraph: {
    title: "CLUBvanONS | Magazine Generator",
    description: "Genereer je eigen hip-hop krant vibe in een paar klikken.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <head>
        {/* Google Tag Manager Placeholder */}
        {/* <script dangerouslySetInnerHTML={{ __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-XXXXXXX');` }} /> */}
        
        {/* Meta Pixel Placeholder */}
        {/* <script dangerouslySetInnerHTML={{ __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', 'XXXXXXXXXXXXXXX');fbq('track', 'PageView');` }} /> */}
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
