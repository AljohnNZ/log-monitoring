import './globals.css';
import { ThemeProvider } from "@/components/theme-provider"

export const metadata = {
  title: 'Log Monitoring',
  description: 'web Log Monitoring',
};
 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </>
  )
}