import React from "react";

function BooleanRow({ selected, value }) {
    let mark;
    if (selected !== "rowSelected") {
        if (value) {
            mark = <i className="fas fa-check trueBoolean"></i>;
        } else {
            mark = <i className="fas fa-times falseBoolean"></i>;
        }
    } else {
        if (value) {
            mark = <i className="fas fa-check"></i>;
        } else {
            mark = <i className="fas fa-times"></i>;
        }
    }

    return <span>{mark}</span>;
}

export default BooleanRow;
