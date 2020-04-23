import React, { useContext } from "react";

export const MatrixClientContext = React.createContext();
export const useMatrixClientContext = () => useContext(MatrixClientContext);

export const TabReducerContext = React.createContext();
export const useTabReducerContext = () => useContext(TabReducerContext);
