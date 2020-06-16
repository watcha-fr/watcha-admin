import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import Button from "react-bootstrap/Button";

export default ({ variant, onClick }) => (
    <Button className="refreshButton" {...{ variant, onClick }}>
        <FontAwesomeIcon icon={faSyncAlt} />
    </Button>
);
