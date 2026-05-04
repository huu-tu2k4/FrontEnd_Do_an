import actionTypes from './actionTypes';
import { getAllCodeService, 
        createNewUserService,
        getAllUsers,
        deleteUserService,
        editUserService,
        getTopDoctorHomeService,
        getAllDoctors,
        saveDetailDoctorService,
        saveBulkScheduleDoctorService
        } from '../../services/userService';
import { toast } from 'react-toastify';
import LanguageUtils from '../../utils/LanguageUtils';



export const fetchGenderStart = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_GENDER_START });
            let res = await getAllCodeService('GENDER');
            if (res && res.errCode === 0) {
                dispatch({ type: actionTypes.FETCH_GENDER_SUCCESS, data: res.data });
            }
            else {
                dispatch({ type: actionTypes.FETCH_GENDER_FAILED });
            }
        }
        catch (e) {
            dispatch({ type: actionTypes.FETCH_GENDER_FAILED });
            console.log('Error fetching gender data:', e);
        }
    }
}
export const getRequiredDoctorInfor = () => {
    return async (dispatch, getState) => {
        try {
            let resPrice = await getAllCodeService('PRICE');
            let resPayment = await getAllCodeService('PAYMENT');
            let resProvince = await getAllCodeService('PROVINCE');
            if (resPrice && resPrice.errCode === 0 && resPayment && resPayment.errCode === 0 && resProvince && resProvince.errCode === 0) {
                let data = {
                    price: resPrice.data,
                    payment: resPayment.data,
                    province: resProvince.data
                }
                // console.log('check data required doctor infor: ', data);
                dispatch({ type: actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_SUCCESS, data: data });
            }
            else {
                dispatch({ type: actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_FAILED });
            }
        }
        catch (e) {
            dispatch({ type: actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_FAILED });
            console.log('Error fetching required doctor infor:', e);
        }
    }
}

export const fetchAllCodeScheduleTime = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllCodeService('TIME');
            // console.log('fetchAllCodeScheduleTime response: ', res);
            if (res && res.errCode === 0) {
                dispatch({ type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_SUCCESS, data: res.data });
            } else {
                dispatch({ type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_FAILED });
            }
        } catch (e) {
            dispatch({ type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_FAILED });
            console.log('Error fetching schedule time codes:', e);
        }
    }
}

export const fetchPositionStart = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllCodeService('POSITION');
            if (res && res.errCode === 0) {
                dispatch({ type: actionTypes.FETCH_POSITION_SUCCESS, data: res.data });
            }
            else {
                dispatch({ type: actionTypes.FETCH_POSITION_FAILED });
            }
        }
        catch (e) {
            dispatch({ type: actionTypes.FETCH_POSITION_FAILED });
            console.log('Error fetching position data:', e);
        }
    }
}

export const fetchRoleStart = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllCodeService('ROLE');
            if (res && res.errCode === 0) {
                dispatch({ type: actionTypes.FETCH_ROLE_SUCCESS, data: res.data });
            }
            else {
                dispatch({ type: actionTypes.FETCH_ROLE_FAILED });
            }
        }
        catch (e) {
            dispatch({ type: actionTypes.FETCH_ROLE_FAILED });
            console.log('Error fetching role data:', e);
        }
    }
}
export const createNewUser = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await createNewUserService(data);
            
            if (res && res.errCode === 0) {
                const language = getState().app.language;
                const message = LanguageUtils.getMessageByKey('user.create_success', language) || 'Create a new user successfully!';
                toast.success(message);
                dispatch({ type: actionTypes.CREATE_USER_SUCCESS });
                dispatch(fetchAllUsers());
            }
            else {
                dispatch({ type: actionTypes.CREATE_USER_FAILED });
            }
            return res;
        }
        catch (e) {
            dispatch({ type: actionTypes.CREATE_USER_FAILED });
            console.log('Error creating new user:', e);
            return { errCode: -1, errMessage: 'Error creating new user' };
        }
    }
}
export const fetchAllUsers = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllUsers('ALL');
            if (res && res.errCode === 0) {
                dispatch({ type: actionTypes.FETCH_ALL_USERS_SUCCESS, users: res.users.reverse() });
            }
            else {
                dispatch({ type: actionTypes.FETCH_ALL_USERS_FAILED });
            }
        }
        catch (e) {
            dispatch({ type: actionTypes.FETCH_ALL_USERS_FAILED });
            console.log('Error fetching all users:', e);
        }
    }
}

