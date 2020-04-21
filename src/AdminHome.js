import React, { useState } from "react";
import { withTranslation } from "react-i18next";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

import DataToTable from "./DataToTable";
// import Monitoring from './Monitoring';
import StatsTab from "./StatsTab";

export default withTranslation()(({ t }) => {
    const [key, setKey] = useState("dashboard");
    const [userId, setUserId] = useState(null);

    const onSelect = key => setKey(key);

    const changeTab = (key, userId) => {
        setKey(key);
        userId && setUserId(userId);
    };

    return (
        <Tabs id="tabs" activeKey={key} {...{ onSelect }}>
            <Tab eventKey="dashboard" title={t("Overview")}>
                <StatsTab
                    {...{ changeTab }}
                />
            </Tab>
            <Tab eventKey="users" title={t("Users")}>
                <DataToTable
                    tableName="user"
                    {...{ changeTab, userId }}
                />
            </Tab>
            <Tab eventKey="rooms" title={t("Rooms")}>
                <DataToTable
                    tableName="room"
                    {...{ changeTab }}
                />
            </Tab>
            {/* not functional yet
            <Tab eventKey="monitoring" title={t("Monitoring")}>
                <Monitoring />
            </Tab> */}
        </Tabs>
    );
});
