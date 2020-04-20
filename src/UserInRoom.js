import React from "react";

export default ({ onUserClicked, userName, simplifiedName }) => {
    const onClick = () => onUserClicked(userName);
    return <span {...{ onClick }}>{simplifiedName}</span>;
};
