import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      fontFamily: 'var(--docs-font-body)',
      color: 'var(--docs-color-fg)',
      gap: '1rem',
      padding: '2rem',
      textAlign: 'center',
    }}>
      <h1 style={{ fontSize: '4rem', fontWeight: 700, opacity: 0.2 }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Page not found</h2>
      <p style={{ color: 'var(--docs-color-fg-muted)', maxWidth: '400px' }}>
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/docs"
        style={{
          marginTop: '1rem',
          padding: '0.625rem 1.5rem',
          background: 'var(--docs-color-primary)',
          color: 'white',
          borderRadius: '8px',
          textDecoration: 'none',
          fontSize: '0.875rem',
          fontWeight: 500,
        }}
      >
        Go to Documentation
      </Link>
    </div>
  );
}
