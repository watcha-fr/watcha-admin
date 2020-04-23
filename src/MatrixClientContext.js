import React, { useContext } from "react";

const MatrixClientContext = React.createContext();
export const useMatrixClientContext = () => useContext(MatrixClientContext);
