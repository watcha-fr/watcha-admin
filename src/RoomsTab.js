import React, { useMemo, useState } from "react";
import { useTranslation, withTranslation } from "react-i18next";

import { useMatrixClientContext } from "./contexts";
import NewRoomButton from "./NewRoomButton";
import TableTab, { compareLowerCase } from "./TableTab";

const ns = "roomsTab";

export default () => {
    const { t } = useTranslation(ns);

    const [roomList, setRoomList] = useState(null);

    const client = useMatrixClientContext();

    const resolve = data =>
        data.map(item => ({
            roomId: item.room_id,
            name: item.name || "",
            creator: getDisplayName(item.creator) || "",
            n: item.members.length,
            status: item.active === 1 ? "active" : "inactive",
        }));

    const getDisplayName = userId => {
        const user = client.getUser(userId);
        return user && user.displayName;
    };

    const requestParams = {
        path: "watcha_extend_room_list",
        lazy: true,
        resolve,
    };

    const columns = useMemo(
        () => [
            {
                Header: t("headers.name"),
                accessor: "name",
                sortType: compareLowerCase,
            },
            {
                Header: t("headers.creator"),
                accessor: "creator",
                sortType: compareLowerCase,
                disableGlobalFilter: true,
            },
            {
                Header: t("headers.n"),
                accessor: "n",
                disableGlobalFilter: true,
            },
            {
                Header: t("headers.status"),
                accessor: "status",
                disableGlobalFilter: true,
                Cell: ({ value }) => (
                    <span className={value}>{t(`status.${value}`)}</span>
                ),
            },
        ],
        [t]
    );

    const initialState = useMemo(
        () => ({ sortBy: [{ id: "name", desc: false }] }),
        []
    );

    return (
        <TableTab
            itemList={roomList}
            setItemList={setRoomList}
            newItemButton={<NewRoomButton />}
            {...{ requestParams, columns, initialState, ns }}
        />
    );
};
