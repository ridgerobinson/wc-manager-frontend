import {
    LOGOUT_USER,

    TRYING_LOGIN_USER,
    TRYING_LOGIN_USER_SUCCESS,
    TRYING_LOGIN_USER_ERROR,
} from '../Types';

const INIT_STATE = {
    IsLoggedIn: null,
    UserDetails: {},

    TryingLoginUser: false,
    TryingLoginUserError: null
}

const authReducer = (state = INIT_STATE, action) => {
    switch (action.type) {
        case LOGOUT_USER:
            return { ...state, IsLoggedIn: 0, TryingLoginUserError: action.payload };

        case TRYING_LOGIN_USER:
            return { ...state, TryingLoginUser: true, TryingLoginUserError: null };
        case TRYING_LOGIN_USER_ERROR:
            return { ...state, IsLoggedIn: 0, TryingLoginUser: false, TryingLoginUserError: action.payload };
        case TRYING_LOGIN_USER_SUCCESS:
            return { ...state, ...action.payload && { IsLoggedIn: 1, UserDetails: action.payload }, TryingLoginUser: false, TryingLoginUserError: null };

        default:
            return state;
    }
}

export default authReducer;