import React from "react";
import { useTranslation } from "react-i18next";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";

import Alert from "./Alert";

export default props => {
    const { t } = useTranslation();

    const { feedback, loading, show, title, onHide, onSave, children } = props;

    const footer = feedback ? (
        <Alert
            variant={feedback.variant}
            message={feedback.message}
            {...{ onHide }}
        />
    ) : (
        <>
            <Button onClick={onHide} variant="secondary">
                {t("cancel")}
            </Button>
            {loading ? (
                <Button variant="primary" disabled>
                    <span className="flex-grow-1">{t("save")}</span>
                    <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                    />
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
