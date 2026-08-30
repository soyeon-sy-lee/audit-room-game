import type { Metadata } from "next";
import "./globals.css";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const title = "Audit Room — 공시로 배우는 감사 게임";
const description = "DART 공개 공시를 바탕으로 감사 판단을 훈련하는 TMT 감사 시뮬레이션";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  icons: { icon: `${basePath}/favicon.svg` },
  openGraph: {
    title,
    description,
    type: "website",
    url: siteUrl,
    images: [{ url: `${siteUrl}/og.png`, width: 1732, height: 909, alt: "Audit Room" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [`${siteUrl}/og.png`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
