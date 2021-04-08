import React from "react";
import PropTypes from "prop-types";

import { useTranslation } from "react-i18next";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";

import Alert from "./Alert";

const NewItemModal = ({ feedback, onClick, loading, show, title, onHide, onSave, children }) => {
    const { t } = useTranslation();

    const footer = feedback ? (
        <Alert variant={feedback.variant} message={feedback.message} {...{ onClick }} />
    ) : (
        <>
            <Button onClick={onHide} variant="secondary">
                {t("cancel")}
            </Button>
            {loading ? (
                <Button variant="primary" disabled>
                    <span className="flex-grow-1">{t("save")}</span>
                    <Spinner className="ml-2" as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                </Button>
            ) : (
                <Button variant="primary" onClick={onSave}>
                    {t("save")}
                </Button>
            )}
        </>
    );

    return (
        <Modal aria-labelledby="newItemModal" centered {...{ show, onHide }}>
            <Modal.Header closeButton>
                <Modal.Title id="newItemModal">{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{children}</Modal.Body>
            <Modal.Footer>{footer}</Modal.Footer>
        </Modal>
    );
};

NewItemModal.defaultProps = {
    feedback: null,
};

NewItemModal.propTypes = {
    feedback: PropTypes.shape({
        variant: PropTypes.string.isRequired,
        message: PropTypes.string.isRequired,
    }),
    onClick: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    show: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    onHide: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    children: PropTypes.element.isRequired,
};

export default NewItemModal;
