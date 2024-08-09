import "@remix-run/server-runtime";

interface ISessionUserObject {
  id: string;
  username: string;
  email: string;
  gardens: Array;
}

declare module "@remix-run/server-runtime" {
  export interface AppLoadContext {
    req: Express.Request;
    session;
    passport;
    login;
    logout;
    user: ISessionUserObject;
  }
}


export type UpdateRoomTypes = "update" | "history";

export type UpdateRoomPayload = {
  roomId: string;
  type: UpdateRoomTypes;
  data: Node[];
};