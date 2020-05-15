import React, { useRef, useState } from "react";
import { useMutate } from "restful-react";
import { useTranslation } from "react-i18next";

import NewItemModal from "./NewItemModal";
import NewUserForm from "./NewUserForm";

export default ({ modalShow, setModalShow, userList, newUserLocalEcho }) => {
    const { t } = useTranslation("usersTab");

    const [feedback, setFeedback] = useState(null);

    const { mutate: post, loading } = useMutate({
        verb: "POST",
        path: "watcha_register",
    });

    const onSubmit = data => {
        const payload = makePayload(data);
        post(payload)
            .then(response => {
                const user = makeUser(data);
                newUserLocalEcho(user);
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

    const submitFormRef = useRef();
    const bindSubmitForm = submitForm => {
        submitFormRef.current = submitForm;
    };

    return (
        <NewItemModal
            show={modalShow}
            title={t("button")}
            onSave={() => submitFormRef.current()}
            onClick={() => setFeedback(null)}
            {...{ feedback, loading, onHide }}
        >
            <NewUserForm
                {...{ userList, onSubmit, bindSubmitForm, feedback }}
            />
        </NewItemModal>
    );
};

const makePayload = data => ({
    admin: data.isSynapseAdministrator ? "admin" : false,
    email: data.emailAddress,
    full_name: data.fullName,
    user: computeUserIdFromEmailAddress(data.emailAddress),
});

const makeUser = data => ({
    userId: computeUserIdFromEmailAddress(data.emailAddress),
    displayName: data.fullName,
    emailAddress: data.emailAddress,
    lastSeen: null,
    role: data.isSynapseAdministrator ? "administrator" : "collaborator",
    status: "active",
});

const computeUserIdFromEmailAddress = emailAddress =>
    emailAddress
        .replace("@", "/")
        .normalize("NFKD")
        .replace(/[\u0300-\u036F]/g, "")
        .toLowerCase()
        .replace(/[^\w=\-./]/g, "");
