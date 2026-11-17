import { useEffect, useState } from "react";
import './TdA.css'
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Home from  "./pages/Home"
import './pages/Home.css'

import Stops from "./pages/Stops"
import './pages/Stops.css'


function TdA() {
    const navigateTo = useNavigate()

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
            </Routes>        
        </>
    )

}

export default TdA 