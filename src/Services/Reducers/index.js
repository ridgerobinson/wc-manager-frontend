import { combineReducers } from "redux";

import Auth from "./Auth";
import Regular from "./Regular";

export default combineReducers({
    Auth, Regular
});