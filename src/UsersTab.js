import React, { useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";

import NewItemButton from "./NewItemButton";
import Date from "./Date";
import NewUserModal from "./NewUserModal";
import TableTab, { compareLowerCase } from "./TableTab";

import HeaderTooltip from "./HeaderTooltip";

const ns = "usersTab";

export default ({ userId }) => {
    const { t } = useTranslation(ns);

    const [userList, setUserList] = useState(null);
    const [modalShow, setModalShow] = useState(false);

    const requestParams = {
        path: "watcha_user_list",
        lazy: true,
        resolve,
    };

    const newItemButton = (
        <NewItemButton onClick={() => setModalShow(true)} className="NewItemButton-user" {...{ t }} />
    );

    const newItemModal = (
        <NewUserModal
            newUserLocalEcho={user => setUserList([...userList, user])}
            {...{ modalShow, setModalShow, userList }}
        />
    );

    const roleHeaderPopoverContent = (
        <>
            <p>
                <Trans t={t} i18nKey={"roleHeaderTooltip.content.administrator"} />
            </p>
            <p>
                <Trans t={t} i18nKey={"roleHeaderTooltip.content.collaborator"} />
            </p>
            <p>
                <Trans t={t} i18nKey={"roleHeaderTooltip.content.partner"} />
            </p>
        </>
    );

    const columns = useMemo(
        () => [
            {
                Header: t("headers.displayName"),
                accessor: "displayName",
                sortType: compareLowerCase,
                Cell: ({ value }) => <span title={value}>{value}</span>,
            },
            {
                Header: t("headers.emailAddress"),
                accessor: "emailAddress",
                sortType: compareLowerCase,
                Cell: ({ value }) => <span title={value}>{value}</span>,
            },
            {
                Header: t("headers.lastSeen"),
                accessor: "lastSeen",
                disableGlobalFilter: true,
                Cell: ({ value }) => value && <Date timestamp={value} />,
            },
            {
                Header: (
                    <HeaderTooltip
                        headerTitle={t("headers.role")}
                        popoverTitle={t("roleHeaderTooltip.title")}
                        popoverContent={roleHeaderPopoverContent}
                    />
                ),
                accessor: "role",
                disableGlobalFilter: true,
                Cell: ({ value }) => t(`roles.${value}`),
            },
        ],
        [t]
    );

    const initialState = useMemo(() => ({ sortBy: [{ id: "displayName", desc: false }] }), []);

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
                ns,
            }}
        />
    );
};

const resolve = data =>
    data.map(item => ({
        userId: item.user_id,
        itemId: item.user_id,
        displayName: item.display_name || "",
        emailAddress: item.email_address || "",
        lastSeen: item.last_seen || null,
        role: item.role,
        status: item.status,
        creationTs: item.creation_ts,
    }));
