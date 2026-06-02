import React, { Component } from 'react';
import { connect } from 'react-redux';

import { FormattedMessage } from 'react-intl';
import Slider from 'react-slick';
import { fetchAllSpecialties } from '../../../store/actions/adminActions';
import SectionLoadingOverlay from '../../../components/SectionLoadingOverlay/SectionLoadingOverlay';
import { withRouter } from 'react-router';


class Specialty extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        this.props.fetchAllSpecialties();
    }
    

    handleViewDetailSpecialty = (item) => {
        if (this.props.history) {
            this.props.history.push(`/detail-specialty/${item.id}`);
        }
    }

    render() {
        let arrSpecialties = this.props.specialties || [];
        let { language } = this.props;
        return (
            <div className="section-share section-specialty">
                <div className="section-container">
                    <div className="section-header">
                        <span className="title-section"><FormattedMessage id="section.specialty" /></span>
                        <button className="btn-section" onClick={() => this.props.history.push('/specialties')}><FormattedMessage id="section.see-more" /></button>
                    </div>
                    <div className="section-body" style={{ position: 'relative' }}>
                        <SectionLoadingOverlay active={this.props.isLoadingSpecialties} text={this.props.language === 'vi' ? 'Đang tải...' : 'Loading...'} />
                        <Slider {...this.props.settings}>
                            {arrSpecialties && arrSpecialties.length > 0 &&
                                arrSpecialties.map((item, index) => {
                                    return (
                                        <div 
                                        className="section-customize specialty-item" 
                                        key={index}
                                        onClick={() => this.handleViewDetailSpecialty(item)}
                                        >
                                            <div 
                                            className="bg-image section-specialty"
                                            style={{ backgroundImage: `url(${item.image})` }}
                                            > </div>
                                            <div className="specialty-name">
                                                <span>{language === 'vi' ? item.nameVi : item.nameEn}</span>
                                            </div>
                                        </div>
                                    );
                                })
                            }
                        </Slider>
                    </div>
                    
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        specialties: state.admin.specialties,
        isLoadingSpecialties: state.admin.isLoadingSpecialties
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

const mapDispatch = {
    fetchAllSpecialties
};

export default withRouter(connect(mapStateToProps, mapDispatch)(Specialty));