export const deleteUser = (userId) => {
    return async (dispatch, getState) => {
        try {
            let res = await deleteUserService(userId);
            if (res && res.errCode === 0) {
                const language = getState().app.language;
                const message = LanguageUtils.getMessageByKey('user.delete_success', language) || 'Delete user successfully!';
                toast.success(message);
                dispatch({ type: actionTypes.DELETE_USER_SUCCESS });
                dispatch(fetchAllUsers());
            }
            else {
                const language = getState().app.language;
                const message = LanguageUtils.getMessageByKey('user.delete_failed', language) || 'Failed to delete user!';
                toast.error(message);
                dispatch({ type: actionTypes.DELETE_USER_FAILED });
            }
            return res;
        }
        catch (e) {
            const language = getState().app.language;
            const message = LanguageUtils.getMessageByKey('user.delete_failed', language) || 'Failed to delete user!';
            toast.error(message);
            dispatch({ type: actionTypes.DELETE_USER_FAILED });
            console.log('Error deleting user:', e);
            return { errCode: -1, errMessage: 'Error deleting user' };
        }
    }
}
export const editUser = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await editUserService(data);
            if (res && res.errCode === 0) {
                const language = getState().app.language;
                const message = LanguageUtils.getMessageByKey('user.edit_success', language) || 'Edit user successfully!';
                toast.success(message);
                dispatch({ type: actionTypes.EDIT_USER_SUCCESS });
                dispatch(fetchAllUsers());
            }
            else {
                const language = getState().app.language;
                const message = LanguageUtils.getMessageByKey('user.edit_failed', language) || 'Failed to edit user!';
                toast.error(message);
                dispatch({ type: actionTypes.EDIT_USER_FAILED });
            }
            return res;
        }
        catch (e) {
            const language = getState().app.language;
            const message = LanguageUtils.getMessageByKey('user.edit_failed', language) || 'Failed to edit user!';
            toast.error(message);
            dispatch({ type: actionTypes.EDIT_USER_FAILED });
            console.log('Error editing user:', e);
            return { errCode: -1, errMessage: 'Error editing user' };
        }
    }
}
export const fetchTopDoctor = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getTopDoctorHomeService(6);
                if (res && res.errCode === 0) {
                    let payload = (res.data !== undefined) ? res.data : (res.users !== undefined ? res.users : res);
                    dispatch({ type: actionTypes.FETCH_TOP_DOCTOR_SUCCESS, data: payload });
            }
            else {
                dispatch({ type: actionTypes.FETCH_TOP_DOCTOR_FAILED });
            }
        }
        catch (e) {
            dispatch({ type: actionTypes.FETCH_TOP_DOCTOR_FAILED });
            console.log('Error fetching top doctor:', e);
        }
    }
}

export const fetchAllDoctors = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllDoctors();
            // console.log('fetchAllDoctors response: ', res);
            if (res && res.errCode === 0) {
                dispatch({ type: actionTypes.FETCH_ALL_DOCTORS_SUCCESS, data: res.data });
            } else {
                dispatch({ type: actionTypes.FETCH_ALL_DOCTORS_FAILED });
            }
        } catch (e) {
            dispatch({ type: actionTypes.FETCH_ALL_DOCTORS_FAILED });
            console.log('Error fetching all doctors:', e);
        }
    }
}

export const saveDetailDoctor = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await saveDetailDoctorService(data);
            // console.log('saveDetailDoctor response: ', res);
            if (res && res.errCode === 0) {
                const language = getState().app.language;
                const message = LanguageUtils.getMessageByKey('doctor.save_success', language) || 'Save doctor details successfully!';
                toast.success(message);
                dispatch({ type: actionTypes.SAVE_DETAIL_DOCTOR_SUCCESS });
            } else {
                const language = getState().app.language;
                const message = LanguageUtils.getMessageByKey('doctor.save_failed', language) || 'Failed to save doctor details!';
                toast.error(message);
                dispatch({ type: actionTypes.SAVE_DETAIL_DOCTOR_FAILED });
            }
            return res;
        } catch (e) {
            const language = getState().app.language;
            const message = LanguageUtils.getMessageByKey('doctor.save_failed', language) || 'Failed to save doctor details!';
            toast.error(message);
            dispatch({ type: actionTypes.SAVE_DETAIL_DOCTOR_FAILED });
            console.log('Error saving doctor details:', e);
            return { errCode: -1, errMessage: 'Error saving doctor details' };
        }
    }
}

export const saveBulkScheduleDoctor = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await saveBulkScheduleDoctorService(data);
            // console.log('saveBulkScheduleDoctor response: ', res);
            if (res && res.errCode === 0) {
                const language = getState().app.language;
                const message = LanguageUtils.getMessageByKey('doctor.save_schedule_success', language) || 'Save doctor schedule successfully!';
                toast.success(message);
                dispatch({ type: actionTypes.SAVE_BULK_SCHEDULE_DOCTOR_SUCCESS });
            }
            else {
                const language = getState().app.language;
                const message = LanguageUtils.getMessageByKey('doctor.save_schedule_failed', language) || 'Failed to save doctor schedule!';
                toast.error(message);
                dispatch({ type: actionTypes.SAVE_BULK_SCHEDULE_DOCTOR_FAILED });
            }
            return res;
        } catch (e) {
            const language = getState().app.language;
            const message = LanguageUtils.getMessageByKey('doctor.save_schedule_failed', language) || 'Failed to save doctor schedule!';
            toast.error(message);
            dispatch({ type: actionTypes.SAVE_BULK_SCHEDULE_DOCTOR_FAILED });
            console.log('Error saving doctor schedule:', e);
            return { errCode: -1, errMessage: 'Error saving doctor schedule' };
        }
    }
}
