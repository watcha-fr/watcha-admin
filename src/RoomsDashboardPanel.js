import React from "react";
import { Trans, useTranslation } from "react-i18next";
import Card from "react-bootstrap/Card";

import AdministrateButton from "./AdministrateButton";
import LabelTooltip from "./LabelTooltip";
import PanelRow from "./PanelRow";

import "./css/DashboardPanel.scss";

export default ({ roomsMetrics }) => {
    const { t } = useTranslation("dashboardTab");

    const {
        regular_room_count,
        dm_room_count,
        active_regular_room_count,
    } = roomsMetrics;

    const regularRoomPopoverContent = [
        "roomsTab:typeHeaderTooltip.content.regularRoom",
    ].map(i18nKey => (
        <p>
            <Trans t={t} i18nKey={i18nKey} key={i18nKey} />
        </p>
    ));

    const activeRegularRoomPopoverContent = [
        "roomsTab:typeHeaderTooltip.content.regularRoom",
        "roomsTab:statusHeaderTooltip.content.active",
    ].map(i18nKey => (
        <p>
            <Trans t={t} i18nKey={i18nKey} key={i18nKey} />
        </p>
    ));

    return (
        <Card className="DashboardPanel">
            <Card.Header>
                <span>{t("roomsPanel.title")}</span>
                <AdministrateButton targetTab="rooms">
                    {t("roomsPanel.administrateButton")}
                </AdministrateButton>
            </Card.Header>
            <Card.Body className="DashboardPanel_body">
                {regular_room_count === 0 && dm_room_count === 0 ? (
                    <div className="DashboardPanel_noRoomMessage">
                        <Trans t={t} i18nKey={"roomsPanel.noRoomsMessage"} />
                    </div>
                ) : (
                    <>
                        <PanelRow
                            label={
                                <>
                                    {t("roomsPanel.activeRegularRoomCount")}
                                    <LabelTooltip
                                        popoverContent={
                                            regularRoomPopoverContent
                                        }
                                    />
                                </>
                            }
                            value={active_regular_room_count}
                        />
                        <PanelRow
                            label={
                                <>
                                    {t("roomsPanel.regularRoomCount")}
                                    <LabelTooltip
                                        popoverContent={
                                            activeRegularRoomPopoverContent
                                        }
                                    />
                                </>
                            }
                            value={regular_room_count}
                        />
                    </>
                )}
            </Card.Body>
        </Card>
    );
};
