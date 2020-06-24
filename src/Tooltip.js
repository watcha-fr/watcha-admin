import React from "react";
import { useTranslation } from "react-i18next";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";

import icon from "./images/info-circle.svg";
import "./css/Tooltip.scss";

export default ({ tooltipName }) => {
    const { t } = useTranslation();

    const overlay = (
        <Popover>
            <Popover.Content>{t(`tooltip.${tooltipName}`)}</Popover.Content>
        </Popover>
    );

    return (
        <OverlayTrigger placement="right" {...{ overlay }}>
            <img className="Tooltip-icon" src={icon} alt={t("help")}></img>
        </OverlayTrigger>
    );
};
