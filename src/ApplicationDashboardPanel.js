import React from "react";
import { useTranslation } from "react-i18next";
import Card from "react-bootstrap/Card";

import PanelRow from "./PanelRow";

import "./css/DashboardPanel.scss";

export default ({ applicationMetrics }) => {
    const { t } = useTranslation("dashboardTab");

    const {
        watcha_release,
        install_date,
        upgrade_date,
        disk,
    } = applicationMetrics;

    const diskMemoryUsed = Math.round(disk.used / 10 ** 9);

    return (
        <Card className="DashboardPanel">
            <Card.Header>
                <span>{t("applicationPanel.title")}</span>
            </Card.Header>
            <Card.Body className="DashboardPanel_body">
                <PanelRow
                    label={t("applicationPanel.version")}
                    value={watcha_release}
                />
                <PanelRow
                    label={t("applicationPanel.installDate")}
                    value={install_date}
                />
                <PanelRow
                    label={t("applicationPanel.upgradeDate")}
                    value={upgrade_date}
                />
                <PanelRow
                    label={t("applicationPanel.diskUsage")}
                    value={`${diskMemoryUsed} Go (${disk.percent}%)`}
                />
            </Card.Body>
        </Card>
    );
};
