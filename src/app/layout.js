import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { RoleProvider } from "@/components/role-provider";
import { Toaster } from "@/components/ui/toaster";
import SessionProvider from "@/components/providers/SessionProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "CQAMS - Employee Management System",
  description: "A comprehensive management system for administrators and employees",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <RoleProvider>
              {children}
              <Toaster />
            </RoleProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
