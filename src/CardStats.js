import React from "react";
import { withTranslation } from "react-i18next";
import Card from "react-bootstrap/Card";

import { useDispatchContext } from "./contexts";
import AdminCardStats from "./AdminCardStats";

export default withTranslation()(({ title, tab, lines, t }) => {
    const dispatch = useDispatchContext();

    const onCardClicked = () => dispatch({ tab });

    const onUserClicked = userId => dispatch({ tab: "users", userId });

    const getPanelContent = lines => {
        const panelContent = [];
        for (const LINE in lines) {
            if ({}.hasOwnProperty.call(lines, LINE)) {
                if (lines[LINE].label === t("Admin")) {
                    const admins = [];
                    const profileInfosOfAdmins = lines[LINE].data;
                    for (const profileInfo of profileInfosOfAdmins) {
                        admins.push(
                            <div key={profileInfo["user_id"]}>
                                <AdminCardStats
                                    displayName={setAdminName(
                                        profileInfo["displayname"],
                                        profileInfo["user_id"]
                                    )}
                                    email={profileInfo["email"]}
                                    {...{ onUserClicked}}
                                    adminUserId={profileInfo["user_id"]}
                                />
                            </div>
                        );
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

    const setAdminName = (displayName, userId) => {
        return displayName || userId.replace("@", "").split(":")[0]
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
