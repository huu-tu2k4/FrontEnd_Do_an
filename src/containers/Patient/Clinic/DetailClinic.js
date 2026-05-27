import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import HomeHeader from '../../HomePage/HomeHeader';
import DoctorSchedule from '../Doctor/DoctorSchedule';
import DoctorExtraInfor from '../Doctor/DoctorExtraInfor';
import ProfileDoctor from '../Doctor/ProfileDoctor';
import { getDetailClinicById } from '../../../services/userService';
import { LANGUAGE } from '../../../utils';

import './DetailClinic.scss';

class DetailClinic extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrDoctorId: [],
            clinicData: {},
            showDescription: false
        }
    }

    async componentDidMount() {
        if(this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;

            let res = await getDetailClinicById({
                id: id
            });

            if(res && res.errCode === 0 && res.data) {
                let data = res.data;
                let arrDoctorId = [];
                if(data && data.doctorClinic) {
                    data.doctorClinic.forEach(item => {
                        arrDoctorId.push(item.doctorId);
                    });
                }
                this.setState({
                    arrDoctorId: arrDoctorId,
                    clinicData: data
                })
            }
        }
        
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.language !== prevProps.language) {

        }
    }

    toggleDescription = () => {
        this.setState(prevState => ({
            showDescription: !prevState.showDescription
        }));
    }

    render() {
        let { arrDoctorId, clinicData, showDescription } = this.state;
        let { language } = this.props;
        let rawDesc = '';
        if (clinicData && clinicData.descriptionHTML) {
            rawDesc = clinicData.descriptionHTML
                .replace(/<\s*br\s*\/?\s*>/gi, '\n')
                .replace(/<\s*\/p\s*>/gi, '\n')
                .replace(/<\s*\/div\s*>/gi, '\n')
                .replace(/<[^>]+>/g, '')
                .trim();
        }
        let snippet = rawDesc && rawDesc.length > 250 ? rawDesc.substring(0, 250) + '...' : rawDesc;
        return (
            <div className='detail-clinic-container'>
                <HomeHeader />
                <div className='detail-clinic-body'>
                    <div className="description-clinic">
                        <div className="description-toggle">
                            <button className="btn-toggle-desc" onClick={this.toggleDescription}>
                                {showDescription ? (language === LANGUAGE.VI ? 'Ẩn mô tả' : 'Hide description') : (language === LANGUAGE.VI ? 'Hiện mô tả' : 'Show description')}
                            </button>
                        </div>
                        {showDescription && clinicData.descriptionHTML &&
                            <div dangerouslySetInnerHTML={{ __html: clinicData.descriptionHTML }}></div>
                        }
                        {!showDescription && clinicData.descriptionHTML &&
                            <div className="description-snippet">{snippet}</div>
                        }
                    </div>
                    
                    <div>
                        {
                            language === LANGUAGE.VI ?
                            <div className="title">Danh sách các bác sĩ thuộc {clinicData.name}</div>
                            :
                            <div className="title">List of Doctors in clinic {clinicData.name}</div>
                        }
                    </div>
                    {
                        arrDoctorId && arrDoctorId.length > 0 &&
                        arrDoctorId.map((item, index) => {
                            return (
                                <div className="each-doctor" key={index}>
                                    <div className="dt-content-left">
                                        <div className="profile-doctor">
                                            <ProfileDoctor 
                                            doctorId={item} 
                                            isShowDescription={true}
                                            isShowLinkDetail={true}
                                            // dataTime={this.props.location && this.props.location.state ? this.props.location.state.dataTime : ''}
                                            />
                                        </div>
                                    </div>
                                    <div className="dt-content-right">
                                        <div className="doctor-schedule">
                                            <DoctorSchedule doctorIdFromParent={item} />
                                        </div>
                                        <div className="doctor-extra-infor">
                                            <DoctorExtraInfor doctorIdFromParent={item} />
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailClinic);
