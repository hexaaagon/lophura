import { createStore, action, Action } from "easy-peasy";
import type { User as LuciaUser, Session as LuciaSession } from "lucia";
import { PublicUser } from "../db/schema";

export const store = createStore(
  {
    setUser: action((state: StoreType, user: StoreType["user"]) => {
      state.user = user;
    }),
    clearUser: action((state: StoreType) => {
      state.user = undefined;
    }),

    setAuth: action((state: StoreType, auth: StoreType["auth"]) => {
      state.auth = auth;
    }),
    clearAuth: action((state: StoreType) => {
      state.auth = undefined;
    }),

    setSession: action((state: StoreType, session: StoreType["session"]) => {
      state.session = session;
    }),
    clearSession: action((state: StoreType) => {
      state.session = undefined;
    }),

    currentRoute: "Home",
    setCurrentRoute: action(
      (state: StoreType, route: StoreType["currentRoute"]) => {
        state.currentRoute = route;
      },
    ),
  } as StoreType & StoreActions,
  {
    name: "LophuraStore",
  },
);

export interface StoreType {
  user?: PublicUser;
  auth?: LuciaUser;
  session?: LuciaSession;

  currentRoute?: "Home" | "Workspace" | "Settings";
}

export interface StoreActions {
  setUser: any;
  clearUser: any;

  setAuth: any;
  clearAuth: any;

  setSession: any;
  clearSession: any;

  setCurrentRoute: any;
}
