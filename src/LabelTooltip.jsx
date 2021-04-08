import React from "react";
import PropTypes from "prop-types";

import { useTranslation } from "react-i18next";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";

import icon from "./images/info-circle.svg";
import "./css/LabelTooltip.scss";

const LabelTooltip = ({ popoverContent }) => {
    const { t } = useTranslation();

    const overlay = (
        <Popover>
            <Popover.Content>{popoverContent}</Popover.Content>
        </Popover>
    );

    return (
        <OverlayTrigger placement="right" {...{ overlay }}>
            <img className="LabelTooltip-icon" src={icon} alt={t("help")} />
        </OverlayTrigger>
    );
};

LabelTooltip.propTypes = {
    popoverContent: PropTypes.node.isRequired,
};

export default LabelTooltip;
