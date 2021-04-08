import React from "react";
import PropTypes from "prop-types";

import "./css/PanelRow.scss";

const PanelRow = ({ label, value }) => (
    <div className="PanelRow">
        <div className="PanelRow_label">{label}</div>
        <div className="PanelRow_value">{value}</div>
    </div>
);

PanelRow.defaultProps = {
    value: "",
};

PanelRow.propTypes = {
    label: PropTypes.node.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default PanelRow;
