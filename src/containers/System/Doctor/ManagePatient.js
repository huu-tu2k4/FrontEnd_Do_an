import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from 'react-intl';
import DatePicker from '../../../components/Input/DatePicker';
import { getAllPatientForDoctor, getDetailInforDoctor } from '../../../services/userService';
import moment from 'moment';
import { LANGUAGE } from '../../../utils';
import RemedyModal from './RemedyModal';
import { postSendRemedy } from '../../../services/userService';
import { toast } from 'react-toastify';
import _ from 'lodash';
// replaced react-loading-overlay with a global portal overlay
import GlobalLoadingOverlay from '../../../components/GlobalLoadingOverlay/GlobalLoadingOverlay';

import './ManagePatient.scss';

class ManagePatient extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentDate: moment(new Date()).startOf('day').valueOf(),
            dataPatient: [],
            isOpenRemedyModal: false,
            dataModal: {},
            isShowLoading: false
        }
    }

    async componentDidMount() {
        
        await this.getDataPatient();
    }
    getDataPatient = async () => {
        let { userInfo } = this.props;
        let { currentDate } = this.state;

        let formattedDate = new Date(currentDate).getTime();
        let res = await getAllPatientForDoctor({
            doctorId: userInfo.id,
            date: formattedDate
        });
        this.setState({
            dataPatient: res.data || []
        });
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.language !== prevProps.language) {

        }
    }

    handleOnChangeDatePicker = (date) => {
        this.setState({
            currentDate: date[0]
        }, async () => {
            await this.getDataPatient();
        });
    }

    handleBtnConfirm = (item) => {
        this.setState({
            isOpenRemedyModal: true,
            dataModal: item
        });
    }

    buildNameDoctor = async (dataModal) => {
        let res = await getDetailInforDoctor(dataModal.doctorId);
        let nameDoctor = '';
        if(res && res.errCode === 0) {
            let data = res.data;
            let labelEn = `${data.firstName} ${data.lastName}`;
            let labelVi = `${data.lastName} ${data.firstName}`;
            nameDoctor = this.props.language === LANGUAGE.VI ? labelVi : labelEn;
        }
        return nameDoctor;
    }

    sendRemedy = async (dataFromModal) => {
        let { dataModal } = this.state;
        this.setState({
            isShowLoading: true
        });
        let doctorName = await this.buildNameDoctor(dataModal);
        let res = await postSendRemedy({
            email: dataFromModal.email,
            imgBase64: dataFromModal.imgBase64,
            doctorId: dataModal.doctorId,
            patientId: dataModal.patientId,
            timeType: dataModal.timeType,
            language: this.props.language,
            doctorName: doctorName,
            patientName: this.props.language === LANGUAGE.VI ? dataModal.patientData.lastName + ' ' + dataModal.patientData.firstName : dataModal.patientData.firstName + ' ' + dataModal.patientData.lastName
        });
        if(res && res.errCode === 0) {
            toast.success('Send remedy successfully!');

            this.setState({
                isOpenRemedyModal: false,
                dataModal: {},
                isShowLoading: false
            }, async () => {
                await this.getDataPatient();
            });
        }
        else {
            toast.error('Something went wrong...');
            this.setState({
                isShowLoading: false
            });
            console.log('check res: ', res);
        }
    }

    render() {
        let { dataPatient } = this.state;
        let { intl, language } = this.props;
        return (
            <>
                <GlobalLoadingOverlay active={this.state.isShowLoading} text={'Loading...'} />
                <div className="manage-patient-container">
                        <div className="m-p-title">
                            <FormattedMessage id="manage-patient.title" />
                        </div>
                        <div className="manage-patient-body row">
                            
                            <div className="col-6 form-group">
                                <label><FormattedMessage id="manage-patient.select-date" /></label>
                                <div className="date-picker-wrapper">
                                    <DatePicker
                                        onChange={this.handleOnChangeDatePicker}
                                        className="form-control"
                                        value={this.state.currentDate}
                                    />
                                    <i className="calendar-icon fas fa-calendar"></i>
                                </div>
                            </div>
                        </div>
                        <div className="title-table">
                            <FormattedMessage id="manage-patient.patient-list" />: {moment(new Date(this.state.currentDate)).format('DD/MM/YYYY')}
                        </div>
                        <div className="col-12 table-manage-patient">
                            <table id="customers">
                                <thead>
                                    <tr>
                                        <th><FormattedMessage id="manage-patient.table.index" /></th>
                                        <th><FormattedMessage id="manage-patient.table.time" /></th>
                                        <th><FormattedMessage id="manage-patient.table.name" /></th>
                                        <th><FormattedMessage id="manage-patient.table.gender" /></th>
                                        <th><FormattedMessage id="manage-patient.table.email" /></th>
                                        <th><FormattedMessage id="manage-patient.table.phone" /></th>
                                        <th><FormattedMessage id="manage-patient.table.action" /></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataPatient && dataPatient.length > 0 ?
                                        dataPatient.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{
                                                        language === LANGUAGE.VI ? item.timeTypeDataPatient.valueVi : item.timeTypeDataPatient.valueEn
                                                        }</td>
                                                    <td>{
                                                        language === LANGUAGE.VI ? item.patientData.lastName + ' ' + item.patientData.firstName : item.patientData.firstName + ' ' + item.patientData.lastName
                                                        }</td>
                                                    <td>{
                                                        language === LANGUAGE.VI ? item.patientData.genderData.valueVi : item.patientData.genderData.valueEn
                                                        }</td>
                                                    <td>{item.patientData.email}</td>
                                                    <td>{item.patientData.phone}</td>
                                                    <td>
                                                        <button
                                                            className="btn btn-primary icon-btn"
                                                            title={intl.formatMessage({ id: 'manage-patient.confirm-and-send-remedy' })}
                                                            aria-label={intl.formatMessage({ id: 'manage-patient.confirm-and-send-remedy' })}
                                                            onClick={() => this.handleBtnConfirm(item)}
                                                        ><i className="fas fa-check" aria-hidden="true"></i></button>
                                                        
                                                        {/* <button
                                                            className="btn btn-danger icon-btn"
                                                            title={intl.formatMessage({ id: 'manage-patient.cancel' })}
                                                            aria-label={intl.formatMessage({ id: 'manage-patient.cancel' })}
                                                        ><i className="fas fa-times" aria-hidden="true"></i></button>

                                                        <button
                                                            className="btn btn-warning icon-btn"
                                                            title={intl.formatMessage({ id: 'manage-patient.send-invoice' })}
                                                            aria-label={intl.formatMessage({ id: 'manage-patient.send-invoice' })}
                                                        ><i className="fas fa-envelope" aria-hidden="true"></i></button> */}
                                                    </td>
                                                </tr>
                                            );
                                        })

                                        : <tr><td colSpan="7" style={{textAlign: "center"}}><FormattedMessage id="manage-patient.no-data" /></td></tr>
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                <RemedyModal
                        isOpen={this.state.isOpenRemedyModal}
                        dataModal={this.state.dataModal}
                        closeRemedyModal={() => this.setState({ isOpenRemedyModal: false })}
                        sendRemedy={this.sendRemedy}
                />
            </>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        userInfo: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
        
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(ManagePatient));
