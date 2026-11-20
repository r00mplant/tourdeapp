import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import "./Stops"
import "./StopDetail.css"


function StopDetail() {
    const { stop_id } = useParams<{ stop_id: string}>();
    const stopId = Number(stop_id)

    const [detailledStop, setDetailledStop] = useState<Stop | null>(null);

    interface Stop {
        id: number;
        name: string;
        wheelchair_accessable: boolean
        has_shelter: boolean
        has_ticket_machene: boolean
        image_url?: string
    } 

    useEffect(() => {
        async function getStopByNumber() {
        const responseToStop = await fetch(`/api/v1/stops/${stopId}`)

        const stopById : Stop = await responseToStop.json()
        setDetailledStop(stopById)

    }
    
    getStopByNumber()
    }, [stopId]) ;


    

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
                    <p>
                        At this stop is located
                    </p>
                    {
                        detailledStop.has_shelter
                        ? <p>A shelter</p>
                        : <p>No shelter</p>
                    }
                    
                    {
                        detailledStop.has_ticket_machene
                        ? <p>A ticket machene</p>
                        : <p>No ticket machene</p>
                    }

                    {
                        detailledStop.wheelchair_accessable
                        ? <p>And it is accessible with a wheelchair</p>
                        : <p>But it is not accessible with a wheelchair</p>
                    }
                </div>
               )
               : <div> <p>Loading Stop...</p></div>  
            } 
        </div>
        </>
    )
}

export default StopDetail