import React from "react";
import { withTranslation } from "react-i18next";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

export default withTranslation()(({ t, datas }) => {
    return (
        <Card className="dashboardPanel">
            <Card.Header>
                <span>{t("dashboardTab:serverStatePannel:title")}</span>
            </Card.Header>
            <Card.Body>
                <Container fluid>
                    <Row
                        className="dashboardPanelSection"
                        key={t("dashboardTab:serverStatePannel:title")}
                    >
                        <Table>
                            <tbody>
                                <tr
                                    key={t(
                                        "dashboardTab:serverStatePannel.version"
                                    )}
                                >
                                    <td className="sectionPanelLabel">
                                        {t(
                                            "dashboardTab:serverStatePannel.version"
                                        )}
                                    </td>
                                    <td className="sectionPanelData">
                                        {datas.watcha_release}
                                    </td>
                                </tr>
                                <tr
                                    key={t(
                                        "dashboardTab:serverStatePannel.installDate"
                                    )}
                                >
                                    <td className="sectionPanelLabel">
                                        {t(
                                            "dashboardTab:serverStatePannel.installDate"
                                        )}
                                    </td>
                                    <td className="sectionPanelData">
                                        {datas.install_date}
                                    </td>
                                </tr>
                                <tr
                                    key={t(
                                        "dashboardTab:serverStatePannel.upgradeDate"
                                    )}
                                >
                                    <td className="sectionPanelLabel">
                                        {t(
                                            "dashboardTab:serverStatePannel.upgradeDate"
                                        )}
                                    </td>
                                    <td className="sectionPanelData">
                                        {datas.upgrade_date}
                                    </td>
                                </tr>
                                <tr
                                    key={t(
                                        "dashboardTab:serverStatePannel.diskUsage"
                                    )}
                                >
                                    <td className="sectionPanelLabel">
                                        {t(
                                            "dashboardTab:serverStatePannel.diskUsage"
                                        )}
                                    </td>
                                    <td className="sectionPanelData">
                                        {`${Math.round(
                                            datas.disk.used / 1000000000
                                        )} Go  (${datas.disk.percent}%)`}
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                    </Row>
                </Container>
            </Card.Body>
        </Card>
    );
});
