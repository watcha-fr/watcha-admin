import React from "react";
import ProgressBar from "react-bootstrap/ProgressBar";

function ServerBar({ label, percent }) {
    return (
        <div className="ProgressBarContainer">
            <div>{label}</div>
            <ProgressBar now={percent} label={`${percent}%`} />
        </div>
    );
}

export default ServerBar;
