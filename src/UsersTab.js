import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useGet } from "restful-react";
import { withTranslation } from "react-i18next";

import Button from "./NewUserButton";
import Date from "./Date";
import DelayedSpinner from "./DelayedSpinner";
import TableTab, { compareLowerCase } from "./TableTab";

import { useDispatchContext, useUserIdContext } from "./contexts";
import CreateUserRightPanel from "./CreateUserRightPanel";
import UserRightPanel from "./UserRightPanel";

export default withTranslation()(({ t }) => {
    const userId = useUserIdContext();
    const dispatch = useDispatchContext();

    const [userList, setUserList] = useState(null);
    const [intervalId, setIntervalId] = useState(null);
    const [rightPanel, setRightPanel] = useState(null);

    const { data, refetch } = useGet({
        path: "watcha_user_list",
        lazy: true,
        resolve,
    });

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

    const isEmailAvailable = useCallback(
        () => value => userList.some(user => user.emailAddress === value),
        [userList]
    );

    const onClose = useCallback(() => setRightPanel(), []);

    const onClick = useCallback(
        () =>
            setRightPanel(
                <CreateUserRightPanel {...{ isEmailAvailable, onClose }} />
            ),
        [isEmailAvailable, onClose]
    );

    const button = useMemo(() => <Button {...{ onClick }} />, [onClick]);

    const editUser = useCallback(
        user =>
            setRightPanel(user && <UserRightPanel {...{ user, onClose }} />),
        [onClose]
    );

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

    useEffect(() => {
        if (userList && userId) {
            for (const user of userList) {
                if (user.userId === userId) {
                    setRightPanel(<UserRightPanel {...{ user, onClose }} />);
                    dispatch({ userId: null });
                    return;
                }
            }
        }
    }, [userList, userId, dispatch, onClose]);

    return userList ? (
        <TableTab
            data={userList}
            {...{ columns, initialState, button, rightPanel, editUser }}
        />
    ) : (
        <DelayedSpinner />
    );
});

const resolve = data =>
    data.map(item => ({
        userId: item.name,
        displayName: item.displayname || "",
        emailAddress: item.email || "",
        lastSeen: item.last_seen || null,
        role:
            item.admin === 1
                ? "administrator"
                : item.is_partner === 1
                ? "partner"
                : "collaborator",
        accountStatus: item.is_active,
    }));
