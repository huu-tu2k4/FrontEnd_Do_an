import actionTypes from './actionTypes';
import { getAllCodeService, 
        createNewUserService,
        getAllUsers,
        deleteUserService,
        editUserService
        } from '../../services/userService';
import { toast } from 'react-toastify';
import LanguageUtils from '../../utils/LanguageUtils';


export const fetchGenderStart = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_GENDER_START });
            let res = await getAllCodeService('GENDER');
            if (res && res.errCode === 0) {
                dispatch(fetchGenderSuccess(res.data));
            }
            else {
                dispatch(fetchGenderFailed());
            }
        }
        catch (e) {
            dispatch(fetchGenderFailed());
            console.log('Error fetching gender data:', e);
        }
    }
}
export const fetchGenderSuccess = (genderData) => ({
    type: actionTypes.FETCH_GENDER_SUCCESS,
    data: genderData
})
export const fetchGenderFailed = () => ({
    type: actionTypes.FETCH_GENDER_FAILED
})

export const fetchPositionStart = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllCodeService('POSITION');
            if (res && res.errCode === 0) {
                dispatch(fetchPositionSuccess(res.data));
            }
            else {
                dispatch(fetchPositionFailed());
            }
        }
        catch (e) {
            dispatch(fetchPositionFailed());
            console.log('Error fetching position data:', e);
        }
    }
}
export const fetchPositionSuccess = (positionData) => ({
    type: actionTypes.FETCH_POSITION_SUCCESS,
    data: positionData
})
export const fetchPositionFailed = () => ({
    type: actionTypes.FETCH_POSITION_FAILED
})

export const fetchRoleStart = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllCodeService('ROLE');
            if (res && res.errCode === 0) {
                dispatch(fetchRoleSuccess(res.data));
            }
            else {
                dispatch(fetchRoleFailed());
            }
        }
        catch (e) {
            dispatch(fetchRoleFailed());
            console.log('Error fetching role data:', e);
        }
    }
}
export const fetchRoleSuccess = (roleData) => ({
    type: actionTypes.FETCH_ROLE_SUCCESS,
    data: roleData
})
export const fetchRoleFailed = () => ({
    type: actionTypes.FETCH_ROLE_FAILED
})
export const createNewUser = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await createNewUserService(data);
            
            if (res && res.errCode === 0) {
                const language = getState().app.language;
                const message = LanguageUtils.getMessageByKey('user.create_success', language) || 'Create a new user successfully!';
                toast.success(message);
                dispatch(createUserSuccess());
                dispatch(fetchAllUsers());
            }
            else {
                dispatch(createUserFailed());
            }
            return res;
        }
        catch (e) {
            dispatch(createUserFailed());
            console.log('Error creating new user:', e);
            return { errCode: -1, errMessage: 'Error creating new user' };
        }
    }
}
export const createUserSuccess = () => ({
    type: actionTypes.CREATE_USER_SUCCESS,
})
export const createUserFailed = () => ({
    type: actionTypes.CREATE_USER_FAILED,
})

export const fetchAllUsers = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllUsers('ALL');
            console.log('fetchAllUsers response:', res);
            if (res && res.errCode === 0) {
                dispatch(fetchAllUsersSuccess(res.users.reverse()));
            }
            else {
                dispatch(fetchAllUsersFailed());
            }
        }
        catch (e) {
            dispatch(fetchAllUsersFailed());
            console.log('Error fetching all users:', e);
        }
    }
}
export const fetchAllUsersSuccess = (data) => ({
    type: actionTypes.FETCH_ALL_USERS_SUCCESS,
    users: data
})
export const fetchAllUsersFailed = () => ({
    type: actionTypes.FETCH_ALL_USERS_FAILED,
})
export const deleteUser = (userId) => {
    return async (dispatch, getState) => {
        try {
            let res = await deleteUserService(userId);
            if (res && res.errCode === 0) {
                const language = getState().app.language;
                const message = LanguageUtils.getMessageByKey('user.delete_success', language) || 'Delete user successfully!';
                toast.success(message);
                dispatch(deleteUserSuccess());
                dispatch(fetchAllUsers());
            }
            else {
                const language = getState().app.language;
                const message = LanguageUtils.getMessageByKey('user.delete_failed', language) || 'Failed to delete user!';
                toast.error(message);
                dispatch(deleteUserFailed());
            }
            return res;
        }
        catch (e) {
            const language = getState().app.language;
            const message = LanguageUtils.getMessageByKey('user.delete_failed', language) || 'Failed to delete user!';
            toast.error(message);
            dispatch(deleteUserFailed());
            console.log('Error deleting user:', e);
            return { errCode: -1, errMessage: 'Error deleting user' };
        }
    }
}
export const deleteUserSuccess = () => ({
    type: actionTypes.DELETE_USER_SUCCESS,
})
export const deleteUserFailed = () => ({
    type: actionTypes.DELETE_USER_FAILED,
})
export const editUser = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await editUserService(data);
            if (res && res.errCode === 0) {
                const language = getState().app.language;
                const message = LanguageUtils.getMessageByKey('user.edit_success', language) || 'Edit user successfully!';
                toast.success(message);
                dispatch(editUserSuccess());
                dispatch(fetchAllUsers());
            }
            else {
                const language = getState().app.language;
                const message = LanguageUtils.getMessageByKey('user.edit_failed', language) || 'Failed to edit user!';
                toast.error(message);
                dispatch(editUserFailed());
            }
        }
        catch (e) {
            const language = getState().app.language;
            const message = LanguageUtils.getMessageByKey('user.edit_failed', language) || 'Failed to edit user!';
            toast.error(message);
            dispatch(editUserFailed());
            console.log('Error editing user:', e);
        }
    }
}
export const editUserSuccess = () => ({
    type: actionTypes.EDIT_USER_SUCCESS,
})
export const editUserFailed = () => ({
    type: actionTypes.EDIT_USER_FAILED,
})