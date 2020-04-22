import React from "react";
import { withTranslation } from "react-i18next";
import Card from "react-bootstrap/Card";

import AdminCardStats from "./AdminCardStats";

export default withTranslation()(({ title, changeTab, tab, lines, t }) => {
    const onCardClicked = () => changeTab(tab);

    const onUserClicked = userId => changeTab("users", userId);

    const getPanelContent = lines => {
        const panelContent = [];
        for (const LINE in lines) {
            if ({}.hasOwnProperty.call(lines, LINE)) {
                if (lines[LINE].label === t("Admin")) {
                    const admins = [];
                    for (const data in lines[LINE].data) {
                        if (lines[LINE].data.hasOwnProperty(data)) {
                            admins.push(
                                <div
                                    key={lines[LINE].data[data]}
                                    adminname={lines[LINE].data[data]}
                                >
                                    <AdminCardStats
                                        simplifiedname={simplifiedUserId(
                                            lines[LINE].data[data]
                                        )}
                                        onUserClicked={onUserClicked}
                                        adminName={lines[LINE].data[data]}
                                    />
                                </div>
                            );
                        }
                    }
                    panelContent.push(
                        <div key={lines[LINE].label}>
                            {" "}
                            {t("Administrators")}: {admins}{" "}
                        </div>
                    );
                } else {
                    panelContent.push(
                        <div key={lines[LINE].label}>
                            {lines[LINE].label + ": " + lines[LINE].data}
                        </div>
                    );
                }
            }
        }
        return panelContent;
    };

    const simplifiedUserId = fulluserId => {
        let simplifiedUserId = fulluserId[0].replace("@", "");
        simplifiedUserId = simplifiedUserId.split(":");
        simplifiedUserId = simplifiedUserId[0];
        return simplifiedUserId;
    };

    const PANEL_CONTENT = getPanelContent(lines);

    return (
        <Card className="statsPanel">
            <Card.Header>
                <span className="StatsTitle" onClick={onCardClicked}>
                    {title}
                </span>
            </Card.Header>
            <Card.Body>
                <div className="statsPanelContent">
                    <div>{PANEL_CONTENT}</div>
                </div>
            </Card.Body>
        </Card>
    );
});
