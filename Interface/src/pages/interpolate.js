import React, { useState } from "react";

import { useInterpolate } from "../api";

/**
 * 
 * @returns 
 */
export default function Interpolate() {
    const [seeds, setSeeds] = useState("");
    const [steps, setSteps] = useState("");
    const [image, error] = useInterpolate(seeds, steps);
    let img = "";
    try {
        img = window.URL.createObjectURL(image);
    }
    catch(e) {
        console.log(e);
    }
    
    return (
        <div>
            <img src={img} alt="interpolation between two randomly generated unown-sprites"/>
            <h1>Form to modify seeds and steps</h1>
        </div>
    )
}