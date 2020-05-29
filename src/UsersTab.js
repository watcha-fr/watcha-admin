import React, { useEffect, useMemo, useState } from "react";
import { useTranslation, withTranslation } from "react-i18next";

import { useDispatchContext } from "./contexts";
import Button from "./NewItemButton";
import Date from "./Date";
import NewUserModal from "./NewUserModal";
import TableTab, { compareLowerCase } from "./TableTab";
import UserRightPanel from "./UserRightPanel";

const ns = "usersTab";

export default ({ userId }) => {
    const { t } = useTranslation(ns);

    const [userList, setUserList] = useState(null);
    const [modalShow, setModalShow] = useState(false);
    const [rightPanel, setRightPanel] = useState(null);

    const requestParams = {
        path: "watcha_user_list",
        lazy: true,
        resolve,
    };

    const dispatch = useDispatchContext();

    useEffect(() => {
        const onClose = () => dispatch({ userId: null });
        if (userList && userId) {
            for (const user of userList) {
                if (user.userId === userId) {
                    setRightPanel(<UserRightPanel {...{ user, onClose }} />);
                    break;
                }
            }
        } else if (!userId) {
            setRightPanel();
        }
    }, [userId, dispatch]);

    const NewUserButton = withTranslation(ns)(Button);
    const newItemButton = <NewUserButton onClick={() => setModalShow(true)} />;

    const newItemModal = (
        <NewUserModal
            newUserLocalEcho={user => setUserList([...userList, user])}
            {...{ modalShow, setModalShow, userList }}
        />
    );

    const columns = useMemo(
        () => [
            {
                Header: t("headers.displayName"),
                accessor: "displayName",
                sortType: compareLowerCase,
            },
            {
                Header: t("headers.emailAddress"),
                accessor: "emailAddress",
                sortType: compareLowerCase,
            },
            {
                Header: t("headers.lastSeen"),
                accessor: "lastSeen",
                disableGlobalFilter: true,
                Cell: ({ value }) => value && <Date timestamp={value} />,
            },
            {
                Header: t("headers.role"),
                accessor: "role",
                disableGlobalFilter: true,
                Cell: ({ value }) => t(`roles.${value}`),
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
        () => ({ sortBy: [{ id: "displayName", desc: false }] }),
        []
    );

    return (
        <TableTab
            itemList={userList}
            setItemList={setUserList}
            itemId={userId}
            {...{
                requestParams,
                columns,
                initialState,
                newItemButton,
                newItemModal,
                rightPanel,
                ns,
            }}
        />
    );
};

const resolve = data =>
    data.map(item => ({
        userId: item.name,
        itemId: item.name,
        displayName: item.displayname || "",
        emailAddress: item.email || "",
        lastSeen: item.last_seen || null,
        role:
            item.admin === 1
                ? "administrator"
                : item.is_partner === 1
                ? "partner"
                : "collaborator",
        status: item.is_active === 1 ? "active" : "inactive",
        creationTs: item.creation_ts * 1000,
    }));
