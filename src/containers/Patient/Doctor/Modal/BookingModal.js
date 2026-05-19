import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import { Modal } from 'reactstrap';
import ProfileDoctor from '../ProfileDoctor';
import DatePicker from '../../../../components/Input/DatePicker';
import ValidatedInput from '../../../../components/Input/ValidatedInput';
import GlobalLoadingOverlay from '../../../../components/GlobalLoadingOverlay/GlobalLoadingOverlay';
import * as actions from '../../../../store/actions';
import _ from 'lodash';
import { LANGUAGE } from '../../../../utils';
import Select from 'react-select';
import { postPatientBookAppointment } from '../../../../services/userService';
import { toast } from 'react-toastify';
import moment from 'moment';


import './BookingModal.scss';

class BookingModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            phoneNumber: '',
            email: '',
            address: '',
            reason: '',
            birthday: '',
            gender: '',
            doctorId: '',
            timeType: '',
            selectedGender: '',
            genderArr: [],
            isDisabled: false,
            isShowLoading: false
            
        }
    }

    componentDidMount() {
        this.props.fetchGender();
        
    }

    buildDataGender = (data) => {
        // console.log('check data gender: ', data);
        let result = [];
        let language = this.props.language;
        if(data && data.length > 0) {
            data.map(item => {
                let object = {};
                object.label = language === LANGUAGE.VI ? item.valueVi : item.valueEn;
                object.value = item.keyMap;
                object.keyMap = item.keyMap;
                result.push(object);
            })
        }
        return result;
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.genders !== prevProps.genders) {
            let dataGender = this.buildDataGender(this.props.genders);
            this.setState({
                genderArr: dataGender
            })
        }
        if(this.props.language !== prevProps.language) {
            let dataGender = this.buildDataGender(this.props.genders);
            this.setState({
                genderArr: dataGender
            })
        }
        if(this.props.dataTime !== prevProps.dataTime) {
            let doctorId = this.props.dataTime.doctorId;
            let timeType = this.props.dataTime.timeType;
            this.setState({
                doctorId: doctorId,
                timeType: timeType
            })
        }
    }

    handleOnChangeInput = (event, id) => {
        let valueInput = event.target.value;
        let stateCopy = { ...this.state };
        stateCopy[id] = valueInput;
        this.setState({
            ...stateCopy
        })
    }

    buildTimeBooking = (dataTime) => {
        let { language } = this.props;
        if(dataTime && !_.isEmpty(dataTime)) {
            let timeVi = dataTime.timeTypeData.valueVi;
            let timeEn = dataTime.timeTypeData.valueEn;
            let timeDisplay = language === LANGUAGE.VI ? timeVi : timeEn;
            let date = language === LANGUAGE.VI ?
                moment.unix(+dataTime.date / 1000).format('dddd - DD/MM/YYYY') :
                moment.unix(+dataTime.date / 1000).locale('en').format('ddd - MM/DD/YYYY');
            date = date.charAt(0).toUpperCase() + date.slice(1);
            
            return `${timeDisplay} - ${date}`;
        } else {
            return '';
        }
    }

    buildDoctorName = (dataProfile) => {
        let { language } = this.props;
        if(dataProfile && dataProfile.doctorData) {
            let nameVi = `${dataProfile.doctorData.lastName} ${dataProfile.doctorData.firstName}`;
            let nameEn = `${dataProfile.doctorData.firstName} ${dataProfile.doctorData.lastName}`;
            return language === LANGUAGE.VI ? nameVi : nameEn;
        }
        return '';
    }

    handleConfirmBooking = async () => {
        this.setState({ isDisabled: true, isShowLoading: true });
        let doctorName = this.buildDoctorName(this.props.dataTime);
        let timeString = this.buildTimeBooking(this.props.dataTime);
        let date = this.props.dataTime.date;
        let inputData = {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            phoneNumber: this.state.phoneNumber,
            email: this.state.email,
            address: this.state.address,
            reason: this.state.reason,
            date: date,
            selectedGender: this.state.selectedGender,
            doctorId: this.state.doctorId,
            timeType: this.state.timeType,
            language: this.props.language,
            timeString: timeString,
            doctorName: doctorName
        };
        try {
            let res = await postPatientBookAppointment(inputData);
            if(res && res.errCode === 0) {
                toast.success(<FormattedMessage id="patient.detail-doctor.booking_success" />);
                this.props.onClose();
                this.setState({
                    firstName: '',
                    lastName: '',
                    phoneNumber: '',
                    email: '',
                    address: '',
                    reason: '',
                    birthday: '',
                    selectedGender: '',
                    isDisabled: false,
                    isShowLoading: false
                })
            } else {
                this.setState({ isDisabled: false, isShowLoading: false });
                toast.error(<FormattedMessage id="patient.detail-doctor.booking_failed" />);
            }
        } catch (error) {
            this.setState({ isDisabled: false, isShowLoading: false });
            toast.error(<FormattedMessage id="patient.detail-doctor.booking_failed" />);
        }
    }

    render() {
        let { selectedGender, genderArr } = this.state;
        let { isOpen, onClose, dataTime } = this.props;
        let doctorId = dataTime && !_.isEmpty(dataTime) ? dataTime.doctorId : '';
        // console.log('check dataTime: ', dataTime, this.props);
        return (
            <Modal
                isOpen={isOpen}
                size='lg'
                centered
                className="booking-modal-container">
                <div className="booking-modal-content">
                    <GlobalLoadingOverlay active={this.state.isShowLoading} />
                    <div className="booking-modal-header">
                        <FormattedMessage id="patient.detail-doctor.booking" />
                        <i className="fas fa-times booking-modal-close" onClick={onClose} />
                    </div>
                    <div className="booking-modal-body">
                        <div className="doctor-infor">
                            <ProfileDoctor 
                            doctorId={doctorId} 
                            isShowDescription={false} 
                            dataTime={dataTime}
                            isShowLinkDetail={false}
                            />
                        </div>
                        <div className="row">
                            <div className="col-6 form-group">
                                <label><FormattedMessage id="patient.detail-doctor.first-name" />(*)</label>
                                <input 
                                type="text" 
                                className="form-control"
                                value={this.state.firstName}
                                onChange={(e) => this.handleOnChangeInput(e, 'firstName')}
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label><FormattedMessage id="patient.detail-doctor.last-name" />(*)</label>
                                <input 
                                type="text" 
                                className="form-control"
                                value={this.state.lastName}
                                onChange={(e) => this.handleOnChangeInput(e, 'lastName')}
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label><FormattedMessage id="patient.detail-doctor.phone-number" />(*)</label>
                                <ValidatedInput
                                    type="phone"
                                    value={this.state.phoneNumber}
                                    onChange={(e) => this.handleOnChangeInput(e, 'phoneNumber')}
                                    required
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label><FormattedMessage id="patient.detail-doctor.email" />(*)</label>
                                <ValidatedInput
                                    type="email"
                                    value={this.state.email}
                                    onChange={(e) => this.handleOnChangeInput(e, 'email')}
                                    required
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label><FormattedMessage id="patient.detail-doctor.address" />(*)</label>
                                <input 
                                type="text" 
                                className="form-control"
                                value={this.state.address}
                                onChange={(e) => this.handleOnChangeInput(e, 'address')}
                                />
                            </div>
                            <div className="col-12 form-group">
                                <label><FormattedMessage id="patient.detail-doctor.reason" /></label>
                                <input 
                                type="text" 
                                className="form-control"
                                value={this.state.reason}
                                onChange={(e) => this.handleOnChangeInput(e, 'reason')}
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label><FormattedMessage id="patient.detail-doctor.birthday" />(*)</label>
                                <div className="date-picker-wrapper">
                                    <DatePicker
                                        className="form-control"
                                        value={this.state.birthday}
                                        onChange={(date) => {this.setState({ birthday: date[0] })}}
                                    />
                                    <i className="calendar-icon fas fa-calendar"></i>
                                </div>
                            </div>
                            <div className="col-6 form-group">
                                <label><FormattedMessage id="patient.detail-doctor.gender"/>(*)</label>
                                <Select
                                    value={genderArr.find(opt => opt.value === selectedGender) || null}
                                    onChange={(selectedOption) => this.setState({ selectedGender: selectedOption ? selectedOption.value : '' })}
                                    options={genderArr}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="booking-modal-footer">
                        <button className="btn-booking-confirm" disabled={this.state.isDisabled} onClick={() => this.handleConfirmBooking()}>
                            <FormattedMessage id="patient.detail-doctor.confirm" />
                        </button>
                        <button className="btn-booking-cancel" onClick={onClose} >
                            <FormattedMessage id="patient.detail-doctor.cancel" />
                        </button>
                    </div>
                </div>
            </Modal>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genders: state.admin.genders
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchGender: () => dispatch(actions.fetchGenderStart()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);
