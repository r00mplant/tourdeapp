import { svgIconClasses, useScrollTrigger } from "@mui/material";
import { useEffect, useState, Suspense } from "react";

function Lines() {

    class Line {
        id: number;
        number: string;
        name: string;
        type: string;
        colour: string;

        constructor (
            id: number,
            number: string,
            name: string,
            type: string,
            colour: string,
        ) {
            this.id = id;
            this.number = number;
            this.name = name;
            this.type = type;
            this.colour = colour;
        }

    }

    const [lines, setLines] = useState<Line[]>([]);

    async function listLines() {
        let lineId: number = 1;
        
        const responseToLines = await fetch("./api/v1/lines")
        const numLines = await responseToLines.json()
        lineId = numLines.length

        console.log("fetch: ", responseToLines)
        console.log("response: ", numLines)

        const newLines: Line[] = [];

        for(let i=0; i<numLines; i++) {
            const newLine = new Line (
                numLines[i].id,
                numLines[i].number,
                numLines[i].name,
                numLines[i].type,
                numLines[i].colour
            );

            newLines.push(newLine);
        }

        console.log("erstelle Lines; ", newLines)

        setLines(newLines);

    }

    useEffect(() => {
        listLines()
    }, []);

    return (
        <>
        <div>
            <h1>
                Lines on the Thing differrent Academy campus
            </h1>
                {
                    lines.map((line) => (
                        <div>
                    <table>
                        <thead>
                            <tr>
                                <th>
                                    Line
                                </th>
                                <th>
                                    Attributes
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <th> {line.id} </th>
                            <td>
                                {
                                    line.name
                                }
                                <br />
                                {
                                    line.number
                                }
                                <br />
                                {
                                    line.colour
                                }
                                <br />
                                {
                                    line.type
                                }
                            </td>
                        </tbody>
                    </table>
                </div>
                    ))
                }          
            
            <div>
                {
                    lines.length === 0
                    ?<p>No Lines on the System</p>
                    :<p>Enjoy your ride</p>
                }
            </div>
        </div>
        </>
    )
} 

export default Lines 