import React from "react";
import { useTranslation } from "react-i18next";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";

import icon from "./images/info-circle.svg";
import "./css/LabelTooltip.scss";

export default ({ popoverContent }) => {
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
