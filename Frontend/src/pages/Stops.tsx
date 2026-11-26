import { cloneElement, useEffect, useState } from "react"
import "./Stops.css"
import { useNavigate } from "react-router-dom";
import {FormControl, InputLabel, Select, MenuItem, TextField} from "@mui/material"

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

    useEffect(() => {
        listStops()
    }, []);

    

      

    const [searchStopName, setSearchStopName] = useState("")
    const [has_shelter , setHasShelter] = useState<boolean | undefined>(undefined)
    const [ticket_machine_available, setTicketMacheneAvailable] = useState<boolean | undefined> (undefined)
    const [wheelchair_accessible, setWheelchairAccessible ] = useState<boolean | undefined> (undefined)
    const [searchE, setSearchE] = useState<boolean> (false)
    const [searchError, setSearchError] = useState<string | null>(null)


    const searchStops = async () => {
        const params = new URLSearchParams();
        params.append("name" , searchStopName);

        if (has_shelter !== undefined) {
            params.append("has_shelter", String(has_shelter))
        }

        if (ticket_machine_available !== undefined) {
            params.append("ticket_machine_available", String(ticket_machine_available))
        }

        if (wheelchair_accessible !== undefined) {
            params.append("wheelchair_accessible", String(wheelchair_accessible))
        }

        const responseToStopSearch = await fetch(
            `/api/v1/stops?${params.toString()}`
        );

        console.log("geschickter Befehlsteil: ", params.toString())

        if (responseToStopSearch.status === 404) {
            setSearchError("No stops match this filter")
            setSearchE(true)
        }

        if (!responseToStopSearch.ok) {
            setSearchError(String(responseToStopSearch.status))
            console.error("Server Error: ", searchError)
        }


        const searchedStops = await responseToStopSearch.json();  

        let stopId: number
        stopId = searchedStops.length 

        const newSearchedStops: Stop[] = [];

        for(let i = 0; i < stopId; i++) {
            const newStop = new Stop (
                searchedStops[i].id,
                searchedStops[i].name,
                searchedStops[i].wheelchair_accessible,
                searchedStops[i].has_shelter,
                searchedStops[i].has_ticket_machine,
                searchedStops[i].image_url,
            );

            newSearchedStops.push(newStop);
            
        }

        console.log("Erstellte gesuchte Stops: ", newSearchedStops)


        setStops(newSearchedStops);


    }

    function clearSearch() {
        setSearchStopName("")
        setHasShelter(undefined)
        setTicketMacheneAvailable(undefined)
        setWheelchairAccessible(undefined)
        
        listStops()
        
    }

    const navigateTo = useNavigate()

    return (
        <>
        <div>
            <h1>
                Stops: 
            </h1>

            <div className="max-w-1/2 ">   
                <TextField 
                    label="Search for Stops"
                    value={searchStopName}
                    variant="outlined"
                    id="outlined-basics"
                    onChange={(event) => setSearchStopName(event.target.value)} 
                />
                <button className="navigationButton" onClick={() => (
                    searchStops()
                )}>
                    Search
                </button>

                <button className="navigationButton"
                onClick={() => (
                    clearSearch()
                )}>
                    clear Search 
                </button>
            
            <div className="selection_field">
                <FormControl>
                    <InputLabel> Shelter </InputLabel>

                    <Select 
                    value={has_shelter === undefined
                        ? ""
                        : String(has_shelter)
                    }
                    label="Has Shelter"
                    onChange={(event) => {
                        const value = event.target.value;

                        setHasShelter(
                            value === ""
                            ? undefined
                            : value === "true"
                        );
                    }}
                    >
                        <MenuItem value=""> -- </MenuItem> 
                        <MenuItem value="true"> available </MenuItem>
                        <MenuItem value="false"> not available </MenuItem>
                    </Select>



                </FormControl>
             
                <FormControl>
                    <InputLabel> Wheelchair </InputLabel>

                    <Select 
                    value={wheelchair_accessible === undefined
                        ? ""
                        : String(wheelchair_accessible)
                    }
                    label="Has Shelter"
                    onChange={(event) => {
                        const value = event.target.value;

                        setWheelchairAccessible(
                            value === ""
                            ? undefined
                            : value === "true"
                        );
                    }}
                    >
                        <MenuItem value=""> -- </MenuItem> 
                        <MenuItem value="true"> accessible </MenuItem>
                        <MenuItem value="false"> not accessible </MenuItem>
                    </Select>



                </FormControl>
            
                <FormControl>
                    <InputLabel> Ticket machine </InputLabel>

                    <Select 
                    value={ticket_machine_available === undefined
                        ? ""
                        : String(ticket_machine_available)
                    }
                    label="Has Shelter"
                    onChange={(event) => {
                        const value = event.target.value;

                        setTicketMacheneAvailable(
                            value === ""
                            ? undefined
                            : value === "true"
                        );
                    }}
                    >
                        <MenuItem value=""> -- </MenuItem> 
                        <MenuItem value="true"> available </MenuItem>
                        <MenuItem value="false"> not available </MenuItem>
                    </Select>



                </FormControl>
            </div>
        </div>

        {
            stops.length === 0
            ?   ( searchE === true
                ? <p> The filter does not match the systems stops</p>
                : <p> This system holds no stops </p>
            )
            
                

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
                        ? <div><img src={stop.image_url} className="scale-90 hover:cursor-pointer" onClick={() => (
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
                                            ? <p>Accessible with wheelchair</p>
                                            : <p>Not accessible with wheelchair</p>
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
                                            ? <p>Ticket machine: available</p>
                                            : <p>Ticket machine: not available</p>
                                        }
                                    </div>
                                    <button className="navigationButton hover:cursor-pointer" onClick={() => (
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