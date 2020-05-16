import React from "react";
import moment from "moment";

export default ({ timestamp }) => {
    const m = moment(timestamp);
    const shortDate = m.format("L");
    const fullDate = m.format("LLLL");
    return <span title={fullDate}>{shortDate}</span>;
};
