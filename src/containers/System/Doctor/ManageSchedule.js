import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import Select from 'react-select';
import * as actions from '../../../store/actions';
import { LANGUAGE, dateFormat, USER_ROLE } from '../../../utils';
import DatePicker from '../../../components/Input/DatePicker';
import moment from 'moment';
import _ from 'lodash';
import { toast } from 'react-toastify';

import './ManageSchedule.scss';

class ManageSchedule extends Component {

    constructor(props) {
        super(props);
        this.state = {
            listDoctors: [],
            selectedDoctor: {},
            currentDate: '',
            rangeTime: []
        }
    }

    componentDidMount() {
        this.props.fetchAllDoctors();
        this.props.fetchAllCodeScheduleTime();
        this.setDefaultDoctor();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.listDoctors !== this.props.listDoctors) {
            let dataSelect = this.buildDataInputSelect(this.props.listDoctors);
            this.setState({
                listDoctors: dataSelect
            })
            this.setDefaultDoctor();
        }
        if(prevProps.language !== this.props.language) {
            let dataSelect = this.buildDataInputSelect(this.props.listDoctors);
            this.setState({
                listDoctors: dataSelect
            })
            this.setDefaultDoctor();
        }
        if (prevProps.userInfo !== this.props.userInfo) {
            this.setDefaultDoctor();
        }
        if(prevProps.allScheduleTime !== this.props.allScheduleTime) {
            let data = this.props.allScheduleTime;
            if(data && data.length > 0) {
                data = data.map(item => ({...item, isSelected: false}));
            }
            this.setState({
                rangeTime: data
            })
        }
    }

    setDefaultDoctor = () => {
        const { userInfo, language } = this.props;
        if (userInfo && userInfo.roleId === USER_ROLE.DOCTOR) {
            // try to find in listDoctors first
            let doctorOption = null;
            if (this.state.listDoctors && this.state.listDoctors.length > 0) {
                doctorOption = this.state.listDoctors.find(d => d.value === userInfo.id);
            }
            if (!doctorOption) {
                let labelEn = `${userInfo.firstName} ${userInfo.lastName}`;
                let labelVi = `${userInfo.lastName} ${userInfo.firstName}`;
                doctorOption = {
                    label: language === LANGUAGE.VI ? labelVi : labelEn,
                    value: userInfo.id
                };
            }
            this.setState({ selectedDoctor: doctorOption });
        }
    }

    buildDataInputSelect = (inputData) => {
        let result = [];
        let language = this.props.language;
        if (inputData && inputData.length > 0) {
            inputData.map((item, index) => {
                let object = {};
                let labelEn = `${item.firstName} ${item.lastName}`;
                let labelVi = `${item.lastName} ${item.firstName}`;
                object.label = language === LANGUAGE.VI ? labelVi : labelEn;
                object.value = item.id;
                result.push(object);
            })
        }
        return result;
    }

    handleChange = async (selectedDoctor) => {
        this.setState({ selectedDoctor: selectedDoctor });

        
    }

    handleChangeDatePicker = (date) => {
        this.setState({
            currentDate: date[0]
        })
    }

    handleSelectTime = (time) => {
        let { rangeTime } = this.state;
        if (rangeTime && rangeTime.length > 0) {
            rangeTime = rangeTime.map(item => {
                if (item.id === time.id) {
                    item.isSelected = !item.isSelected;
                }
                return item;
            })
            this.setState({
                rangeTime: rangeTime
            })
        }
    }

    handleSaveSchedule = async () => {
        let { rangeTime, selectedDoctor, currentDate } = this.state;
        let result = [];
        if (!currentDate) {
            toast.error('Please select a date');
            return;
        }
        if (!selectedDoctor || _.isEmpty(selectedDoctor)) {
            toast.error('Please select a doctor');
            return;
        }
        if (!rangeTime || rangeTime.length === 0) {
            toast.error('Please select a time');
            return;
        }

        let formatedDate = new Date(currentDate).getTime();
        
        if (rangeTime && rangeTime.length > 0 && selectedDoctor && _.isEmpty(selectedDoctor) === false) {
            let selectedTime = rangeTime.filter(item => item.isSelected === true);
            if (selectedTime && selectedTime.length > 0) {
                selectedTime.map(item => {
                    let object = {};
                    object.doctorId = selectedDoctor.value;
                    object.date = formatedDate;
                    object.timeType = item.keyMap;
                    result.push(object);
                })
            }
        }
        let res = await this.props.saveBulkScheduleDoctor({
            arrSchedule: result,
            doctorId: selectedDoctor.value,
            date: formatedDate
        });
    }


    render() {
        let { language, userInfo } = this.props;
        let { rangeTime } = this.state;
        return (
            <div className="manage-schedule-container">
                <div className="m-s-title">
                    <FormattedMessage id="manage-schedule.title" />
                </div>
                <div className="container">
                    <div className="row">
                        {!(userInfo && userInfo.roleId === USER_ROLE.DOCTOR) && (
                            <div className="col-6 form-group">
                                <label><FormattedMessage id="manage-schedule.select-doctor" /></label>
                                <Select
                                    value={this.state.selectedDoctor}
                                    onChange={this.handleChange}
                                    options={this.state.listDoctors}
                                />
                            </div>
                        )}
                        <div className="col-6 form-group">
                            <label><FormattedMessage id="manage-schedule.select-date" /></label>
                            <div className="date-picker-wrapper">
                                <DatePicker
                                    value={this.state.currentDate}
                                    className="form-control"
                                    onChange={this.handleChangeDatePicker}
                                    minDate={moment().startOf('day').toDate()}
                                />
                                <i className="calendar-icon fas fa-calendar"></i>
                            </div>
                        </div>
                        <div className="col-12 pick-hour-container">
                            <label><FormattedMessage id="manage-schedule.select-hour" /></label>
                            <div className="pick-hour-content">
                                {rangeTime && rangeTime.length > 0 &&
                                    rangeTime.map((item, index) => {
                                        return (
                                            <button
                                                key={index}
                                                className={`btn btn-schedule ${item.isSelected ? 'active' : ''}`}
                                                onClick={() => this.handleSelectTime(item)}
                                            >
                                                {language === LANGUAGE.VI ? item.valueVi : item.valueEn}
                                            </button>
                                        );
                                    })
                                }
                            </div>
                        </div>
                        <div className="col-12">
                            <button 
                            className="btn btn-save-schedule btn-primary"
                            onClick={() => this.handleSaveSchedule()}
                            ><FormattedMessage id="manage-schedule.save" /></button>
                        </div>

                    </div>

                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        listDoctors: state.admin.allDoctors,
        allScheduleTime: state.admin.allScheduleTime
        ,userInfo: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
        saveDetailDoctor: (data) => dispatch(actions.saveDetailDoctor(data)),
        fetchAllCodeScheduleTime: () => dispatch(actions.fetchAllCodeScheduleTime()),
        saveBulkScheduleDoctor: (data) => dispatch(actions.saveBulkScheduleDoctor(data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);
