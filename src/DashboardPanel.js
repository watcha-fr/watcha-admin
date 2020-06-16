import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatchContext } from "./contexts";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import PanelRow from "./PanelRow";
import PanelSection from "./PanelSection";
import AdministrateButton from "./Buttons/AdministrateButton";

const ns = "dashboardTab";

export default ({
    panelName,
    panelInformations,
    administrateButtonTabDestination,
}) => {
    const { t } = useTranslation(ns);

    const dispatch = useDispatchContext();

    const onAdministratebuttonClick = () => {
        dispatch({ administrateButtonTabDestination });
    };

    const roomPanelContent =
        panelInformations.non_direct_rooms_count === 0 &&
        panelInformations.direct_rooms_count === 0 ? (
            <div className="noRoomsMessage">
                {t(`${panelName}.noRoomsMessageOne`)} <br></br>
                {t(`${panelName}.noRoomsMessageTwo`)}
            </div>
        ) : (
            <tbody>
                <PanelRow
                    label={t(`${panelName}.nonDirectRoomsCount`)}
                    value={`${panelInformations.non_direct_active_rooms_count} / ${panelInformations.non_direct_rooms_count}`}
                />
                <PanelRow
                    label={t(`${panelName}.directRoomsCount`)}
                    value={`${panelInformations.direct_active_rooms_count} / ${panelInformations.direct_rooms_count}`}
                />
            </tbody>
        );

    const serverStatePanelContent = (
        <tbody>
            <PanelRow
                label={t(`${panelName}.version`)}
                value={`${panelInformations.watcha_release}`}
            />
            <PanelRow
                label={t(`${panelName}.installDate`)}
                value={`${panelInformations.install_date}`}
            />
            <PanelRow
                label={t(`${panelName}.upgradeDate`)}
                value={`${panelInformations.upgrade_date}`}
            />
            {/* <PanelRow
                label={t(`${panelName}.diskUsage`)}
                value={`${Math.round(
                    panelInformations.disk.used / 1000000000
                )} Go  (${panelInformations.disk.percent}%)`}
            /> */}
        </tbody>
    );

    const usersPanelContent = (
        <Row className="panelSection">
            <PanelSection
                panelSectionName="usersPerRole"
                panelSectionInformations={panelInformations.users_per_role}
                administratorList={panelInformations.administrators_users}
            />
            <PanelSection
                panelSectionName="connectedUsers"
                panelSectionInformations={panelInformations.connected_users}
            />
            <PanelSection
                panelSectionName="otherStatistics"
                panelSectionInformations={panelInformations.other_statistics}
            />
        </Row>
    );

    return (
        <Card className="dashboardPanel">
            <Card.Header>
                <span>{t(`${panelName}.title`)}</span>
                {administrateButtonTabDestination && (
                    <AdministrateButton
                        panelName={panelName}
                        onClick={onAdministratebuttonClick}
                    />
                )}
            </Card.Header>
            <Card.Body>
                <Container fluid>
                    <Table>
                        {panelName === "roomsPanel" && roomPanelContent}
                        {panelName === "serverStatePanel" &&
                            serverStatePanelContent}
                        {panelName === "usersPanel" && usersPanelContent}
                    </Table>
                </Container>
            </Card.Body>
        </Card>
    );
};
