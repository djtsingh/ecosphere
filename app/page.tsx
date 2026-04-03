export default function Home() {
  return (
    <main style={{
      display: 'flex',
      minHeight: '100vh',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '6rem'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          Welcome to Ecosphere
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#666' }}>
          A sustainable ecosystem platform
        </p>
      </div>
    </main>
  );
}
