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
 * @param {*} seed 
 * @returns 
 */
export function useGenerate(seed) {
    const [img, setImg] = useState("");
    const [error, setError] = useState(null);

    useEffect(
        () => {
            getGenerate(seed)
            .then(res => {
                setImg(res);
            })
            .catch(e => {
                setError(e);
            });
        }, 
        [seed]
    );
    
    return [img, error];
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
 * @param {*} seeds 
 * @param {*} steps 
 * @returns 
 */
export function useInterpolate(seeds, steps) {
    const [ani, setAni] = useState("");
    const [error, setError] = useState(null);

    useEffect(
        () => {
            getInterpolate(seeds, steps)
            .then(res => {
                setAni(res);
            })
            .catch(e => {
                setError(e);
            });
        },
        [seeds, steps]
    );

    return [ani, error];

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

    return fetch(url);
}

/**
 * 
 * @param {*} seed 
 * @param {*} amount 
 * @returns 
 */
export function useBulk(seed, amount) {
    const [bulk, setBulk] = useState([]);
    const [error, setError] = useState(null);

    useEffect(
        () => {
            getBulk(seed, amount)
            .then(res => {
                setBulk(res);
            })
            .catch(e => {
                setError(e);
            });
        },
        [seed, amount]
    );

    return {bulk, error};
}