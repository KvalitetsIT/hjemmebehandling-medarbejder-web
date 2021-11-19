import React from "react";
import { UserContext } from "../../generated/models/UserContext";

export default interface IUserService {
    GetUser : (cpr : string) => Promise<UserContext>
    
}
  