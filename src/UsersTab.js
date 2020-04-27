import React, { useEffect, useMemo, useState } from "react";
import { useGet } from "restful-react";
import { withTranslation } from "react-i18next";

import Button from "./NewUserButton"
import Date from "./Date";
import DelayedSpinner from "./DelayedSpinner";
import TableTab, { compareLowerCase } from "./TableTab";

export default withTranslation()(({ t }) => {
    const [userList, setUserList] = useState(null);
    const [intervalId, setIntervalId] = useState(null);

    const { data, refetch } = useGet({
        path: "watcha_user_list",
        lazy: true,
        resolve,
    });

    useEffect(() => {
        refetch();
    }, []);

    useEffect(() => {
        setUserList(data);
        const _intervalId = setInterval(() => refetch(), 10000);
        setIntervalId(prevIntervalId => {
            prevIntervalId && clearInterval(prevIntervalId);
            return _intervalId;
        });
    }, [data]);

    const columns = useMemo(
        () => [
            {
                Header: t("usersTab.displayName"),
                accessor: "displayName",
                sortType: compareLowerCase,
            },
            {
                Header: t("usersTab.emailAddress"),
                accessor: "emailAddress",
                sortType: compareLowerCase,
            },
            {
                Header: t("usersTab.lastSeen"),
                accessor: "lastSeen",
                disableGlobalFilter: true,
                Cell: ({ value }) => value && <Date timestamp={value} />,
            },
            {
                Header: t("usersTab.role.title"),
                accessor: "role",
                disableGlobalFilter: true,
                Cell: ({ value }) => t(`usersTab.role.${value}`),
            },
            {
                Header: t("usersTab.accountStatus.title"),
                accessor: "accountStatus",
                disableGlobalFilter: true,
                Cell: ({ value }) => (
                    <span className={value === 1 ? "active" : "inactive"}>
                        {t(`usersTab.accountStatus.${value}`)}
                    </span>
                ),
            },
        ],
        [t]
    );

    const initialState = useMemo(
        () => ({ sortBy: [{ id: "displayName", desc: false }] }),
        []
    );

    return userList ? (
        <TableTab data={userList} {...{ columns, initialState, Button }} />
    ) : (
        <DelayedSpinner />
    );
});

const resolve = data =>
    data.map(item => ({
        displayName: item.displayname || "",
        emailAddress: item.email || "",
        lastSeen: item.last_seen || null,
        role:
            item.admin === 1
                ? "administrator"
                : item.is_partner === 1
                ? "partners"
                : "collaborator",
        accountStatus: item.is_active,
    }));
