import React, { useEffect, useState } from "react";
import { saveAs } from "file-saver";

import { useRequest } from "../api";

let JSZip = require("jszip");

/**
 * Function that creates the API form and display.
 * @returns A div containing the preview, form, and thumbnails.
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

    /**
     * Method that adds each generated image into a ZIP and downloads it.
     */
    const download = () => {
        let zip = new JSZip();

        for(let i = 0; i < imgs.length; i++) {
            let blob = fetch(imgs[i].img).then(res => res.blob());
            zip.file(`${i}.${imgs[i].type}`, blob);
        }

        zip.generateAsync({type: "blob"})
        .then(content => {
            saveAs(content, "download.zip");
        })               
    }

    useEffect(
        () => {
            if (data !== "") {
                if (req.route === "bulk") {
                    JSZip.loadAsync(data).then(zData => {
                        let promises = Object.keys(zData.files).map(fname => {
                            let f = zData.files[fname];
                            return f.async("base64").then(str => {
                                return {img: "data:image/png;base64," + str, type: "png"};
                            })
                        });
                        return Promise.all(promises);
                    }).then(strs => {
                        setImgs([...strs, ...imgs]);
                    });
                } else {
                    let type = "png";
                    if (req.route === "interpolate") { 
                        type = "gif";
                    }
                    setImgs([{img: window.URL.createObjectURL(data), type: type}, ...imgs]);
                }
            }
        },
        // eslint-disable-next-line
        [data]
    );

    // TODO: appropriate error messages
    return (
        <div>
            <div id="controller">
                {error ? <p>Something went wrong : {error}</p> : null}
                <div id="preview">
                    <img id="preview-img" src={imgs[0] ? imgs[0].img : null} alt="randomly generated unown-sprite"/>
                </div>
                <div id="options">
                    <form onSubmit={e => {
                        e.preventDefault();

                        let seedRegex = /^\d+(?:\s*,\s*\d+)*/;
                        if (route !== "interpolate") {
                            seedRegex = /\d+/;
                        }
                        let match = seed.match(seedRegex);
                        let theSeed = seed;
                        if (match) {
                            theSeed = match[0];
                        }

                        setReq({
                            route: route,
                            seed: theSeed,
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
                <h2>History</h2>
                <button onClick={() => setImgs([imgs[0]])}>Clear</button>
                <button onClick={download}>Download</button>
                <br/>
                {
                    imgs.slice().reverse().map((img, i) => 
                        (
                            <img src={img.img} onClick={() => {
                                let prev = document.getElementById("preview-img");
                                prev.src = img.img;
                            }} alt="randomly generated unown-sprite" key={i}/>
                        )
                    )
                }
            </div>
        </div>
    )
}