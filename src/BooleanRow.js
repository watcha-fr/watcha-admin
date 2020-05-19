import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";

export default ({ rowSelected, value }) => (
    <span>
        <FontAwesomeIcon
            className={
                !rowSelected && value
                    ? "trueBoolean"
                    : !rowSelected && !value
                    ? "falseBoolean"
                    : undefined
            }
            icon={value ? faCheck : faTimes}
        />
    </span>
);
