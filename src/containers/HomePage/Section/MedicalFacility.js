import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Slider from 'react-slick';
import { fetchAllClinics } from '../../../store/actions/adminActions';
import SectionLoadingOverlay from '../../../components/SectionLoadingOverlay/SectionLoadingOverlay';
import { withRouter } from 'react-router';

class MedicalFacility extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    async componentDidMount() {
        this.props.fetchAllClinics();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    handleViewDetailClinic = (item) => {
        if (this.props.history) {
            this.props.history.push(`/detail-clinic/${item.id}`);
        }
    }

    render() {
        return (
            <div className="section-share section-medical-facility">
                <div className="section-container">
                    <div className="section-header">
                        <span className="title-section"><FormattedMessage id="section.medical-facility" /></span>
                        <button className="btn-section" onClick={() => this.props.history.push('/clinics')}><FormattedMessage id="section.see-more" /></button>
                    </div>
                    <div className="section-body" style={{ position: 'relative' }}>
                        <SectionLoadingOverlay active={this.props.isLoadingClinics} text={this.props.language === 'vi' ? 'Đang tải...' : 'Loading...'} />
                        <Slider {...this.props.settings}>
                            {(this.props.clinics || []).map((item, index) => {
                                return (
                                    <div className="section-customize medical-facility-item" key={index} onClick={() => this.handleViewDetailClinic(item)}>
                                        
                                        <div 
                                            className="bg-image section-medical-facility"
                                            style={{ backgroundImage: `url(${item.image})` }}
                                        > </div>
                                        <div className="medical-facility-name">
                                            <span>{item.name}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </Slider>
                    </div>
                    
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

const mapDispatch = {
    fetchAllClinics
};

const mapState = state => ({
    isLoggedIn: state.user.isLoggedIn,
    language: state.app.language,
    clinics: state.admin.clinics,
    isLoadingClinics: state.admin.isLoadingClinics
});

export default withRouter(connect(mapState, mapDispatch)(MedicalFacility));
