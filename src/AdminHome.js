import React, { useState } from "react";
import { withTranslation } from "react-i18next";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

import DataToTable from "./DataToTable";
// import Monitoring from './Monitoring';
import StatsTab from "./StatsTab";

export default withTranslation()(({ t }) => {
    const [key, setKey] = useState(1);
    const [userId, setUserId] = useState(null);

    const onSelect = key => setKey(key);

    const onTabSelected = (key, userId) => {
        setKey(key);
        userId && setUserId(userId);
    };

    return (
        <Tabs id="tabs" activeKey={key} {...{ onSelect }}>
            <Tab eventKey={1} title={t("Overview")}>
                <StatsTab
                    {...{ onTabSelected }}
                />
            </Tab>
            <Tab eventKey={2} title={t("Users")}>
                <DataToTable
                    tableName="user"
                    value={userId}
                    {...{ onTabSelected }}
                />
            </Tab>
            <Tab eventKey={3} title={t("Rooms")}>
                <DataToTable
                    tableName="room"
                    {...{ onTabSelected }}
                />
            </Tab>
            {/* not functional yet
            <Tab eventKey={4} title={t("Monitoring")}>
                <Monitoring />
            </Tab> */}
        </Tabs>
    );
});
