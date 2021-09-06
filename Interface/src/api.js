import { useState, useEffect } from "react";
import API_URL from "./config";

/**
 * 
 * @param {*} seed 
 * @returns 
 */
function getGenerate(seed) {
    let url = API_URL + "/generate";

    if(seed !== "") {
        url += `?seed=${seed}`;
    }

    return fetch(url, {
        headers: {
            'Cache-Control': 'no-cache'
        }
    }).then(res => res.blob());
}

/**
 * 
 * @param {*} seeds 
 * @param {*} steps 
 * @returns 
 */
function getInterpolate(seeds, steps) {
    let url = API_URL + "/interpolate";

    if(seeds !== "" && steps !== "") {
        url += `?seeds=${seeds}&steps=${steps}`;
    }
    else if(seeds !== "") {
        url += `?seeds=${seeds}`;
    }
    else if(steps !== "") {
        url += `?steps=${steps}`;
    }

    return fetch(url, {
        headers: {
            'Cache-Control': 'no-cache'
        }
    }).then(res => res.blob());
}

/**
 * 
 * @param {*} seed 
 * @param {*} amount 
 * @returns 
 */
function getBulk(seed, amount) {
    let url = API_URL + "/bulk";

    if(seed !== "" && amount !== "") {
        url += `?seed=${seed}&amount=${amount}`;
    }
    else if(seed !== "") {
        url += `?seed=${seed}`;
    }
    else if(amount !== "") {
        url += `?amount=${amount}`;
    }

    return fetch(url, {
        headers: {
            'Cache-Control': 'no-cache'
        }
    }).then(res => res.blob());
}

/**
 * 
 * @param {*} req 
 * @returns 
 */
function getRequest(req) {
    switch(req.route) {
        case "generate":
            return getGenerate(req.seed);
        case "interpolate":
            return getInterpolate(req.seed, req.steps);
        case "bulk":
            return getBulk(req.seed, req.amount);
        default:
            return getGenerate(req.seed);
    }
}

/**
 * 
 * @param {*} req 
 * @returns 
 */
export function useRequest(req) {
    const [res, setRes] = useState("");
    const [error, setError] = useState(null);

    useEffect(
        () => {
            getRequest(req)
            .then(r => {
                setRes(r);
            })
            .catch(e => {
                setError(e);
            });
        },
        [req]
    );

    return [res, error];
}