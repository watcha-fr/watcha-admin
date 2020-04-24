import React from "react";

import { UserIdContext } from "./contexts";
import DataToTable from "./DataToTable";

export default () => (
    <UserIdContext.Consumer>
        {userId => <DataToTable tableName="user" {...{ userId }} />}
    </UserIdContext.Consumer>
);
