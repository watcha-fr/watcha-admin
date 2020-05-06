import React from "react";
import { useTranslation } from "react-i18next";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default ({ show, title, onHide, onSave, children }) => {
    const { t } = useTranslation();
    return (
        <Modal aria-labelledby="newItemModal" centered {...{ show, onHide }}>
            <Modal.Header closeButton>
                <Modal.Title id="newItemModal">{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{children}</Modal.Body>
            <Modal.Footer>
                <Button onClick={onHide} variant="secondary">
                    {t("cancel")}
                </Button>
                <Button onClick={onSave} variant="primary">
                    {t("save")}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
