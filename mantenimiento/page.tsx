export default function MaintenancePage() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh', 
      fontFamily: 'sans-serif',
      textAlign: 'center',
      backgroundColor: '#f8f9fa'
    }}>
      <h1 style={{ fontSize: '3rem' }}>🛠️</h1>
      <h1 style={{ color: '#333' }}>Sitio en Mantenimiento</h1>
      <p style={{ color: '#666' }}>Estamos trabajando para mejorar tu experiencia. ¡Volvemos pronto!</p>
    </div>
  )
}