import "./globals.css";

export const metadata = {
  title: "Talk Tango",
  description: "Talk Tango is a platform for learning and teaching languages.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
