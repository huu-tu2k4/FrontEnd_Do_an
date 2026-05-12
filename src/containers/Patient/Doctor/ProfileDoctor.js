import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import { getProfileDoctorById } from '../../../services/userService';
import NumberFormat from 'react-number-format';
import { LANGUAGE } from '../../../utils';
import moment from 'moment';
import _ from 'lodash';
import { Link } from 'react-router-dom';

import './ProfileDoctor.scss';

class ProfileDoctor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataProfile: {},
            nameDoctor: '',
        }
    }

    async componentDidMount() {
        let data = await this.getInforDoctor(this.props.doctorId);
        this.setState({ dataProfile: data });
        let name = this.buildNameDoctor(data);
        this.setState({ nameDoctor: name });
    }

    getInforDoctor = async (id) => {
        let result = {};
        if(id) {
            let res = await getProfileDoctorById(id);
            if(res && res.errCode === 0) {
                result = res.data;
            }
        }
        return result;
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.language !== prevProps.language) {
            let data = await this.getInforDoctor(this.props.doctorId);
            this.setState({ dataProfile: data });
            let name = this.buildNameDoctor(data);
            this.setState({ nameDoctor: name });
        }
        if(this.props.doctorId !== prevProps.doctorId) {
            let data = await this.getInforDoctor(this.props.doctorId);
            this.setState({ dataProfile: data});
            let name = this.buildNameDoctor(data);
            this.setState({ nameDoctor: name });
        }
    }

    buildNameDoctor = (inputData) => {
        let fullName = '';
        let language = this.props.language;
        if (inputData) {
            let labelEn = `${inputData.firstName} ${inputData.lastName}`;
            let labelVi = `${inputData.lastName} ${inputData.firstName}`;
            fullName = language === LANGUAGE.VI ? labelVi : labelEn;
        }
        return fullName;
    }

    renderTimeBooking = (dataTime) => {
        let { language } = this.props;
        if(dataTime && !_.isEmpty(dataTime)) {
            let timeVi = dataTime["timeTypeData.valueVi"];
            let timeEn = dataTime["timeTypeData.valueEn"];
            let timeDisplay = language === LANGUAGE.VI ? timeVi : timeEn;
            let date = language === LANGUAGE.VI ?
                moment.unix(+dataTime.date / 1000).format('dddd - DD/MM/YYYY') :
                moment.unix(+dataTime.date / 1000).locale('en').format('ddd - MM/DD/YYYY');
            date = date.charAt(0).toUpperCase() + date.slice(1);
            
            return (
                <>
                    <div>
                        {timeDisplay}
                    </div>
                    <div>
                        {date}
                    </div>
                </>
            )
        } else {
            return <></>;
        }
    }

    render() {
        let { dataProfile } = this.state;
        // console.log('check props: ', this.props);
        let { language, isShowDescription, dataTime, isShowLinkDetail } = this.props;
        // console.log('check dataTime: ', dataTime);
        return (
            <div className="profile-doctor-container">
                <div className="intro-doctor">
                    <div className="content-left"
                        style={dataProfile && dataProfile.image ? { backgroundImage: `url(${dataProfile.image})` } : {}}
                    >

                    </div>
                    <div className="content-right">
                        <div className="up">
                            <div className="name-doctor">
                                {dataProfile && dataProfile.positionData ? (language === LANGUAGE.VI ? dataProfile.positionData.valueVi : dataProfile.positionData.valueEn) + ', ' : ''}{this.state.nameDoctor}
                            </div>
                        </div>
                        <div className="down">
                            {isShowDescription === true ? 
                            <>
                                {dataProfile.markdownData && dataProfile.markdownData.description &&
                                    <span>{dataProfile.markdownData.description}</span>
                                }
                            </> : <>
                                {dataTime && this.renderTimeBooking(dataTime)}
                            </>
                            }
                        </div>
                    </div>
                    
                </div>
                <div>
                    {isShowLinkDetail && isShowLinkDetail === true ? (
                        <div className="view-detail">
                            {/* <button className="btn-view-detail" onClick={this.handleViewDetail}>
                                {language === LANGUAGE.VI ? 'Xem thêm' : 'See more'}
                            </button> */}
                            <Link to={`/detail-doctor/${this.props.doctorId}`} className="btn-view-detail">
                                {language === LANGUAGE.VI ? 'Xem thêm' : 'See more'}
                            </Link>
                        </div>
                    ) : (
                        <div className="price">
                            <FormattedMessage id="patient.detail-doctor.price" />
                            {dataProfile && dataProfile.doctorInforData && dataProfile.doctorInforData.priceData ? (
                                language === LANGUAGE.VI ? (
                                    <NumberFormat
                                        className="currency"
                                        value={dataProfile.doctorInforData.priceData.valueVi}
                                        displayType={'text'}
                                        thousandSeparator={true}
                                        suffix={' VND'}
                                    />
                                ) : (
                                    <NumberFormat
                                        className="currency"
                                        value={dataProfile.doctorInforData.priceData.valueEn}
                                        displayType={'text'}
                                        thousandSeparator={true}
                                        suffix={'$'}
                                    />
                                )
                            ) : ('')}
                        </div>
                    )}
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileDoctor);
