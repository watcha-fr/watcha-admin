import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import Modal from "react-bootstrap/Modal";
import styled from "styled-components";

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
                {show && <NewRoomIframe src="/#/new" />}
            </Modal>
        );
    }
}

const NewRoomIframe = styled.iframe`
    width: 510px;
    height: 306px;
    border: 0;
`;

export default withTranslation("roomsTab")(NewRoomModal);
