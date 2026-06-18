import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { FavouritesProvider } from './Context/FavouritesContext'
import './index.css'
import './i18n'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <FavouritesProvider>
        <App />
      </FavouritesProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
