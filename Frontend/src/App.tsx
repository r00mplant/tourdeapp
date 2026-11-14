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
  useEffect(()=> {
    HealthCheck()
  }, [])
    
  

  interface Team {
    id: number
    name: string
    member1: string
    member2: string 
  }

  const [team, setTeam] = useState<Team[]>([]) 
  /*async function getCurrTeams() {
    const foundTeams: Team[] = []
    
    let teamId = 1

    while (true) {
      try{
        const response = await fetch(`/api/v1/teams/${teamId}`)
      } catch {
        if (response.status === 404) break
      }
      
      const currentTeams: Team = await response.json()
      foundTeams.push(currentTeams)
      teamId++
    }

    setTeam(foundTeams)
  }

  useEffect(() => { 
    getCurrTeams()
  }, [])*/
    
  

  const [teamName, setTeamName] = useState<string>("")
  const [member1, setMember1] = useState<string>("")
  const [member2, setMember2] = useState<string>("")

  async function addNewTeam() {
    if(!teamName.trim()) return

    try { 

      const loadTeamToBackend = await fetch("/api/v1/teams/", { 
         
        method: "POST",
         headers: {"Content-Type": "application/json"},
         body: JSON.stringify({ //Packt alles in ein JSON Object 

          name: teamName.trim(),
          member1: member1.trim(),
          member2:member2.trim()

         })
      })

      if (!loadTeamToBackend.ok) {
        throw new Error(`HTTP-Fehler: ${loadTeamToBackend.status}`)
      }

      const createdTeam: Team = await loadTeamToBackend.json()

      setTeam(currentTeams => [...currentTeams, createdTeam])

      setTeamName("")
      setMember1("")
      setMember2("")

      setIsTeamPopupOpen(false)



      /*const serverAnswer = await loadTeamToBackend.json()
      setTeam(serverAnswer.team) //neue Teams aktualisieren*/
  
      
      

    } catch (error) {
      console.error("Fehler beim Erstellen des Teams: ", error)
    }
  }
  const [isTeamPopupOpen, setIsTeamPopupOpen] = useState(false)

  return (
    <>
    <h1> Think different Academy </h1>

    <p id='health'>{serverStatus}  </p>

    <button 
      type="button"
      id="addTeamButton"
      className="bg-violett-300"
      onClick={() => setIsTeamPopupOpen(true)}
    >
      Add new Team
    </button>

    {team.length > 0 && (
      <div className="team-list">
        <h2>
          Created Teams
        </h2>
        {team.map((currentTeam) => (
          <div key={currentTeam.id} className="team-card">
            <h3 className="bg-black-700">
              {currentTeam.name}
            </h3>
            <p className="bg-violet-500 text-sky-500">
              ID: {currentTeam.id}
            </p>
            <p className="bg-violet-700 text-sky-500">
              Member 1: {currentTeam.member1}
            </p>
            <p className="bg-violet-900 text-sky-500">
              Member 2: {currentTeam.member2}
            </p>
          </div>
        ))}
      </div>
    )}

    {isTeamPopupOpen && (
      <div 
        className="popup-backdrops"
        onClick={() => setIsTeamPopupOpen(false)}
      >

        <div
          className="popup"
          role="dialog"
          aria-modal="true"
          aria-labelledby="new-team-title"
          onClick={(event) => event?.stopPropagation()}
        >
                
          <h2 id="new-team-title">New Team</h2>

          <form onSubmit={(event) => {
            event.preventDefault()
            addNewTeam()
          }}>

            <label htmlFor="teamName">Team Name:</label>
            <input
              type="text"
              id="teamName"
              value={teamName}
              onChange={(event) => setTeamName(event.target.value)}
              placeholder="enter team name"
              required
            />

            <label htmlFor="member1"> Member 1:</label>
            <input 
              type="text"
              id="member1"
              value={member1}
              onChange={(event) => setMember1(event.target.value)}
              placeholder="Enter first team member"
            />

            <label htmlFor="member2"> Member 2:</label>
            <input 
              type="text"
              id="member2"
              value={member2}
              onChange={(event) => setMember2(event.target.value)}
              placeholder="Enter first team member"
            />

            <div className="popup-actions"> 


              <button type="submit" className="button-primary"> 
                Create Team  

              </button>

              <button 
                type="button" 
                className="button-secondary"
                onClick={() => setIsTeamPopupOpen(false)}
              > 
                Cancel 
              </button>

            </div>
          </form>
        </div>
      </div>
    )}
    </>
  )
}

export default App
