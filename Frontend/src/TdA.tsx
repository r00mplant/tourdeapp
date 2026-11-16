import { useEffect, useState } from "react";
import './TdA.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from  "./pages/Home"
import './pages/Home.css'

import Stops from "./pages/Stops"
import './pages/Stops.css'

function TdA() {

    return (
        <>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/stops" element={<Stops />} />
            </Routes>
        </BrowserRouter>
        </>
    )

}

export default TdA 