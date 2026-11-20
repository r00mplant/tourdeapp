import { useEffect, useState } from "react"
import "./Stops.css"
import { useNavigate } from "react-router-dom";

function Stops() {

    class Stop {
        id: number;
        name: string;
        wheelchair_accessable: boolean
        has_shelter: boolean
        has_ticket_machene: boolean
        image_url?: string

        constructor (
            id:number,
            name: string,
            wheelchair_accessable: boolean,
            has_shelter: boolean,
            has_ticket_machene: boolean,
            image_url?: string

        ) {
            this.id = id;
            this.name = name;
           
            this.wheelchair_accessable = wheelchair_accessable;
            this.has_shelter = has_shelter;
            this.has_ticket_machene = has_ticket_machene;
            this.image_url = image_url        
        }
    }

    const [stops, setStops] = useState<Stop[]>([]);

    useEffect(() => {
        async function listStops() {
        let stopId : number = 1

        const responseToNumOfStops = await fetch("./api/v1/stops")
        const numStops = await responseToNumOfStops.json()

        stopId = numStops.length

        const newStops: Stop[] = [];

        for(let i = 0; i < stopId; i++) {
            const newStop = new Stop (
                numStops[i].id,
                numStops[i].name,
                numStops[i].wheelchair_accessible,
                numStops[i].has_shelter,
                numStops[i].has_ticket_machine,
                numStops[i].image_url,
            );

            newStops.push(newStop);
            
        }

        console.log("Erstellte Stops: ", newStops)


        setStops(newStops);

        
        
    }

    listStops()

    }, []);  

    const [query, setQuery] = useState()

    async function search() {
        setQuery(searchInput)
    }

    const navigateTo = useNavigate()
    return (
        <>
        <div>
            <h1>
                Stops: 
            </h1>

            <div>   
                <input type="text" className="searchInput"/>
            </div>

        {
            stops.length === 0
            ? <div>
                <h2>
                    This system holds no stops
                </h2>
            </div>

            : stops.map((stop) => (
                <div key={stop.id}
                className={`flex grid-cols-1 md:grid-cols-2 items-center w-full ${
                    stop.id % 2 === 0
                    ? "flex-row-reverse text-right"
                    : "flex-row text-left"
                }`}
                >
                    {
                        stop.image_url 
                        ? <div><img src={stop.image_url} className="scale-90" onClick={() => (
                            navigateTo(`./${stop.id}`)
                        )}/></div>
                        :   <div> <p> no Image </p> </div>
                    } 

                    <table className="tg w-full">
                        <thead>
                            <tr>
                                <th> <h2>{stop.name}</h2> </th>
                            </tr>
                        </thead>    
                        <tbody>
                            <tr>
                                <td>
                                    <div>
                                        {
                                            stop.wheelchair_accessable
                                            ? <p>Accessible with Wheelchai</p>
                                            : <p>Not accessible with Wheelchair</p>
                                        }
                                    </div>
                                    
                                    <div>
                                        {
                                            stop.has_shelter
                                            ? <p>Has a shelter</p>
                                            : <p>Has no shelter</p>
                                        }
                                    </div>

                                    <div>
                                        {
                                            stop.has_ticket_machene
                                            ? <p>Ticket machene: available</p>
                                            : <p>Ticket machene: not available</p>
                                        }
                                    </div>
                                    <button className="navigationButton" onClick={() => (
                                        navigateTo(`./${stop.id}`)
                                    )}>
                                        Visit the Stop!
                                    </button>
                                    
                                </td>
                            </tr>
                        </tbody>
                    </table>      
                </div>
            ))
        }    
        
            
        

        </div>
        </>
    )
}

export default Stops