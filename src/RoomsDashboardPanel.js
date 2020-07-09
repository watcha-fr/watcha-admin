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
        non_direct_rooms_count,
        direct_rooms_count,
        non_direct_active_rooms_count,
        direct_active_rooms_count,
    } = roomsMetrics;

    const nonDirectRoomPopoverContent = [
        "roomsTab:typeHeaderTooltip.content.multiple",
        "roomsTab:statusHeaderTooltip.content.active",
    ].map(i18nKey => (
        <p>
            <Trans t={t} i18nKey={i18nKey} key={i18nKey} />
        </p>
    ));

    const directRoomPopoverContent = [
        "roomsTab:typeHeaderTooltip.content.personnal",
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
                {non_direct_rooms_count === 0 && direct_rooms_count === 0 ? (
                    <div className="DashboardPanel_noRoomMessage">
                        <Trans t={t} i18nKey={"roomsPanel.noRoomsMessage"} />
                    </div>
                ) : (
                    <>
                        <PanelRow
                            label={
                                <>
                                    {t("roomsPanel.nonDirectRoomsCount")}
                                    <LabelTooltip
                                        popoverContent={
                                            nonDirectRoomPopoverContent
                                        }
                                    />
                                </>
                            }
                            value={`${non_direct_active_rooms_count} / ${non_direct_rooms_count}`}
                        />
                        <PanelRow
                            label={
                                <>
                                    {t("roomsPanel.directRoomsCount")}
                                    <LabelTooltip
                                        popoverContent={
                                            directRoomPopoverContent
                                        }
                                    />
                                </>
                            }

                            value={`${direct_active_rooms_count} / ${direct_rooms_count}`}
                        />
                    </>
                )}
            </Card.Body>
        </Card>
    );
};
