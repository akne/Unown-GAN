import React, { useEffect, useState } from "react";

import { useRequest } from "../api";

let JSZip = require("jszip");

/**
 * 
 * @returns 
 */
export default function API() {
    const [route, setRoute] = useState("gen");
    const [amount, setAmount] = useState("");
    const [steps, setSteps] = useState("");
    const [seed, setSeed] = useState("");
    const [imgs, setImgs] = useState([]);
    const [req, setReq] = useState({
        route: "generate",
        seed: "",
        steps: "",
        amount: ""
    });
    const [data, error] = useRequest(req);

    useEffect(
        () => {
            if (data !== "") {
                if (req.route === "bulk") {
                    JSZip.loadAsync(data).then(zData => {
                        let promises = Object.keys(zData.files).map(fname => {
                            let f = zData.files[fname];
                            return f.async("base64").then(str => {
                                return "data:image/png;base64," + str;
                            })
                        });
                        return Promise.all(promises);
                    }).then(strs => {
                        setImgs([...strs, ...imgs]);
                    });
                } else {
                    setImgs([window.URL.createObjectURL(data), ...imgs]);
                }
            }
        },
        // eslint-disable-next-line
        [data]
    );

    // TODO: stylise page
    // TODO: media query to properly handle mobile devices
    // TODO: appropriate error messages
    // TODO: form validation
    return (
        <div>
            <div id="controller">
                <div id="preview">
                    {error ? <p>Something went wrong</p> : <img src={imgs[0]} alt="randomly generated unown-sprite"/>}
                </div>
                <div id="options">
                    <form onSubmit={e => {
                        e.preventDefault();
                        setReq({
                            route: route,
                            seed: seed,
                            steps: steps,
                            amount: amount,
                        });
                    }}>
                        <label htmlFor="route">Route</label>
                        <select name="route" id="route" onChange={e => {
                            const { value } = e.target;
                            setRoute(value);
                        }} value={route}>
                            <option value="gen">Generate</option>
                            <option value="interpolate">Interpolate</option>
                            <option value="bulk">Bulk</option>
                        </select>

                        <label htmlFor="seed">{route === "interpolate" ? "Seeds" : "Seed"}</label>
                        <input type="text" id="seed" onChange={e => {
                            const { value } = e.target;
                            setSeed(value);
                        }}/>

                        <label htmlFor="steps">Steps</label>
                        <input disabled={route !== "interpolate"} type="number" id="steps" onChange={e => {
                            const { value } = e.target;
                            setSteps(value);
                        }}/>

                        <label htmlFor="amount">Amount</label>
                        <input disabled={route !== "bulk"} type="number" id="amount" onChange={e => {
                            const { value } = e.target;
                            setAmount(value);
                        }}/>

                        <button type="submit">GO</button> 
                    </form>
                </div>
            </div>
            <div id="thumbnails">
                {imgs.slice().reverse().map(img => (<img src={img} alt="randomly generated unown-sprite"/>))}
            </div>
        </div>
    )
}