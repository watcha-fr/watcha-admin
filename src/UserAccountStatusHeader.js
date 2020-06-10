import React from "react";
import { Trans, useTranslation } from "react-i18next";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";

import infoCircle from "./images/info-circle.svg";

export default () => {
    const { t } = useTranslation("usersTab");

    const popover = (
        <Popover className="userAccountStatusHeaderPopover">
            <Popover.Title as="h3">{t("statusHelp.title")}</Popover.Title>
            <Popover.Content>
                <p>
                    <Trans t={t} i18nKey={"statusHelp.content.active"} />
                </p>
                <p>
                    <Trans t={t} i18nKey={"statusHelp.content.inactive"} />
                </p>
                <p>
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
