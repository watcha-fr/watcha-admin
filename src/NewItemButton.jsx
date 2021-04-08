import React from "react";
import PropTypes from "prop-types";

import Button from "react-bootstrap/Button";

import "./css/NewItemButton.scss";

const NewItemButton = ({ onClick, className, t }) => (
    <Button variant="primary" {...{ onClick }} title={t("buttonTooltip")}>
        <span className={`NewItemButton ${className}`}>{t("button")}</span>
    </Button>
);

NewItemButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    className: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired,
};

export default NewItemButton;
