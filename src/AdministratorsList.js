import React from "react";
import { useDispatchContext } from "./contexts";

import "./css/AdministratorList.scss";

export default ({ administratorList }) => {
    const dispatch = useDispatchContext();

    const onAdminUserClick = userId => dispatch({ tab: "users", userId });

    const getDisplayname = (displayname, userID) =>
        displayname ? displayname : userID.replace("@", "").split(":")[0];

    const administrators = administratorList.map(adminUser => (
        <div
            key={adminUser.user_id}
            className="AdministratorList_adminUserRow"
            onClick={() => onAdminUserClick(adminUser.user_id)}
        >
            {`${getDisplayname(adminUser.displayname, adminUser.user_id)} ${
                adminUser.email ? `(${adminUser.email})` : ""
            }`}
        </div>
    ));

    return <div className="AdministratorList">{administrators}</div>;
};
