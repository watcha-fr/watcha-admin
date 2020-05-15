import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { useGet } from "restful-react";
import { useTranslation } from "react-i18next";

import { useDispatchContext, useUserIdContext } from "./contexts";
import Button from "./NewItemButton";
import Date from "./Date";
import DelayedSpinner from "./DelayedSpinner";
import NewUserModal from "./NewUserModal";
import TableTab, { compareLowerCase } from "./TableTab";
import UserRightPanel from "./UserRightPanel";

const ns = "usersTab";

export default () => {
    const { t } = useTranslation(ns);

    const userId = useUserIdContext();
    const dispatch = useDispatchContext();

    const [userList, setUserList] = useState(null);
    const [modalShow, setModalShow] = useState(false);
    const [rightPanel, setRightPanel] = useState(null);

    const { data, refetch } = useGet({
        path: "watcha_user_list",
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

    const onClose = () => setRightPanel();

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
    }, [userList, userId, dispatch]);

    const button = <Button onClick={() => setModalShow(true)} {...{ ns }} />;

    const newItemModal = (
        <NewUserModal {...{ modalShow, setModalShow, userList, setUserList }} />
    );

    const editUser = useCallback(
        user =>
            setRightPanel(user && <UserRightPanel {...{ user, onClose }} />),
        []
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

    return userList ? (
        <TableTab
            data={userList}
            {...{
                columns,
                initialState,
                button,
                newItemModal,
                editUser,
                rightPanel,
                ns,
            }}
        />
    ) : (
        <DelayedSpinner />
    );
};

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
        status: item.is_active === 1 ? "active" : "inactive",
        creationTs: item.creation_ts * 1000,
    }));
