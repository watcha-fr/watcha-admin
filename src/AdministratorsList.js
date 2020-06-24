import React from "react";
import { useDispatchContext } from "./contexts";

import "./css/AdministratorsList.scss";

export default ({ administratorList }) => {
    const dispatch = useDispatchContext();

    const onClick = userId => dispatch({ tab: "users", userId });

    const getDisplayName = user =>
        user.displayname || user.user_id.replace("@", "").split(":")[0];

    const getEmail = email => (email ? ` (${email})` : "");

    const administrators = administratorList.map(adminUser => (
        <div
            key={adminUser.user_id}
            className="AdministratorsList_adminUserRow"
            onClick={() => onClick(adminUser.user_id)}
        >
            {getDisplayName(adminUser) + getEmail(adminUser.email)}
        </div>
    ));

    return <div className="AdministratorsList">{administrators}</div>;
};
