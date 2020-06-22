import React from "react";
import { useTranslation } from "react-i18next";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";

import tooltipLogo from "./images/info-circle.svg";
import "./css/Tooltip.scss";

export default ({ tooltipName }) => {
    const { t } = useTranslation();

    const overlay = (
        <Popover className="tooltip">
            <Popover.Content>{t(`tooltip.${tooltipName}`)}</Popover.Content>
        </Popover>
    );

    return (
        <div className="Tooltip">
            <OverlayTrigger {...{ overlay }} placement="right">
                <img src={tooltipLogo} alt={t("help")}></img>
            </OverlayTrigger>
        </div>
    );
};
