import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import Modal from "react-bootstrap/Modal";

import "./css/NewRoomModal.scss";

class NewRoomModal extends Component {
    componentDidUpdate(prevProps) {
        const { onHide, newRoomLocalEcho } = prevProps;
        window.onstorage = event => {
            if (event.key === "watcha_create_room") {
                const roomProperties = event.newValue;
                if (roomProperties === "null") {
                    onHide();
                } else if (roomProperties) {
                    newRoomLocalEcho(JSON.parse(roomProperties));
                    onHide();
                }
            }
        };
    }

    render() {
        const { show, onHide, t } = this.props;
        return (
            <Modal centered aria-label={t("button")} {...{ show, onHide }}>
                {show && (
                    <iframe
                        className="newRoomIframe"
                        title="Nextcloud"
                        src="/app/#/new"
                    />
                )}
            </Modal>
        );
    }
}

export default withTranslation("roomsTab")(NewRoomModal);
