import {
    TRYING_GET_DATA,
    TRYING_GET_DATA_SUCCESS,
    TRYING_GET_DATA_ERROR,
} from '../Types';

const INIT_STATE = {
    TryingGetData: false,
    TryingGetDataError: null
}

const authReducer = (state = INIT_STATE, action) => {
    switch (action.type) {
        case TRYING_GET_DATA:
            return { ...state, TryingGetData: true, TryingGetDataError: null };
        case TRYING_GET_DATA_ERROR:
            return { ...state, TryingGetData: false, TryingGetDataError: action.payload };
        case TRYING_GET_DATA_SUCCESS:
            return { ...state, ...action.payload, TryingGetData: false, TryingGetDataError: null };

        default:
            return state;
    }
}

export default authReducer;