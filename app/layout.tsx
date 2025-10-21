import "./globals.css";
import HeaderNav from "@/components/HeaderNav";
import { MetaMaskProvider } from "@/components/MetaMaskProvider";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/deploy", label: "Deploy" },
  { href: "/transfer", label: "Transfer" },
  { href: "/dashboard", label: "Envio Dashboard" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>MON Transfer Platform - Token Transfers on Monad Testnet</title>
        <meta name="description" content="Transfer MON and ERC-20 tokens with Smart Accounts on Monad Testnet. Gasless transactions powered by ERC-4337." />
      </head>
      <body style={{ margin: 0, padding: 0, minHeight: '100vh', display: 'flex' }}>
        <MetaMaskProvider>
          <HeaderNav links={NAV_LINKS} />
          <div style={{ flex: 1, marginLeft: '280px', display: 'flex', flexDirection: 'column' }}>
            <main style={{ flex: 1 }}>{children}</main>
            <footer style={{
              marginTop: '4rem',
              padding: '3rem 2rem',
              background: 'var(--bg-secondary)',
              borderTop: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              textAlign: 'center',
            }}>
              <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                <p style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem', fontWeight: '600' }}>
                  <strong>MON Transfer Platform</strong> on Monad Testnet
                </p>
                <p style={{ margin: '0 0 1rem 0', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  Powered by <strong style={{ color: '#8b5cf6' }}>ERC-4337</strong> • <strong style={{ color: '#3b82f6' }}>Pimlico</strong> • <strong style={{ color: '#06b6d4' }}>Envio</strong> • <strong style={{ color: '#10b981' }}>Viem</strong>
                </p>
                <div style={{
                  display: 'inline-block',
                  padding: '0.5rem 1rem',
                  background: 'var(--bg-tertiary)',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-color)',
                }}>
                  Built for the Monad ecosystem
                </div>
              </div>
            </footer>
          </div>
        </MetaMaskProvider>
      </body>
    </html>
  );
}
