import React from "react";
import Button from "react-bootstrap/Button";
import { useDispatchContext } from "./contexts";

export default ({ children, tabDestination }) => {
    const dispatch = useDispatchContext();

    const onClick = () => {
        dispatch({ tab: tabDestination });
    };

    return (
        <Button className="AdministrateButton" {...{ onClick }}>
            {children}
        </Button>
    );
};
