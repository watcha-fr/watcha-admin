import React from "react";
import { useDispatchContext } from "./contexts";

import "./css/AdministratorList.scss";

export default ({ administratorList }) => {
    const dispatch = useDispatchContext();

    const onAdminUserClick = userId => dispatch({ tab: "users", userId });

    const administratorsSection = [];

    for (const index in administratorList) {
        const adminUser = administratorList[index];
        administratorsSection.push(
            <div
                key={adminUser.user_id}
                className="AdministratorList_adminUserRow"
                onClick={() => onAdminUserClick(adminUser.user_id)}
            >
                {`${
                    adminUser.displayname
                        ? adminUser.displayname
                        : adminUser.user_id.replace("@", "").split(":")[0]
                } ${adminUser.email ? `(${adminUser.email})` : ""}`}
            </div>
        );
    }

    return <div className="AdministratorList">{administratorsSection}</div>;
};
