import { useState } from 'react'
import './App.css'
/*
interface HealthCheck {
  status : number
  statusResponse : string 
}*/

function App() {
  const [serverStatus, setServerStatus] = useState<string>("loading...")
  async function HealthCheck() {
    const response = await fetch("https://roomplants-ab56e543984ca943d415.tourde.app/api/v1/health")
    const responseStatus = await response.json();
    setServerStatus(responseStatus.status)
  }

  for (let i=0; i<1; i++){
    HealthCheck()
  }


  return (
    <>
    <h1> Think different Academy
    </h1>
    <p id='health'>{serverStatus}  </p>
    
    </>
  )
}

export default App
