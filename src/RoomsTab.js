import React, { useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";

import { useMatrixClientContext } from "./contexts";
import HeaderTooltip from "./HeaderTooltip";
import RoomPermalink from "./RoomPermalink";
import Status from "./Status";
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
            memberCount: item.members.length,
            status: item.status,
            type: item.type === "dm_room" ? "dmRoom" : "regularRoom",
        }));

    const getDisplayName = userId => {
        const user = client.getUser(userId);
        return user && user.displayName;
    };

    const requestParams = {
        path: "watcha_room_list",
        lazy: true,
        resolve,
    };

    const typeHeaderPopoverContent = (
        <>
            <p>
                <Trans
                    t={t}
                    i18nKey={"typeHeaderTooltip.content.dmRoom"}
                />
            </p>
            <p>
                <Trans t={t} i18nKey={"typeHeaderTooltip.content.regularRoom"} />
            </p>
        </>
    );

    const statusHeaderPopoverContent = (
        <>
            <p>
                <span className="status active" />
                <Trans t={t} i18nKey={"statusHeaderTooltip.content.active"} />
            </p>
            <p>
                <span className="status inactive" />
                <Trans t={t} i18nKey={"statusHeaderTooltip.content.inactive"} />
            </p>
            <p>
                <span className="status new" />
                <Trans t={t} i18nKey={"statusHeaderTooltip.content.new"} />
            </p>
        </>
    );

    const columns = useMemo(
        () => [
            {
                Header: t("headers.name"),
                accessor: "name",
                sortType: compareLowerCase,
                Cell: ({ value }) => <span title={value}>{value}</span>,
            },
            {
                Header: t("headers.creator"),
                accessor: "creator",
                sortType: compareLowerCase,
                disableGlobalFilter: true,
                Cell: ({ value }) => <span title={value}>{value}</span>,
            },
            {
                Header: t("headers.memberCount"),
                accessor: "memberCount",
                disableGlobalFilter: true,
            },
            {
                Header: (
                    <HeaderTooltip
                        headerTitle={t("headers.type")}
                        popoverTitle={t("typeHeaderTooltip.title")}
                        popoverContent={typeHeaderPopoverContent}
                    />
                ),
                accessor: "type",
                disableGlobalFilter: true,
                Cell: ({ value }) => t(`type.${value}`),
            },
            {
                Header: (
                    <HeaderTooltip
                        headerTitle={t("headers.status")}
                        popoverTitle={t("statusHeaderTooltip.title")}
                        popoverContent={statusHeaderPopoverContent}
                    />
                ),
                accessor: "status",
                disableGlobalFilter: true,
                Cell: ({ value }) => <Status status={value} t={t} />,
            },
        ],
        [t]
    );

    const initialState = useMemo(
        () => ({ sortBy: [{ id: "name", desc: false }] }),
        []
    );

    const plugins = [
        hooks => {
            hooks.visibleColumns.push(columns => [
                ...columns,
                {
                    id: "permalink",
                    Header: "",
                    Cell: ({ row }) => (
                        <RoomPermalink roomId={row.original.roomId} />
                    ),
                },
            ]);
        },
    ];

    return (
        <TableTab
            itemList={roomList}
            setItemList={setRoomList}
            {...{
                requestParams,
                columns,
                initialState,
                plugins,
                ns,
            }}
        />
    );
};
