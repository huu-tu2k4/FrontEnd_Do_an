import actionTypes from '../actions/actionTypes';

const initialState = {
    isLoadingGender: false,
    genders: [],
    roles: [],
    positions: [],
    users: []
}

const adminReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_GENDER_START:
            state.isLoadingGender = true;
            return {
                ...state
            }
        case actionTypes.FETCH_GENDER_SUCCESS:
            let copyState = { ...state };
            copyState.genders = action.data;
            copyState.isLoadingGender = false;
            return {
                ...copyState
            }
        case actionTypes.FETCH_GENDER_FAILED:
            state.isLoadingGender = false;
            state.genders = [];
            return {
                ...state
            }

        case actionTypes.FETCH_POSITION_SUCCESS:
            let copyStatePosition = { ...state };
            copyStatePosition.positions = action.data;
            return {
                ...copyStatePosition
            }
        case actionTypes.FETCH_POSITION_FAILED:
            state.positions = [];
            return {
                ...state
            }
        
        case actionTypes.FETCH_ROLE_SUCCESS:
            let copyStateRole = { ...state };
            copyStateRole.roles = action.data;
            return {
                ...copyStateRole
            }
        case actionTypes.FETCH_ROLE_FAILED:
            state.roles = [];
            return {
                ...state
            }
        case actionTypes.FETCH_ALL_USERS_SUCCESS:
            let copyStateUsers = { ...state };
            copyStateUsers.users = action.users;
            return {
                ...copyStateUsers
            }
        case actionTypes.FETCH_ALL_USERS_FAILED:
            state.users = [];
            return {
                ...state
            }

        default:
            return state;
    }
}

export default adminReducer;