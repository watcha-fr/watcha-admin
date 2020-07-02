import React from "react";
import { useTranslation } from "react-i18next";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";

import "./css/HeaderTooltip.scss";
import infoCircle from "./images/info-circle.svg";

export default ({headerTitle, popoverTitle, popoverContent}) => {
    const { t } = useTranslation("usersTab");

    const popover = (
        <Popover className="HeaderTooltip_Popover">
            <Popover.Title as="h3">{popoverTitle}</Popover.Title>
            <Popover.Content>
                {popoverContent}
            </Popover.Content>
        </Popover>
    );

    return (
        <>
            {headerTitle}
            <OverlayTrigger placement="left" overlay={popover}>
                <img src={infoCircle} alt={t("help")} />
            </OverlayTrigger>
        </>
    );
};
