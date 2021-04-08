import React from "react";
import PropTypes from "prop-types";

import { useTranslation } from "react-i18next";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";

import icon from "./images/info-circle.svg";
import "./css/HeaderTooltip.scss";

const HeaderTooltip = ({ headerTitle, popoverTitle, popoverContent }) => {
    const { t } = useTranslation("usersTab");

    const popover = (
        <Popover className="HeaderTooltip_Popover">
            <Popover.Title as="h3">{popoverTitle}</Popover.Title>
            <Popover.Content>{popoverContent}</Popover.Content>
        </Popover>
    );

    return (
        <>
            {headerTitle}
            <OverlayTrigger placement="left" overlay={popover}>
                <img src={icon} alt={t("help")} />
            </OverlayTrigger>
        </>
    );
};

HeaderTooltip.propTypes = {
    headerTitle: PropTypes.string.isRequired,
    popoverTitle: PropTypes.string.isRequired,
    popoverContent: PropTypes.node.isRequired,
};

export default HeaderTooltip;
