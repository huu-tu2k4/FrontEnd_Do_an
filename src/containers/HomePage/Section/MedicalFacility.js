import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Slider from 'react-slick';
import { getAllClinic } from '../../../services/userService';
import SectionLoadingOverlay from '../../../components/SectionLoadingOverlay/SectionLoadingOverlay';
import { withRouter } from 'react-router';

class MedicalFacility extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataClinics: [],
            loading: false
        }
    }

    async componentDidMount() {
        this.setState({ loading: true });
        try {
            let res = await getAllClinic();
            if (res && res.data) {
                this.setState({ dataClinics: res.data });
            }
        } catch (e) {
            console.error('Fetch clinics error', e);
        } finally {
            this.setState({ loading: false });
        }
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
                        <SectionLoadingOverlay active={this.state.loading} text={this.props.language === 'vi' ? 'Đang tải...' : 'Loading...'} />
                        <Slider {...this.props.settings}>
                            {this.state.dataClinics.map((item, index) => {
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MedicalFacility));
