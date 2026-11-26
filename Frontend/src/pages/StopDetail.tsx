import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import "./Stops"
import "./StopDetail.css"


function StopDetail() {
    const { stop_id } = useParams<{ stop_id: string}>();
    const stopId = Number(stop_id)

    const [detailledStop, setDetailledStop] = useState<Stop | null>(null);
    const  [serverError, setServerError] = useState<string | null> (null)

    interface Stop {
        id: number;
        name: string;
        wheelchair_accessable: boolean;
        has_shelter: boolean;
        has_ticket_machine: boolean;
        image_url?: string;
    } 

    useEffect(() => {
        async function getStopByNumber() {
            try {
                const responseToStop = await fetch(`/api/v1/stops/${stopId}`)
                if (!responseToStop.ok) {
                    if (responseToStop.status === 404) {
                        throw new Error("The requested stop was not found")
                    }

                    throw new Error(`Server Error (${responseToStop.status}). Pleade try again later`)
                    
                }
                 
                const stopById : Stop = await responseToStop.json()
                console.log(stopById) 
                setDetailledStop(stopById)
            } catch (error) {
                if (error instanceof TypeError) {
                    setServerError("Api not reachable")
                    throw new Error("Api not reachable")
                } else if (error instanceof Error) {
                    setServerError(error.message)
                } else {
                    setServerError("unknown error occured")
                }

                throw error
                    
            }
        



            

        }
    
    getStopByNumber()
    }, [stopId]) ;

    const navigateTo = useNavigate()


    

    return(
        <>
        <div>
            {
               detailledStop ? (
                <div>
                    <h2>
                        {detailledStop.name}
                    </h2>
                    {
                        detailledStop.image_url
                        ? <div><img src={detailledStop.image_url} className="w-1/2 h-auto block mx-auto" alt="" /></div>
                        : <div> <p>Stop has no image</p> </div>
                    }
                    <button className="navigationButton"
                    onClick={() => (
                        navigateTo("/stops")
                    )}
                    >
                        Back
                    </button>
                    {
                        serverError !== null
                    
                        ? (<p> {serverError} </p> )                       
                    
                    : (<div>
                        <p>
                            At this stop is located
                        </p>
                        {
                            detailledStop.has_shelter
                            ? <p>A shelter</p>
                            : <p>No shelter</p>
                        }
                    
                        {
                            detailledStop.has_ticket_machine
                            ? <p>A ticket machine</p>
                            : <p>No ticket machine</p>
                        }

                        {
                            detailledStop.wheelchair_accessable
                            ? <p>And it is accessible with a wheelchair</p>
                            : <p>But it is not accessible with a wheelchair</p>
                        }
                    </div>)
                    }
                </div>
               )
               : <div> <p>Loading Stops...</p></div>  
               
            } 
            {
                serverError !== null && (
                    <p> {serverError} </p>
                )
            }
        </div>
        </>
    )
}

export default StopDetail