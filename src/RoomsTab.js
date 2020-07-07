import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { useMatrixClientContext } from "./contexts";
import NewItemButton from "./NewItemButton";
import NewRoomModal from "./NewRoomModal";
import RoomPermalink from "./RoomPermalink";
import TableTab, { compareLowerCase } from "./TableTab";

const ns = "roomsTab";

export default () => {
    const { t } = useTranslation(ns);

    const [roomList, setRoomList] = useState(null);
    const [modalShow, setModalShow] = useState(false);

    const client = useMatrixClientContext();

    const resolve = data =>
        data.map(item => ({
            roomId: item.room_id,
            name: item.name || "",
            creator: getDisplayName(item.creator) || "",
            memberCount: item.members.length,
            status: item.status,
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

    const newItemButton = (
        <NewItemButton
            onClick={() => setModalShow(true)}
            className="NewItemButton-room"
            {...{ t }}
        />
    );

    function getRoomCreatorDisplayName(mxRoom) {
        const currentState = mxRoom.currentState;
        const createEvent = currentState.getStateEvents("m.room.create", "");
        if (createEvent) {
            const userId = createEvent.getSender();
            return getDisplayName(userId);
        }
    }

    const newRoomLocalEcho = ({ roomId, name }) => {
        if (!roomList.some(room => room.roomId === roomId)) {
            const mxRoom = client.getRoom(roomId);
            const room = {
                roomId,
                name,
                creator: getRoomCreatorDisplayName(mxRoom) || "",
                memberCount: mxRoom.getInvitedAndJoinedMemberCount(),
                status: null,
            };
            setRoomList([...roomList, room]);
        }
    };

    const newItemModal = (
        <NewRoomModal
            show={modalShow}
            onHide={() => setModalShow(false)}
            {...{ newRoomLocalEcho }}
        />
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
                Header: t("headers.status"),
                accessor: "status",
                disableGlobalFilter: true,
                Cell: ({ value }) =>
                    value && (
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

    const plugins = [
        hooks => {
            hooks.visibleColumns.push(columns => [
                ...columns,
                {
                    id: "permalink",
                    Header: "",
                    Cell: ({ row }) => <RoomPermalink roomId={row.original.roomId} />,
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
                newItemButton,
                newItemModal,
                ns,
            }}
        />
    );
};
