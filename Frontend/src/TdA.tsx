import { useEffect, useState } from "react";
import './TdA.css'
//import './Stylesheet.css'
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Home from  "./pages/Home"
import './pages/StopDetail'

import Stops from "./pages/Stops"
import './pages/Stops.css'
import StopDetail from "./pages/StopDetail";


function TdA() {
    const navigateTo = useNavigate()

    /*let stop_id:number 
    const responseToNumOfStops = await fetch("./api/v1/stops")
    const numStops = await responseToNumOfStops.json()

    stop_id = numStops.length*/ 

    return (
        <>
        <div className="topNavBar">
            <button className="navigationButton" onClick={() => (
                navigateTo('/stops')
            )}> Stops </button>

            <button className="navigationButton" onClick={() => (
                navigateTo('/')
            )}>
                Home </button>

        </div>        
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/stops" element={<Stops />} />
                <Route path="/stops/:stop_id" element={<StopDetail />} />
            </Routes>        
        </>
    )

}

export default TdA 