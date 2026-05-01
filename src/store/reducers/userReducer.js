import actionTypes from '../actions/actionTypes';

const initialState = {
    isLoggedIn: false,
    userInfo: null,
    detailDoctor: {}
}

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.USER_LOGIN_SUCCESS:
            return {
                ...state,
                isLoggedIn: true,
                userInfo: action.userInfo
            }
        case actionTypes.USER_LOGIN_FAIL:
            return {
                ...state,
                isLoggedIn: false,
                userInfo: null
            }
        case actionTypes.PROCESS_LOGOUT:
            return {
                ...state,
                isLoggedIn: false,
                userInfo: null
            }
        case actionTypes.FETCH_DETAIL_DOCTOR_SUCCESS:
            let copyDetailDoctor = { ...state };
            copyDetailDoctor.detailDoctor = action.data;
            return {
                ...copyDetailDoctor
            };
        case actionTypes.FETCH_DETAIL_DOCTOR_FAILED:
            state.detailDoctor = {};
            return {
                ...state
            }
        default:
            return state;
    }
}

export default userReducer;