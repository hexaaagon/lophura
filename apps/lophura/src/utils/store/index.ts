/* eslint-disable @typescript-eslint/no-explicit-any */
import { DatabaseUser } from "@/server/db/schema";
import { createStore, action } from "easy-peasy";

export const store = createStore(
  {
    setUser: action((state: StoreType, payload: DatabaseUser) => {
      state.user = payload;
    }),
    clearUser: action((state: StoreType) => {
      state.user = undefined;
    }),
  } as StoreType & StoreActions,
  { name: "LophuraStore" }
);

export interface StoreType {
  user?: DatabaseUser;
}

export interface StoreActions {
  setUser?: any;
  clearUser?: any;
}
