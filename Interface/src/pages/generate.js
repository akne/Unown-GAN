import React, { useState } from "react";

import { useGenerate } from "../api";

/**
 * 
 * @returns 
 */
export default function Generate() {
    const [seed, setSeed] = useState("");
    const [image, error] = useGenerate(seed);
    let img = "";
    try {
        img = window.URL.createObjectURL(image);
    }
    catch(e) {
        console.log(e);
    }

    return (
        <div>
            <img src={img} alt="randomly generated unown-sprite"/>
            <h1>Form to modify seed</h1>
        </div>
    )
}