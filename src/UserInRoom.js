import React from "react";

function UserInRoom({ onUserClicked, userName, simplifiedName }) {
    function onClick() {
        onUserClicked(userName);
    }
    return <span {...{ onClick }}>{simplifiedName}</span>;
}

export default UserInRoom;
