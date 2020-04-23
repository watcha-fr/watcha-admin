import React, { useState } from "react";
import { withTranslation } from "react-i18next";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

import { ChangeTabContext } from "./contexts";
import DataToTable from "./DataToTable";
// import Monitoring from './Monitoring';
import DashboardTab from "./DashboardTab";

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
                    <DataToTable tableName="user" {...{ userId }} />
                </Tab>
                <Tab eventKey="rooms" title={t("roomsTab.title")}>
                    <DataToTable tableName="room" />
                </Tab>
                {/* not functional yet
                <Tab eventKey="monitoring" title={t("monitoringTab.title")}>
                    <Monitoring />
                </Tab> */}
            </Tabs>
        </ChangeTabContext.Provider>
    );
});
