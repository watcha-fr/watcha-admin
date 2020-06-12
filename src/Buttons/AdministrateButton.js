import React from "react";
import { useTranslation } from "react-i18next";
import Button from "react-bootstrap/Button";
import { useDispatchContext } from "../contexts";

const ns = "dashboardTab";

export default ({ panelName, tabDestination }) => {
    const { t } = useTranslation(ns);
    
    const dispatch = useDispatchContext();

    const onClick = () => dispatch({ tabDestination });

    return (
        <Button className="administrateButton" onClick={() => onClick}>
            {t(`${panelName}.administrateButton`)}
        </Button>
    );
};
