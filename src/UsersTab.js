import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useGet } from "restful-react";
import { withTranslation } from "react-i18next";

import Button from "./NewUserButton";
import Date from "./Date";
import DelayedSpinner from "./DelayedSpinner";
import TableTab, { compareLowerCase } from "./TableTab";

import CreateUserRightPanel from "./CreateUserRightPanel";

export default withTranslation()(({ t }) => {
    const [userList, setUserList] = useState(null);
    const [intervalId, setIntervalId] = useState(null);
    const [rightPanel, setRightPanel] = useState();

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
                Header: t("usersTab.headers.displayName"),
                accessor: "displayName",
                sortType: compareLowerCase,
            },
            {
                Header: t("usersTab.headers.emailAddress"),
                accessor: "emailAddress",
                sortType: compareLowerCase,
            },
            {
                Header: t("usersTab.headers.lastSeen"),
                accessor: "lastSeen",
                disableGlobalFilter: true,
                Cell: ({ value }) => value && <Date timestamp={value} />,
            },
            {
                Header: t("usersTab.headers.role"),
                accessor: "role",
                disableGlobalFilter: true,
                Cell: ({ value }) => t(`usersTab.roles.${value}`),
            },
            {
                Header: t("usersTab.headers.accountStatus"),
                accessor: "accountStatus",
                disableGlobalFilter: true,
                Cell: ({ value }) => (
                    <span className={value === 1 ? "active" : "inactive"}>
                        {t(`usersTab.isActive.${value}`)}
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

    const onClick = useCallback(
        () => setRightPanel("CreateUserRightPanel"),
        []
    );

    const button = useMemo(() => <Button {...{ onClick }} />, [onClick]);

    const isEmailAvailable = useCallback(
        () => value => userList.some(user => user.emailAddress === value),
        [userList]
    );

    const onClose = useCallback(() => setRightPanel(), []);

    const panel = rightPanel === "CreateUserRightPanel" && (
        <CreateUserRightPanel {...{ isEmailAvailable, onClose }} />
    );

    return userList ? (
        <TableTab
            data={userList}
            {...{ columns, initialState, button, panel }}
        />
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
