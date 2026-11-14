import { useEffect, useState } from 'react'
import './App.css'
/*
interface HealthCheck {
  status : number
  statusResponse : string 
}*/

function App() {
  const [serverStatus, setServerStatus] = useState<string>("loading...")
  async function HealthCheck() {
    const response = await fetch("/api/v1/health")
    const responseStatus = await response.json();
    setServerStatus(responseStatus.status)
  }
  for (let i=0; i<1; i++){
    HealthCheck()
  }

  interface Team {
    id: number
    name: string
    member1: string
    member2: string 
  }

  const [team, setTeam] = useState<Team[]>([]) 
  async function getCurrTeams() {
    const response = await fetch("/api/v1/teams")
    const currTemas = await response.json()
    setTeam(currTemas.name + currTemas.id) //müssen gucken ob es currTeams.name oder currTeams.id ist, da er die akuellen Teams aufruft  
  }

  useEffect(() => { 
    getCurrTeams()
  }, [])
    
  

  const [teamName, setTeamName] = useState<string>("")
  const [member1, setMember1] = useState<string>("")
  const [member2, setMember2] = useState<string>("")

  async function addNewTeam() {
    if(!teamName.trim()) return

    const memberList: string[] = [] //Leere Liste deklarieren und initialisieren

    if(member1.trim() !== "") {
      memberList.push(member1) //Push ist equal zu .add() in Java
    }

    if(member2.trim() !== ""){
      memberList.push(member2)
    }

    try { //try catch um fehler zu preventen
      const response = await fetch("/api/v1/teams", { //genauere Definition des Fetch befehls
         method: "POST",
         headers: {"Content-Type": "application/json"},
         body: JSON.stringify({ //Packt alles in ein JSON Object 
          name: teamName,
          member1: member1,
          member2:member2
         })
      })

      try{
        const serverAnswer = await response.json()
        setTeam(serverAnswer.team) //neue Teams aktualisieren
      } catch {
        console.error("422 Validation Error oder Ähnliches")
      }

    } catch (error) {
      console.error("Fehler beim Erstellen des Teams")
    }


    
  }


  return (
    <>
    <h1> Think different Academy
    </h1>
    <p id='health'>{serverStatus}  </p>
     <input type="button" id="addTeamButton"  > Add new Team</input> 

    
    
    </>
  )
}

export default App
