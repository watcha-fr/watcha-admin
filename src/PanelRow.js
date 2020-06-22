import React from "react";

import "./css/PanelRow.scss";

export default ({ label, value, children }) => (
    <div className="PanelRow_content">
        <div className="PanelRow_label">
            {label}
            {children}
        </div>
        <div className="PanelRow_value">{value}</div>
    </div>
);
