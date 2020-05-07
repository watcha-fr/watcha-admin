import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { useGet, useMutate } from "restful-react";
import { useTranslation } from "react-i18next";

import Button from "./NewItemButton";
import Date from "./Date";
import DelayedSpinner from "./DelayedSpinner";
import TableTab, { compareLowerCase } from "./TableTab";

import { useDispatchContext, useUserIdContext } from "./contexts";
import NewItemModal from "./NewItemModal";
import NewUserForm from "./NewUserForm";
import UserRightPanel from "./UserRightPanel";

const ns = "usersTab";

export default () => {
    const { t } = useTranslation(ns);

    const userId = useUserIdContext();
    const dispatch = useDispatchContext();

    const [userList, setUserList] = useState(null);
    const [intervalId, setIntervalId] = useState(null);
    const [rightPanel, setRightPanel] = useState(null);
    const [modalShow, setModalShow] = useState(false);
    const [feedback, setFeedback] = useState(null);

    const { data, refetch } = useGet({
        path: "watcha_user_list",
        lazy: true,
        resolve,
    });

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
                Header: t("headers.accountStatus"),
                accessor: "accountStatus",
                disableGlobalFilter: true,
                Cell: ({ value }) => (
                    <span className={value === 1 ? "active" : "inactive"}>
                        {t(`isActive.${value}`)}
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

    const button = useMemo(
        () => <Button onClick={() => setModalShow(true)} {...{ ns }} />,
        []
    );

    const submitFormRef = useRef();
    const bindSubmitForm = submitForm => {
        submitFormRef.current = submitForm;
    };

    const { mutate: post, loading } = useMutate({
        verb: "POST",
        path: "watcha_register",
    });

    const newItemModal = useMemo(() => {
        const onSubmit = data => {
            const userId = data.emailAddress.replace("@", "/");
            post({
                admin: data.isSynapseAdministrator ? "admin" : false,
                email: data.emailAddress,
                full_name: data.fullName,
                user: userId,
            })
                .then(response => {
                    setUserList([
                        ...userList,
                        {
                            userId,
                            displayName: data.fullName,
                            emailAddress: data.emailAddress,
                            lastSeen: null,
                            role: data.isSynapseAdministrator
                                ? "administrator"
                                : "collaborator",
                            accountStatus: 1,
                        },
                    ]);
                    setFeedback({ variant: "success", message: t("success") });
                })
                .catch(error =>
                    setFeedback({ variant: "danger", message: t("danger") })
                );
        };
        const onHide = () => {
            setModalShow(false);
            setFeedback(null);
        };
        return (
            <NewItemModal
                show={modalShow}
                title={t("usersTab:button")}
                onSave={() => submitFormRef.current()}
                onClick={() => setFeedback(null)}
                {...{ feedback, loading, onHide }}
            >
                <NewUserForm
                    {...{ userList, onSubmit, bindSubmitForm, feedback }}
                />
            </NewItemModal>
        );
    }, [modalShow, feedback, setFeedback, loading, userList, post, t]);

    const onClose = useCallback(() => setRightPanel(), []);

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
            {...{
                ns,
                columns,
                initialState,
                button,
                rightPanel,
                editUser,
                newItemModal,
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
        accountStatus: item.is_active,
    }));
