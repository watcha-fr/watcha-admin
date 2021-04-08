import React from "react";
import PropTypes from "prop-types";

import { useTranslation } from "react-i18next";
import Card from "react-bootstrap/Card";

import PanelRow from "./PanelRow";

import "./css/DashboardPanel.scss";

const ApplicationMetrics = ({ applicationMetrics }) => {
    const { t } = useTranslation("dashboardTab");

    // eslint-disable-next-line camelcase
    const { watcha_release, install_date, upgrade_date, disk_usage } = applicationMetrics;

    return (
        <Card className="DashboardPanel">
            <Card.Header>
                <span>{t("applicationPanel.title")}</span>
            </Card.Header>
            <Card.Body className="DashboardPanel_body">
                {/* eslint-disable camelcase */}
                <PanelRow label={t("applicationPanel.version")} value={watcha_release} />
                <PanelRow label={t("applicationPanel.installDate")} value={install_date} />
                <PanelRow label={t("applicationPanel.upgradeDate")} value={upgrade_date} />
                <PanelRow label={t("applicationPanel.diskUsage")} value={disk_usage} />
                {/* eslint-enable camelcase */}
            </Card.Body>
        </Card>
    );
};

ApplicationMetrics.propTypes = {
    applicationMetrics: PropTypes.shape({
        disk_usage: PropTypes.string,
        watcha_release: PropTypes.string,
        upgrade_date: PropTypes.string,
        install_date: PropTypes.string,
    }).isRequired,
};

export default ApplicationMetrics;
