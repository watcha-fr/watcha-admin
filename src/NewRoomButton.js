import React from "react";
import { useTranslation } from "react-i18next";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";

import Button from "./NewItemButton";

export default () => {
    const { t } = useTranslation("roomsTab");

    const popover = (
        <Popover>
            <Popover.Content>{t("buttonHelp")}</Popover.Content>
        </Popover>
    );

    return (
        <OverlayTrigger placement="left" overlay={popover}>
            <span className="d-inline-block">
                <Button
                    onClick={() => window.open("/#/new", "_blank")}
                    {...{ t }}
                />
            </span>
        </OverlayTrigger>
    );
};
