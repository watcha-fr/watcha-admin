import React from "react";
import ProgressBar from "react-bootstrap/ProgressBar";

export default ({ label, percent }) => (
    <div className="ProgressBarContainer">
        <div>{label}</div>
        <ProgressBar now={percent} label={`${percent}%`} />
    </div>
);
