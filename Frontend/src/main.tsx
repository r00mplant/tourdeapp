import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

//import './index.css'
//import './Stylesheet.css'
//import App from './App.tsx'
import TdA from './TdA.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <TdA />
    </BrowserRouter>    
  </StrictMode>,
)
