import actionTypes from './actionTypes';
import { getDetailInforDoctor, getScheduleDoctorByDate } from '../../services/userService';

export const addUserSuccess = () => ({
    type: actionTypes.ADD_USER_SUCCESS
})

export const userLoginSuccess = (userInfo) => ({
    type: actionTypes.USER_LOGIN_SUCCESS,
    userInfo: userInfo
})

export const userLoginFail = () => ({
    type: actionTypes.USER_LOGIN_FAIL
})

export const processLogout = () => ({
    type: actionTypes.PROCESS_LOGOUT
})

export const fetchDetailDoctor = (id) => {
    return async (dispatch, getState) => {
        try {
            let res = await getDetailInforDoctor(id);
            if (res && res.errCode === 0) {
                dispatch(fetchDetailDoctorSuccess(res.data));
            } else {
                dispatch(fetchDetailDoctorFailed());
            }
        } catch (e) {
            console.log('fetchDetailDoctor error: ', e);
            dispatch(fetchDetailDoctorFailed());
        }
    }
}

export const fetchDetailDoctorSuccess = (data) => ({
    type: actionTypes.FETCH_DETAIL_DOCTOR_SUCCESS,
    data: data
})

export const fetchDetailDoctorFailed = () => ({
    type: actionTypes.FETCH_DETAIL_DOCTOR_FAILED
})

export const fetchDoctorScheduleByDate = (doctorId, date) => {
    return async (dispatch, getState) => {
        try {
            let res = await getScheduleDoctorByDate(doctorId, date);
            if (res && res.errCode === 0) {
                dispatch({ type: actionTypes.FETCH_SCHEDULE_DOCTOR_BY_DATE_SUCCESS, data: res.data });
            } else {
                dispatch({ type: actionTypes.FETCH_SCHEDULE_DOCTOR_BY_DATE_FAILED });
            }
        } catch (e) {
            dispatch({ type: actionTypes.FETCH_SCHEDULE_DOCTOR_BY_DATE_FAILED });
            console.log('Error fetching doctor schedule by date:', e);
        }
    }
}