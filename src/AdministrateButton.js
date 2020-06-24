import React from "react";
import Button from "react-bootstrap/Button";

import { useDispatchContext } from "./contexts";

export default ({ children, targetTab }) => {
    const dispatch = useDispatchContext();

    const onClick = () => {
        dispatch({ tab: targetTab });
    };

    return (
        <Button className="AdministrateButton" {...{ onClick }}>
            {children}
        </Button>
    );
};
