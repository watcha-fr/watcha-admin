import React, { useEffect, useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";

import { useDispatchContext } from "./contexts";
import NewItemButton from "./NewItemButton";
import Date from "./Date";
import NewUserModal from "./NewUserModal";
import TableTab, { compareLowerCase } from "./TableTab";
import UserRightPanel from "./UserRightPanel";

import Status from "./Status";
import HeaderTooltip from "./HeaderTooltip";

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

    const newItemButton = (
        <NewItemButton
            onClick={() => setModalShow(true)}
            {...{ t }}
        />
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
                <Trans
                    t={t}
                    i18nKey={"roleHeaderTooltip.content.administrator"}
                />
            </p>
            <p>
                <Trans
                    t={t}
                    i18nKey={"roleHeaderTooltip.content.collaborator"}
                />
            </p>
            <p>
                <Trans t={t} i18nKey={"roleHeaderTooltip.content.partner"} />
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
                <span className="status invited" />
                <Trans t={t} i18nKey={"statusHeaderTooltip.content.invited"} />
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
        userId: item.user_id,
        itemId: item.user_id,
        displayName: item.display_name || "",
        emailAddress: item.email_address || "",
        lastSeen: item.last_seen || null,
        role: item.role,
        status: item.status,
        creationTs: item.creation_ts * 1000,
    }));
