import React from "react";
import PropTypes from "prop-types";

import "./css/Status.scss";

const Status = ({ status, t }) => <span className={`Status ${status}`} title={t(`status.${status}`)} />;

Status.propTypes = {
    status: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired,
};

export default Status;
