import React from "react";
import { useTranslation } from "react-i18next";

import { useMatrixClientContext } from "./contexts";

import boxArrowUpRight from "./images/box-arrow-up-right.svg";
import "./css/RoomPermalink.scss";

export default ({ roomId }) => {
    const { t } = useTranslation("roomsTab");

    const client = useMatrixClientContext();
    const rooms = client.getRooms();
    const isMine = rooms.some(room => room.roomId === roomId);

    return isMine ? (
        <a href={`/app/#/room/${roomId}`} target="_blank">
            <img
                className="RoomPermalink"
                src={boxArrowUpRight}
                alt={t("permalink.alt")}
                title={t("permalink.enabled")}
            />
        </a>
    ) : (
        <img
            className="RoomPermalink RoomPermalink-disabled"
            src={boxArrowUpRight}
            alt={t("permalink.alt")}
            title={t("permalink.disabled")}
        />
    );
};
