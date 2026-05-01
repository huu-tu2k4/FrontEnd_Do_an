import actionTypes from './actionTypes';
import { getDetailInforDoctor } from '../../services/userService';

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