import React from "react";
import { useTranslation } from "react-i18next";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";

import PanelRow from "./PanelRow";

import "./css/DashboardPanel.scss";

export default ({ applicationPanelInformations }) => {
    const { t } = useTranslation("dashboardTab");

    const getDiskMemoryUsed = diskUsed => Math.round(diskUsed / 1000000000);

    return (
        <Card className="DashboardPanel">
            <Card.Header>
                <span>{t("applicationPanel.title")}</span>
            </Card.Header>
            <Card.Body>
                <Row className="DashboardPanel_body">
                    <PanelRow
                        label={t("applicationPanel.version")}
                        value={applicationPanelInformations.watcha_release}
                    />
                    <PanelRow
                        label={t("applicationPanel.installDate")}
                        value={applicationPanelInformations.install_date}
                    />
                    <PanelRow
                        label={t("applicationPanel.upgradeDate")}
                        value={applicationPanelInformations.upgrade_date}
                    />
                    <PanelRow
                        label={t("applicationPanel.diskUsage")}
                        value={`${getDiskMemoryUsed(
                            applicationPanelInformations.disk.used
                        )} Go  (${applicationPanelInformations.disk.percent}%)`}
                    />
                </Row>
            </Card.Body>
        </Card>
    );
};
