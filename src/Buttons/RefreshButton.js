import React from "react";
import Button from "react-bootstrap/Button";

export default ({ variant, onClick }) => (
    <Button className="refreshButton" {...{ variant, onClick }}>
        <i className="fas fa-sync-alt"></i>
    </Button>
);
