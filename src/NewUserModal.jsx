import React, { useRef, useState } from "react";
import PropTypes from "prop-types";

import { useMutate } from "restful-react";
import { useTranslation } from "react-i18next";

import NewItemModal from "./NewItemModal";
import NewUserForm from "./NewUserForm";

const NewUserModal = ({ modalShow, setModalShow, userList, newUserLocalEcho }) => {
    const { t } = useTranslation("usersTab");

    const [feedback, setFeedback] = useState(null);

    const { mutate: post, loading } = useMutate({
        verb: "POST",
        path: "watcha_register",
    });

    const makePayload = data => ({
        admin: data.isSynapseAdministrator,
        email: data.emailAddress,
    });

    const genRandomString = () => Math.floor(Math.random() * 1000000).toString();

    const makeUser = data => ({
        userId: genRandomString(),
        displayName: "",
        emailAddress: data.emailAddress,
        lastSeen: null,
        role: data.isSynapseAdministrator ? "administrator" : "collaborator",
        status: "active",
    });

    const onSubmit = data => {
        const payload = makePayload(data);
        post(payload)
            .then(() => {
                const user = makeUser(data);
                newUserLocalEcho(user);
                setFeedback({ variant: "success", message: t("success") });
            })
            .catch(() => {
                setFeedback({ variant: "danger", message: t("danger") });
            });
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
            onSave={() => {
                submitFormRef.current();
            }}
            onClick={() => {
                setFeedback(null);
            }}
            {...{ feedback, loading, onHide }}
        >
            <NewUserForm {...{ userList, onSubmit, bindSubmitForm, feedback }} />
        </NewItemModal>
    );
};

NewUserModal.defaultProps = {
    userList: null,
};

NewUserModal.propTypes = {
    modalShow: PropTypes.bool.isRequired,
    setModalShow: PropTypes.func.isRequired,
    userList: PropTypes.arrayOf(
        PropTypes.shape({
            userId: PropTypes.string.isRequired,
            itemId: PropTypes.string,
            displayName: PropTypes.string.isRequired,
            emailAddress: PropTypes.string.isRequired,
            lastSeen: PropTypes.number,
            role: PropTypes.string.isRequired,
            creationTs: PropTypes.number,
        })
    ),
    newUserLocalEcho: PropTypes.func.isRequired,
};

export default NewUserModal;
