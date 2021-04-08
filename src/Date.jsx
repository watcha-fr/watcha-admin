import React from "react";
import PropTypes from "prop-types";

import moment from "moment";

const Date = ({ timestamp }) => {
    const m = moment(timestamp);
    const shortDate = m.format("L");
    const fullDate = m.format("LLLL");
    return <span title={fullDate}>{shortDate}</span>;
};

Date.propTypes = {
    timestamp: PropTypes.number.isRequired,
};

export default Date;
