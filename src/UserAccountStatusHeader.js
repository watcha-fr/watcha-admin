import React from "react";
import { Trans, useTranslation } from "react-i18next";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";

import infoCircle from "./images/info-circle.svg";

export default () => {
    const { t } = useTranslation("usersTab");

    const popover = (
        <Popover>
            <Popover.Title as="h3">{t("statusHelp.title")}</Popover.Title>
            <Popover.Content>
                <ul>
                    <li>
                        <Trans t={t} i18nKey={"statusHelp.content.active"} />
                    </li>
                    <li>
                        <Trans t={t} i18nKey={"statusHelp.content.inactive"} />
                    </li>
                    <li>
                        <Trans t={t} i18nKey={"statusHelp.content.invited"} />
                    </li>
                </ul>
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
