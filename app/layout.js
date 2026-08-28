import "./globals.css";

export const metadata = {
  title: "Tipzeus",
  description: "Daily Premier League tips and match previews",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
