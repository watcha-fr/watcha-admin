import React from "react";

function AdminCardStats({ onUserClicked, adminName, simplifiedname }) {
    function onClick() {
        onUserClicked(adminName[[0]]);
    }

    return (
        <div className="AdminName" {...{ onClick }}>
            {simplifiedname}
        </div>
    );
}

export default AdminCardStats;
