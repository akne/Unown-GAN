import React, { useState } from "react";
import { Redirect } from "react-router-dom";

/**
 * 
 * @returns 
 */
export default function Unavailable() {
    const [redirect, setRedirect] = useState(false);
    setTimeout(() => setRedirect(true), 5000);

    // TODO: stylise page

    return (
        <div>
            <h1>This page doesn't eixst, redirecting...</h1>
            { redirect ? <Redirect to="/"/> : null }
        </div>
    )
}