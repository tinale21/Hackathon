import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// On a computer, the phone frame scales down to fit shorter windows.
const fit = () => document.documentElement.style.setProperty('--fit', Math.max(0.5, Math.min(1, (innerHeight - 40) / 844)).toFixed(3))
fit()
addEventListener('resize', fit)
