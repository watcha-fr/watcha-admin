import React, { useEffect, useMemo, useRef, useState } from "react";
import { useGet } from "restful-react";
import { useTranslation, withTranslation } from "react-i18next";

import { useMatrixClientContext } from "./contexts";
import Button from "./NewItemButton";
import DelayedSpinner from "./DelayedSpinner";
import TableTab, { compareLowerCase } from "./TableTab";

const ns = "roomsTab";

export default () => {
    const { t } = useTranslation(ns);

    const [userList, setUserList] = useState(null);

    const client = useMatrixClientContext();

    const resolve = data =>
        data.map(item => ({
            roomId: item.room_id,
            name: item.name || "",
            creator: getDisplayName(item.creator),
            n: item.members.length,
            status: item.active === 1 ? "active" : "inactive",
        }));

    const getDisplayName = userId => {
        const user = client.getUser(userId);
        return user && user.displayName;
    };

    const { data, refetch } = useGet({
        path: "watcha_extend_room_list",
        lazy: true,
        resolve,
    });

    const refetchRef = useRef();
    refetchRef.current = refetch;

    const intervalIdRef = useRef();

    useEffect(() => {
        refetchRef.current();
    }, []);

    useEffect(() => {
        setUserList(data);
        if (intervalIdRef.current) {
            clearInterval(intervalIdRef.current);
        }
        intervalIdRef.current = setInterval(() => refetchRef.current(), 10000);
    }, [data]);

    const NewRoomButton = withTranslation(ns)(Button);
    const newItemButton = <NewRoomButton onClick={() => {}} />;

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

    return userList ? (
        <TableTab
            data={userList}
            {...{ columns, initialState, newItemButton, ns }}
        />
    ) : (
        <DelayedSpinner />
    );
};
