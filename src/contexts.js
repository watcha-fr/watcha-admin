import React, { useContext } from "react";

export const MatrixClientContext = React.createContext();
export const useMatrixClientContext = () => useContext(MatrixClientContext);

export const ChangeTabContext = React.createContext();
export const useChangeTabContext = () => useContext(ChangeTabContext);
