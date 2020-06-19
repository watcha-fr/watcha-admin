import React from "react";
import { Trans, useTranslation } from "react-i18next";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";

import PanelRow from "./PanelRow";

import "./css/DashboardPanel.scss";

const ns = "dashboardTab";

export default ({ roomsPanelInformations, children }) => {
    const { t } = useTranslation([ns]);

    return (
        <Card className="DashboardPanel">
            <Card.Header>
                <span>{t("roomsPanel.title")}</span>
                {children}
            </Card.Header>
            <Card.Body>
                {roomsPanelInformations.non_direct_rooms_count === 0 &&
                roomsPanelInformations.direct_rooms_count === 0 ? (
                    <div>
                        <Trans t={t} i18nKey={"roomsPanel.noRoomsMessage"} />
                    </div>
                ) : (
                    <Row className="DashboardPanel_body">
                        <PanelRow
                            label={t("roomsPanel.nonDirectRoomsCount")}
                            value={`${roomsPanelInformations.non_direct_active_rooms_count} / ${roomsPanelInformations.non_direct_rooms_count}`}
                        />
                        <PanelRow
                            label={t("roomsPanel.directRoomsCount")}
                            value={`${roomsPanelInformations.direct_active_rooms_count} / ${roomsPanelInformations.direct_rooms_count}`}
                        />
                    </Row>
                )}
            </Card.Body>
        </Card>
    );
};
