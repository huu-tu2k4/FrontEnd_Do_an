import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import HomeHeader from '../../HomePage/HomeHeader';
import DoctorSchedule from '../Doctor/DoctorSchedule';
import DoctorExtraInfor from '../Doctor/DoctorExtraInfor';
import ProfileDoctor from '../Doctor/ProfileDoctor';
import { getDetailSpecialtyById, getAllCodeService } from '../../../services/userService';
import { LANGUAGE } from '../../../utils';

import './DetailSpecialty.scss';

class DetailSpecialty extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrDoctorId: [],
            listProvince: [],
            specialtyData: {},
            showDescription: false
        }
    }

    async componentDidMount() {
        if(this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            let location = this.props.match.params.location;

            let res = await getDetailSpecialtyById({
                id: id,
                location: 'ALL'
            });

            let resProvince = await getAllCodeService('PROVINCE');

            if(resProvince && resProvince.errCode === 0 && resProvince.data) {
                this.setState({
                    listProvince: resProvince.data
                })
            }

            if(res && res.errCode === 0 && res.data) {
                let data = res.data;
                let arrDoctorId = [];
                if(data && data.doctorSpecialty) {
                    data.doctorSpecialty.forEach(item => {
                        arrDoctorId.push(item.doctorId);
                    });
                }
                this.setState({
                    arrDoctorId: arrDoctorId,
                    specialtyData: data
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

    handleOnChangeSelect = async (event) => {
        
        if(this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            let location = event.target.value;
            let res = await getDetailSpecialtyById({
                id: id,
                location: location
            });
            if(res && res.errCode === 0 && res.data) {
                let data = res.data;
                let arrDoctorId = [];
                if(data && data.doctorSpecialty) {
                    data.doctorSpecialty.forEach(item => {
                        arrDoctorId.push(item.doctorId);
                    });
                }
                this.setState({
                    arrDoctorId: arrDoctorId,
                    specialtyData: data
                })
            }
        }
    }

    render() {
        let { arrDoctorId, specialtyData, listProvince, showDescription } = this.state;
        let { language } = this.props;
        let rawDesc = '';
        if (specialtyData && specialtyData.descriptionHTML) {
            rawDesc = specialtyData.descriptionHTML
                .replace(/<\s*br\s*\/?\s*>/gi, '\n')
                .replace(/<\s*\/p\s*>/gi, '\n')
                .replace(/<\s*\/div\s*>/gi, '\n')
                .replace(/<[^>]+>/g, '')
                .trim();
        }
        let snippet = rawDesc && rawDesc.length > 250 ? rawDesc.substring(0, 250) + '...' : rawDesc;
        console.log('check state: ', this.state);
        return (
            <div className='detail-specialty-container'>
                <HomeHeader />
                <div className='detail-specialty-body'>
                    <div className="description-specialty">
                        <div className="description-toggle">
                            <button className="btn-toggle-desc" onClick={this.toggleDescription}>
                                {showDescription ? (language === LANGUAGE.VI ? 'Ẩn mô tả' : 'Hide description') : (language === LANGUAGE.VI ? 'Hiện mô tả' : 'Show description')}
                            </button>
                        </div>
                        {showDescription && specialtyData.descriptionHTML &&
                            <div dangerouslySetInnerHTML={{ __html: specialtyData.descriptionHTML }}></div>
                        }
                        {!showDescription && specialtyData.descriptionHTML &&
                            <div className="description-snippet">{snippet}</div>
                        }
                    </div>
                    
                    <div>
                        {
                            language === LANGUAGE.VI ?
                            <div className="title">Danh sách các bác sĩ chuyên khoa {specialtyData.nameVi}</div>
                            :
                            <div className="title">List of Doctors in Specialty {specialtyData.nameEn}</div>
                        }
                    </div>
                    <div className="search-sp-doctor">
                        <select className='select-province' onChange={(event) => this.handleOnChangeSelect(event)}>
                            <option value='ALL'>
                                {language === LANGUAGE.VI ? 'Toàn quốc' : 'All'}
                            </option>
                            {listProvince && listProvince.length > 0 && 
                                listProvince.map((item, index) => {
                                    return (
                                        <option key={index} value={item.keyMap}>
                                            {language === LANGUAGE.VI ? item.valueVi : item.valueEn}
                                        </option>
                                    )
                                })
                            }
                        </select>
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailSpecialty);
