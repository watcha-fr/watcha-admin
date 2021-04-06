import React from "react";
import Spinner from "react-bootstrap/Spinner";

import "./css/DelayedSpinner.scss";

export default () => (
    <div className="delayed fullCentered">
        <Spinner animation="border" variant="primary" role="status" aria-hidden="true" />
    </div>
);
