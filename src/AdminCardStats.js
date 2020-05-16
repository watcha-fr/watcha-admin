import React from "react";

export default ({ onUserClicked, adminName, simplifiedname }) => {
    const onClick = () => onUserClicked(adminName[0]);
    return (
        <div className="AdminName" {...{ onClick }}>
            {simplifiedname}
        </div>
    );
};
