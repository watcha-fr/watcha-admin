import React from "react";
import classNames from "classnames";

function BooleanRow({ selected, value }) {
    const rowSelected = selected === "rowSelected";
    return (
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
}

export default BooleanRow;
