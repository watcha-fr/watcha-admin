import React from "react";

export default ({ onUserClicked, adminUserId, displayName, email }) => {
    const onClick = () => onUserClicked(adminUserId);
    return (
        <div className="AdminName" {...{ onClick }}>
            {`${displayName} (${email})`}
        </div>
    );
};
