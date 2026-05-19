/**
 * Punto de entrada de la aplicación
 * Envuelve con AuthProvider para manejar autenticación globalmente
 * Envuelve con ThemeProvider para modo claro/oscuro
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import './index.css'
import './App.css'
import './landing.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
