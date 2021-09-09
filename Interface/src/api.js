import { useState, useEffect } from "react";

import API_URL from "./config";

/**
 * Function used to call the generate API endpoint.
 * @param {*} seed A string denoting a seed.
 * @returns A blob containing the generated image.
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
 * Function used to call the interpolate API endpoint.
 * @param {*} seeds A string denoting a seed or series of seeds (e.g. "1", "47, 38", etc).
 * @param {*} steps A string denoting the amount of steps taken to interpolate between seeds.
 * @returns A blob containing the interpolation GIF.
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
 * Function used to call the bulk generation API endpoint.
 * @param {*} seed A string denoting a seed.
 * @param {*} amount A string denoting the amount of images to generate.
 * @returns A blob containing a ZIP file of images.
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
 * Function used to call other functions depending on the specified route.
 * @param {*} req An object that contains the fields 'route', 'seed', 'steps', and 'amount'.
 * @returns A blob containing the API response.
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
 * Function used to handle an API request.
 * @param {*} req An object that contains the fields 'route', 'seed', 'steps', and 'amount'.
 * @returns The API response and error (if one occurred).
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