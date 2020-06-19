import React from "react";
import { useTranslation } from "react-i18next";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";

import TooltipLogo from "./images/info-circle.svg";

import "./css/Tooltip.scss";

const ns = "common";

export default ({ tooltipName }) => {
    const { t } = useTranslation(ns);

    return (
        <div className="Tooltip">
            <OverlayTrigger
                overlay={
                    <Popover className="tooltip">
                        <Popover.Content>
                            {t(`tooltip.${tooltipName}`)}
                        </Popover.Content>
                    </Popover>
                }
                placement="right"
            >
                <img src={TooltipLogo} alt={t("help")}></img>
            </OverlayTrigger>
        </div>
    );
};
