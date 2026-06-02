import actionTypes from '../actions/actionTypes';

const initialState = {
    isLoadingGender: false,
    isLoadingUsers: false,
    isSavingUser: false,
    genders: [],
    roles: [],
    positions: [],
    users: [],
    totalUsers: 0,
    topDoctors: [],
    isLoadingTopDoctor: false,
    allDoctors: [],
    specialties: [],
    clinics: [],
    handbooks: [],
    isLoadingSpecialties: false,
    isLoadingClinics: false,
    isLoadingHandbooks: false,
    isLoadingRequiredDoctorInfor: false,
    allScheduleTime: [],
    allDataRequiredDoctorInfor: [],
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
            copyStateUsers.totalUsers = action.total || 0;
            copyStateUsers.isLoadingUsers = false;
            return {
                ...copyStateUsers
            }
        case actionTypes.FETCH_ALL_USERS_FAILED:
            state.users = [];
            state.totalUsers = 0;
            state.isLoadingUsers = false;
            return {
                ...state
            }
        case actionTypes.FETCH_ALL_USERS_START:
            state.isLoadingUsers = true;
            return {
                ...state
            }
        case actionTypes.FETCH_TOP_DOCTOR_START:
            state.isLoadingTopDoctor = true;
            return {
                ...state
            }
        case actionTypes.FETCH_TOP_DOCTOR_SUCCESS:
            let copyStateTopDoctor = { ...state };
            copyStateTopDoctor.topDoctors = action.data;
            copyStateTopDoctor.isLoadingTopDoctor = false;
            return {
                ...copyStateTopDoctor
            }
        case actionTypes.FETCH_TOP_DOCTOR_FAILED:
            state.topDoctors = [];
            state.isLoadingTopDoctor = false;
            return {
                ...state
            }

        case actionTypes.FETCH_ALL_DOCTORS_SUCCESS:
            let copyStateAllDoctors = { ...state };
            copyStateAllDoctors.allDoctors = action.data;
            return {
                ...copyStateAllDoctors
            }
        case actionTypes.FETCH_ALL_DOCTORS_FAILED:
            state.allDoctors = [];
            return {
                ...state
            }
        case actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_SUCCESS:
            let copyStateAllCodeScheduleTime = { ...state };
            copyStateAllCodeScheduleTime.allScheduleTime = action.data;
            return {
                ...copyStateAllCodeScheduleTime
            }
        case actionTypes.FETCH_ALL_SPECIALTIES_START:
            state.isLoadingSpecialties = true;
            return { ...state };
        case actionTypes.FETCH_ALL_SPECIALTIES_SUCCESS:
            let copyStateSpecialties = { ...state };
            copyStateSpecialties.specialties = action.data;
            copyStateSpecialties.isLoadingSpecialties = false;
            return { ...copyStateSpecialties };
        case actionTypes.FETCH_ALL_SPECIALTIES_FAILED:
            state.specialties = [];
            state.isLoadingSpecialties = false;
            return { ...state };

        case actionTypes.FETCH_ALL_CLINICS_START:
            state.isLoadingClinics = true;
            return { ...state };
        case actionTypes.FETCH_ALL_CLINICS_SUCCESS:
            let copyStateClinics = { ...state };
            copyStateClinics.clinics = action.data;
            copyStateClinics.isLoadingClinics = false;
            return { ...copyStateClinics };
        case actionTypes.FETCH_ALL_CLINICS_FAILED:
            state.clinics = [];
            state.isLoadingClinics = false;
            return { ...state };

        case actionTypes.FETCH_ALL_HANDBOOKS_START:
            state.isLoadingHandbooks = true;
            return { ...state };
        case actionTypes.FETCH_ALL_HANDBOOKS_SUCCESS:
            let copyStateHandbooks = { ...state };
            copyStateHandbooks.handbooks = action.data;
            copyStateHandbooks.isLoadingHandbooks = false;
            return { ...copyStateHandbooks };
        case actionTypes.FETCH_ALL_HANDBOOKS_FAILED:
            state.handbooks = [];
            state.isLoadingHandbooks = false;
            return { ...state };
        case actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_FAILED:
            state.allScheduleTime = [];
            return {
                ...state
            }
        case actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_SUCCESS:
            let copyStateRequiredDoctorInfor = { ...state };
            copyStateRequiredDoctorInfor.allDataRequiredDoctorInfor = action.data;
            copyStateRequiredDoctorInfor.isLoadingRequiredDoctorInfor = false;
            return {
                ...copyStateRequiredDoctorInfor
            }
        case actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_FAILED:
            state.allDataRequiredDoctorInfor = [];
            state.isLoadingRequiredDoctorInfor = false;
            return {
                ...state
            }
        case actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_START:
            state.isLoadingRequiredDoctorInfor = true;
            return { ...state };
        case actionTypes.CREATE_USER_START:
            state.isSavingUser = true;
            return { ...state }
        case actionTypes.CREATE_USER_SUCCESS:
            state.isSavingUser = false;
            return { ...state }
        case actionTypes.CREATE_USER_FAILED:
            state.isSavingUser = false;
            return { ...state }
        case actionTypes.EDIT_USER_START:
            state.isSavingUser = true;
            return { ...state }
        case actionTypes.EDIT_USER_SUCCESS:
            state.isSavingUser = false;
            return { ...state }
        case actionTypes.EDIT_USER_FAILED:
            state.isSavingUser = false;
            return { ...state }

        default:
            return state;
    }
}

export default adminReducer;