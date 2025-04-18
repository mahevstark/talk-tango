import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata = {
  title: "GranaME",
  description: "GranaME is a platform for learning and teaching languages.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <ClerkProvider publishableKey="pk_test_bGVhZGluZy1zcGFycm93LTcyLmNsZXJrLmFjY291bnRzLmRldiQ">
        <body>{children}</body>
      </ClerkProvider>
    </html>
  );
}
