import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { fetchAllDoctorsWithQuery } from '../../../store/actions/adminActions';
import SectionLoadingOverlay from '../../../components/SectionLoadingOverlay/SectionLoadingOverlay';
import { LANGUAGE } from '../../../utils';
import HomeHeader from '../../HomePage/HomeHeader';
import DoctorSchedule from '../Doctor/DoctorSchedule';
import DoctorExtraInfor from '../Doctor/DoctorExtraInfor';
import ProfileDoctor from '../Doctor/ProfileDoctor';
import { connect } from 'react-redux';

import '../Specialty/DetailSpecialty.scss';

class AllDoctors extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            searchQuery: ''
        }
    }

    async componentDidMount() {
        await this.fetchDoctors('');
    }

    fetchDoctors = async (q) => {
        this.setState({ loading: true });
        try {
            await this.props.fetchAllDoctorsWithQuery(q);
        } catch (e) {
            console.error('fetchDoctors error', e);
        } finally {
            this.setState({ loading: false });
        }
    }

    handleSearchChange = (e) => {
        const q = e.target.value;
        this.setState({ searchQuery: q });
        if (this.searchTimeout) clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => this.fetchDoctors(q), 500);
    }

    render() {
        const { searchQuery = '' } = this.state;
        const doctors = this.props.allDoctors || [];
        const { language } = this.props;
        return (
            <div className="detail-clinic-container">
                <HomeHeader />
                <div className="detail-clinic-body">
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:12, marginBottom:12}}>
                        {language === LANGUAGE.VI ?
                            <div className="title">Danh sách bác sĩ</div>
                            :
                            <div className="title">List of Doctors</div>
                        }
                        <div style={{position:'relative', display:'flex', alignItems:'center', width:'100%', justifyContent:'flex-end'}}>
                            <input
                                className="list-search"
                                placeholder={language === LANGUAGE.VI ? 'Tìm theo tên...' : 'Search by name...'}
                                value={searchQuery || ''}
                                onChange={this.handleSearchChange}
                                style={{padding:8, borderRadius:6, border:'1px solid #e2e8f0', maxWidth:360, paddingRight:48}}
                            />
                                <div style={{position:'absolute', right:8, top: '50%', transform: 'translateY(-50%)', display:'flex', alignItems:'center', gap:8}}>
                                    {searchQuery ? (
                                        <button type="button" className="btn btn-sm btn-light p-0 text-muted" aria-label="Clear search" onClick={() => { this.setState({ searchQuery: '' }); if (this.searchTimeout) clearTimeout(this.searchTimeout); this.fetchDoctors(''); }} style={{ lineHeight: 1, display: 'inline-flex', alignItems: 'center' }}>
                                            ×
                                        </button>
                                    ) : null}
                                    <i className="fas fa-search" aria-hidden="true" style={{color:'#6b7280', lineHeight: 1, display: 'block'}} />
                                </div>
                        </div>
                    </div>

                    <div style={{ position: 'relative' }}>
                        <SectionLoadingOverlay active={this.state.loading} text={language === LANGUAGE.VI ? 'Đang tải...' : 'Loading...'} />
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
            </div>
        )
    }
}

const mapStateToProps = state => ({
    language: state.app.language,
    allDoctors: state.admin.allDoctors
});

const mapDispatch = {
    fetchAllDoctorsWithQuery
};

export default withRouter(connect(mapStateToProps, mapDispatch)(AllDoctors));
