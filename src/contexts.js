import React, { useContext } from "react";

export const MatrixClientContext = React.createContext();
export const useMatrixClientContext = () => useContext(MatrixClientContext);

export const DispatchContext = React.createContext();
export const useDispatchContext = () => useContext(DispatchContext);

export const UserIdContext = React.createContext();
export const useUserIdContext = () => useContext(UserIdContext);

export const RoomIdContext = React.createContext();
export const useRoomIdContext = () => useContext(RoomIdContext);
