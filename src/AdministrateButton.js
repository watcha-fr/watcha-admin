import React from "react";
import Button from "react-bootstrap/Button";
import { useDispatchContext } from "./contexts";
import { useTranslation } from "react-i18next";

const ns = "dashboardTab";

export default ({ panelName, tabDestination }) => {
    const { t } = useTranslation(ns);

    const dispatch = useDispatchContext();

    const onClick = () => {
        dispatch({ tab: tabDestination });
    };

    return (
        <Button className="AdministrateButton" {...{onClick}}>
            {t(`${panelName}.administrateButton`)}
        </Button>
    );
};
