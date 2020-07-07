import React from "react";

import "./css/PanelRow.scss";

export default ({ label, value }) => (
    <div className="PanelRow">
        <div className="PanelRow_label">{label}</div>
        <div className="PanelRow_value">{value}</div>
    </div>
);
