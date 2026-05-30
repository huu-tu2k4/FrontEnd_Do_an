import React, { Component } from 'react';
import { connect } from 'react-redux';

import { FormattedMessage } from 'react-intl';
import Slider from 'react-slick';
import { getAllSpecialty } from '../../../services/userService';
import SectionLoadingOverlay from '../../../components/SectionLoadingOverlay/SectionLoadingOverlay';
import { withRouter } from 'react-router';


class Specialty extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrSpecialties: [],
            loading: false
        }
    }

    componentDidMount() {
        this.handleGetAllSpecialty();
    }

    handleGetAllSpecialty = async () => {
        this.setState({ loading: true });
        try {
            let res = await getAllSpecialty();
            if (res && res.data) {
                this.setState({ arrSpecialties: res.data ? res.data : [] });
            }
        } catch (e) {
            console.error('Fetch specialties error', e);
        } finally {
            this.setState({ loading: false });
        }
    }

    handleViewDetailSpecialty = (item) => {
        if (this.props.history) {
            this.props.history.push(`/detail-specialty/${item.id}`);
        }
    }

    render() {
        let arrSpecialties = this.state.arrSpecialties;
        let { language } = this.props;
        return (
            <div className="section-share section-specialty">
                <div className="section-container">
                    <div className="section-header">
                        <span className="title-section"><FormattedMessage id="section.specialty" /></span>
                        <button className="btn-section" onClick={() => this.props.history.push('/specialties')}><FormattedMessage id="section.see-more" /></button>
                    </div>
                    <div className="section-body" style={{ position: 'relative' }}>
                        <SectionLoadingOverlay active={this.state.loading} text={this.props.language === 'vi' ? 'Đang tải...' : 'Loading...'} />
                        <Slider {...this.props.settings}>
                            {this.state.arrSpecialties && this.state.arrSpecialties.length > 0 &&
                                this.state.arrSpecialties.map((item, index) => {
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
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Specialty));
