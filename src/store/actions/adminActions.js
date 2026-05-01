import actionTypes from './actionTypes';
import { getAllCodeService, 
        createNewUserService,
        getAllUsers,
        deleteUserService,
        editUserService,
        getTopDoctorHomeService,
        getAllDoctors,
        saveDetailDoctorService
        } from '../../services/userService';
import { toast } from 'react-toastify';
import LanguageUtils from '../../utils/LanguageUtils';
import e from 'cors';


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

export const fetchTopDoctor = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getTopDoctorHomeService(6);
                if (res && res.errCode === 0) {
                    let payload = (res.data !== undefined) ? res.data : (res.users !== undefined ? res.users : res);
                    dispatch(fetchTopDoctorSuccess(payload));
            }
            else {
                dispatch(fetchTopDoctorFailed());
            }
        }
        catch (e) {
            dispatch(fetchTopDoctorFailed());
            console.log('Error fetching top doctor:', e);
        }
    }
}
export const fetchTopDoctorSuccess = (data) => ({
    type: actionTypes.FETCH_TOP_DOCTOR_SUCCESS,
    data: data
})
export const fetchTopDoctorFailed = () => ({
    type: actionTypes.FETCH_TOP_DOCTOR_FAILED,
})

export const fetchAllDoctors = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllDoctors();
            // console.log('fetchAllDoctors response: ', res);
            if (res && res.errCode === 0) {
                dispatch(fetchAllDoctorsSuccess(res.data));
            } else {
                dispatch(fetchAllDoctorsFailed());
            }
        } catch (e) {
            dispatch(fetchAllDoctorsFailed());
            console.log('Error fetching all doctors:', e);
        }
    }
}

export const fetchAllDoctorsSuccess = (data) => ({
    type: actionTypes.FETCH_ALL_DOCTORS_SUCCESS,
    data: data
})

export const fetchAllDoctorsFailed = () => ({
    type: actionTypes.FETCH_ALL_DOCTORS_FAILED
})

export const saveDetailDoctor = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await saveDetailDoctorService(data);
            console.log('saveDetailDoctor response: ', res);
            if (res && res.errCode === 0) {
                const language = getState().app.language;
                const message = LanguageUtils.getMessageByKey('doctor.save_success', language) || 'Save doctor details successfully!';
                toast.success(message);
                dispatch(saveDetailDoctorSuccess());
            } else {
                const language = getState().app.language;
                const message = LanguageUtils.getMessageByKey('doctor.save_failed', language) || 'Failed to save doctor details!';
                toast.error(message);
                dispatch(saveDetailDoctorFailed());
            }
        } catch (e) {
            const language = getState().app.language;
            const message = LanguageUtils.getMessageByKey('doctor.save_failed', language) || 'Failed to save doctor details!';
            toast.error(message);
            dispatch(saveDetailDoctorFailed());
            console.log('Error saving doctor details:', e);
        }
    }
}
export const saveDetailDoctorSuccess = () => ({
    type: actionTypes.SAVE_DETAIL_DOCTOR_SUCCESS,
})
export const saveDetailDoctorFailed = () => ({
    type: actionTypes.SAVE_DETAIL_DOCTOR_FAILED,
})

export const fetchAllCodeScheduleTime = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllCodeService('TIME');
            console.log('fetchAllCodeScheduleTime response: ', res);
            if (res && res.errCode === 0) {
                dispatch(fetchAllCodeScheduleTimeSuccess(res.data));
            } else {
                dispatch(fetchAllCodeScheduleTimeFailed());
            }
        } catch (e) {
            dispatch(fetchAllCodeScheduleTimeFailed());
            console.log('Error fetching schedule time codes:', e);
        }
    }
}
export const fetchAllCodeScheduleTimeSuccess = (data) => ({
    type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_SUCCESS,
    data: data
})
export const fetchAllCodeScheduleTimeFailed = () => ({
    type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_FAILED
})