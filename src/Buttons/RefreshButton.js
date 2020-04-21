import React from "react";
import Button from "react-bootstrap/Button";

function RefreshButton({ variant, onClick }) {
    return (
        <Button className="refreshButton" {...{ variant, onClick }}>
            <i className="fas fa-sync-alt"></i>
        </Button>
    );
}

export default RefreshButton;
