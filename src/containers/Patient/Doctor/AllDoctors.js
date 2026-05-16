import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { getAllDoctors } from '../../../services/userService';
import HomeHeader from '../../HomePage/HomeHeader';
import DoctorSchedule from '../Doctor/DoctorSchedule';
import DoctorExtraInfor from '../Doctor/DoctorExtraInfor';
import ProfileDoctor from '../Doctor/ProfileDoctor';
import { LANGUAGE } from '../../../utils';
import { connect } from 'react-redux';

import '../Specialty/DetailSpecialty.scss';

class AllDoctors extends Component {
    constructor(props) {
        super(props);
        this.state = {
            doctors: []
        }
    }

    async componentDidMount() {
        let res = await getAllDoctors();
        if (res && res.data) {
            this.setState({ doctors: res.data });
        }
    }

    render() {
        const { doctors } = this.state;
        const { language } = this.props;
        return (
            <div className="detail-clinic-container">
                <HomeHeader />
                <div className="detail-clinic-body">
                    <div>
                        {language === LANGUAGE.VI ?
                            <div className="title">Danh sách bác sĩ</div>
                            :
                            <div className="title">List of Doctors</div>
                        }
                    </div>
                    {doctors && doctors.length > 0 && doctors.map((item, index) => {
                        return (
                            <div className="each-doctor" key={index}>
                                <div className="dt-content-left">
                                    <div className="profile-doctor">
                                        <ProfileDoctor
                                            doctorId={item.id}
                                            isShowDescription={true}
                                            isShowLinkDetail={true}
                                        />
                                    </div>
                                </div>
                                <div className="dt-content-right">
                                    <div className="doctor-schedule">
                                        <DoctorSchedule doctorIdFromParent={item.id} />
                                    </div>
                                    <div className="doctor-extra-infor">
                                        <DoctorExtraInfor doctorIdFromParent={item.id} />
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({ language: state.app.language });

export default withRouter(connect(mapStateToProps)(AllDoctors));
