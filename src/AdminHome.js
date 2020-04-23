import React, { useState } from "react";
import { withTranslation } from "react-i18next";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

import { ChangeTabContext } from "./contexts";
import DashboardTab from "./DashboardTab";
// import MonitoringTab from './MonitoringTab';
import RoomsTab from "./RoomsTab";
import UsersTab from "./UsersTab";

export default withTranslation()(({ t }) => {
    const [key, setKey] = useState("dashboard");
    const [userId, setUserId] = useState(null);

    const onSelect = key => setKey(key);

    const changeTab = (key, userId) => {
        setKey(key);
        userId && setUserId(userId);
    };

    return (
        <ChangeTabContext.Provider value={changeTab}>
            <Tabs id="tabs" activeKey={key} {...{ onSelect }}>
                <Tab eventKey="dashboard" title={t("dashboardTab.title")}>
                    <DashboardTab />
                </Tab>
                <Tab eventKey="users" title={t("usersTab.title")}>
                    <UsersTab {...{ userId }} />
                </Tab>
                <Tab eventKey="rooms" title={t("roomsTab.title")}>
                    <RoomsTab />
                </Tab>
                {/* not functional yet
                <Tab eventKey="monitoring" title={t("monitoringTab.title")}>
                    <MonitoringTab />
                </Tab> */}
            </Tabs>
        </ChangeTabContext.Provider>
    );
});
