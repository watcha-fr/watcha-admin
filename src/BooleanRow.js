import React from "react";
import classNames from "classnames";

export default ({ rowSelected, value }) => (
    <span>
        <i
            className={classNames("fas", {
                "fa-check": value,
                "fa-times": !value,
                trueBoolean: !rowSelected && value,
                falseBoolean: !rowSelected && !value,
            })}
        ></i>
    </span>
);
