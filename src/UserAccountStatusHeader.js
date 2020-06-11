import React from "react";
import { Trans, useTranslation } from "react-i18next";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";

import "./css/UserAccountStatusHeader.scss";
import infoCircle from "./images/info-circle.svg";

export default () => {
    const { t } = useTranslation("usersTab");

    const popover = (
        <Popover className="UserAccountStatusHeader_Popover">
            <Popover.Title as="h3">{t("statusHelp.title")}</Popover.Title>
            <Popover.Content>
                <p>
                    <span className="status active" />
                    <Trans t={t} i18nKey={"statusHelp.content.active"} />
                </p>
                <p>
                    <span className="status inactive" />
                    <Trans t={t} i18nKey={"statusHelp.content.inactive"} />
                </p>
                <p>
                    <span className="status invited" />
                    <Trans t={t} i18nKey={"statusHelp.content.invited"} />
                </p>
            </Popover.Content>
        </Popover>
    );

    return (
        <>
            {t("headers.status")}
            <OverlayTrigger placement="left" overlay={popover}>
                <img src={infoCircle} />
            </OverlayTrigger>
        </>
    );
};
