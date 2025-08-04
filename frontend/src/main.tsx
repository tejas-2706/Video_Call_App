import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import AppProviders from './contexts/AppProviders.tsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AppProviders>
      <App />
    </AppProviders>
  </BrowserRouter>
)
