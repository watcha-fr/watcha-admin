import React from "react";
import PropTypes from "prop-types";

import { Trans, useTranslation } from "react-i18next";
import Card from "react-bootstrap/Card";

import LabelTooltip from "./LabelTooltip";
import PanelRow from "./PanelRow";

import "./css/DashboardPanel.scss";

const RoomsDashboardPanel = ({ roomsMetrics }) => {
    const { t } = useTranslation("dashboardTab");

    // eslint-disable-next-line camelcase
    const { regular_room_count, dm_room_count, active_regular_room_count } = roomsMetrics;

    const regularRoomPopoverContent = ["roomsTab:typeHeaderTooltip.content.regularRoom"].map(i18nKey => (
        <p key={i18nKey}>
            <Trans t={t} i18nKey={i18nKey} />
        </p>
    ));

    const activeRegularRoomPopoverContent = [
        "roomsTab:typeHeaderTooltip.content.regularRoom",
        "roomsTab:statusHeaderTooltip.content.active",
    ].map(i18nKey => (
        <p key={i18nKey}>
            <Trans t={t} i18nKey={i18nKey} />
        </p>
    ));

    return (
        <Card className="DashboardPanel">
            <Card.Header>
                <span>{t("roomsPanel.title")}</span>
            </Card.Header>
            <Card.Body className="DashboardPanel_body">
                {/* eslint-disable-next-line camelcase */}
                {regular_room_count === 0 && dm_room_count === 0 ? (
                    <div className="DashboardPanel_noRoomMessage">
                        <Trans t={t} i18nKey="roomsPanel.noRoomsMessage" />
                    </div>
                ) : (
                    <>
                        <PanelRow
                            label={
                                <>
                                    {t("roomsPanel.activeRegularRoomCount")}
                                    <LabelTooltip popoverContent={regularRoomPopoverContent} />
                                </>
                            }
                            // eslint-disable-next-line camelcase
                            value={active_regular_room_count}
                        />
                        <PanelRow
                            label={
                                <>
                                    {t("roomsPanel.regularRoomCount")}
                                    <LabelTooltip popoverContent={activeRegularRoomPopoverContent} />
                                </>
                            }
                            // eslint-disable-next-line camelcase
                            value={regular_room_count}
                        />
                    </>
                )}
            </Card.Body>
        </Card>
    );
};

RoomsDashboardPanel.propTypes = {
    roomsMetrics: PropTypes.shape({
        dm_room_count: PropTypes.number.isRequired,
        active_dm_room_count: PropTypes.number.isRequired,
        regular_room_count: PropTypes.number.isRequired,
        active_regular_room_count: PropTypes.number.isRequired,
    }).isRequired,
};

export default RoomsDashboardPanel;
