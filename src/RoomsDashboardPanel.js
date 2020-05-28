import React from "react";
import { withTranslation } from "react-i18next";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { useDispatchContext } from "./contexts";

export default withTranslation()(({ t, datas, tab }) => {
    const dispatch = useDispatchContext();

    const onAdministrateLinkClick = () => dispatch({ tab });

    const contentPanel =
        datas.non_direct_rooms_count === 0 && datas.direct_rooms_count === 0 ? (
            <div className="noRoomsMessage">
                {t("dashboardTab:roomsPanel.noRoomsMessageOne")} <br></br>
                {t("dashboardTab:roomsPanel.noRoomsMessageTwo")}
            </div>
        ) : (
            <Card>
                <Card.Header>
                    <Card.Title>
                        {t("dashboardTab:roomsPanel.roomsPerType")}
                    </Card.Title>
                </Card.Header>
                <Card.Body>
                    <Table>
                        <tbody>
                            <tr
                                key={t(
                                    "dashboardTab:roomsPanel.nonDirectRoomsCount"
                                )}
                            >
                                <td className="sectionPanelLabel">
                                    {t(
                                        "dashboardTab:roomsPanel.nonDirectRoomsCount"
                                    )}
                                </td>
                                <td className="sectionPanelData">
                                    {`${datas.non_direct_rooms_count} / 
                                    ${datas.non_direct_active_rooms_count}`}
                                </td>
                            </tr>
                            <tr
                                key={t(
                                    "dashboardTab:roomsPanel.directRoomsCount"
                                )}
                            >
                                <td className="sectionPanelLabel">
                                    {t(
                                        "dashboardTab:roomsPanel.directRoomsCount"
                                    )}
                                </td>
                                <td className="sectionPanelData">
                                    {`${datas.direct_rooms_count} /
                                    ${datas.direct_active_rooms_count}`}
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        );

    return (
        <Card className="dashboardPanel">
            <Card.Header>
                <span>{t("roomsTab:title")}</span>
                <Button
                    className="dashboardAdministrateButton"
                    onClick={onAdministrateLinkClick}
                >
                    {t("dashboardTab:roomsPanel.administrateButton")}
                </Button>
            </Card.Header>
            <Card.Body>
                <Container fluid>
                    <Row
                        className="dashboardPanelSection"
                        key={t("dashboardTab:roomsPanel.roomsPerType")}
                    >
                        {contentPanel}
                    </Row>
                </Container>
            </Card.Body>
        </Card>
    );
});
