import React, { Component } from 'react';
import { connect } from "react-redux";
import * as actions from '../../../store/actions';
import moment from 'moment';
import localization from 'moment/locale/vi';
import { LANGUAGE } from '../../../utils';
import { FormattedMessage } from 'react-intl';
import BookingModal from './Modal/BookingModal';

import './DoctorSchedule.scss';

class DoctorSchedule extends Component {

    constructor(props) {
        super(props);
        this.state = {
            allDays: [],
            availableTime: [],
            isModalOpen: false,
            dataScheduleTimeModal: {}
        }
    }

    componentDidMount() {
        this.getArrDays();
        let allDays = this.getArrDays();
        this.setState({ allDays: allDays });
        
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        
        if(this.props.language !== prevProps.language) {
            let allDays = this.getArrDays();
            this.setState({ allDays: allDays });
        }
        if(this.props.doctorIdFromParent !== prevProps.doctorIdFromParent && this.props.doctorIdFromParent) {
            let allDays = this.getArrDays();
            let date = allDays[0].value;
            let doctorId = this.props.doctorIdFromParent;
            await this.props.fetchDoctorScheduleByDate(this.props.doctorIdFromParent, date);
            let res = this.props.scheduleDoctorByDate;
            this.setState({ availableTime: res ? res : [] });
        }
    }

    getArrDays = () => {
        let language = this.props.language;
        let arrDate = [];
        for (let i = 0; i < 7; i++) {
            let object = {};
            let dateToCheck = moment(new Date()).add(i, 'days');

            let isToday = dateToCheck.isSame(moment(), 'day');
            if (isToday) {
                object.label = language === LANGUAGE.VI ? `Hôm nay - ${dateToCheck.format('DD/MM')}` : `Today - ${dateToCheck.format('DD/MM')}`;
            } else {
                object.label = this.capitalizeFirstLetter(dateToCheck.locale(language === LANGUAGE.VI ? 'vi' : 'en').format('dddd - DD/MM'));
            }
            object.value = dateToCheck.locale(language === LANGUAGE.VI ? 'vi' : 'en').startOf('day').valueOf();
            arrDate.push(object);
        }
        return arrDate;
    }

    handleChangeSelect = async (selectedOption) => {
        if(this.props.doctorIdFromParent && this.props.doctorIdFromParent !== -1) {
            let doctorId = this.props.doctorIdFromParent;
            let date = selectedOption;
            await this.props.fetchDoctorScheduleByDate(doctorId, date);
            let res = this.props.scheduleDoctorByDate;
            this.setState({ availableTime: res ? res : [] });
        }
    }
    
    capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    handleClickScheduleTime = (time) => {
        this.setState({ isModalOpen: true, dataScheduleTimeModal: time });
    }

    closeBookingModal = () => {
        this.setState({ isModalOpen: false });
    }

    render() {
        let { allDays, availableTime, isModalOpen, dataScheduleTimeModal } = this.state;
        let { language } = this.props;
        return (
            <>
                <div className="doctor-schedule-container">
                    <div className="all-schedule">
                        <select onChange={(event) => this.handleChangeSelect(event.target.value)}>
                            {allDays.map((day, index) => (
                                <option key={index} value={day.value}>
                                    {day.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="all-available-time">
                        <div className="text-calendar">
                            <i className="fas fa-calendar-alt">
                            <span><FormattedMessage id="patient.detail-doctor.schedule" /></span>
                            </i>
                        </div>
                        { availableTime && availableTime.length > 0 ? (
                            <div className="time-content">
                                {availableTime.map((time, index) => {
                                    // console.log('check time: ', time);
                                    let timeVi = time.timeTypeData.valueVi;
                                    let timeEn = time.timeTypeData.valueEn;
                                    let timeDisplay = language === LANGUAGE.VI ? timeVi : timeEn;
                                    return (
                                        <button key={index} 
                                            className={`btn btn-outline-primary ${language === LANGUAGE.VI ? "btn-vi" : "btn-en"}`}
                                            onClick={() => this.handleClickScheduleTime(time)}
                                            >
                                            {timeDisplay}
                                        </button>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="time-content">
                                <p><FormattedMessage id="patient.detail-doctor.no_time" /></p>
                            </div>
                        )}
                    </div>
                </div>
                <BookingModal 
                    isOpen={isModalOpen} 
                    onClose={this.closeBookingModal} 
                    dataTime={dataScheduleTimeModal}
                />
            </>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        scheduleDoctorByDate: state.user.scheduleDoctorByDate
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchDoctorScheduleByDate: (doctorId, date) => dispatch(actions.fetchDoctorScheduleByDate(doctorId, date)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorSchedule);
