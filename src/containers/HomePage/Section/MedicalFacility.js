import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Slider from 'react-slick';
import { getAllClinic } from '../../../services/userService';
import { withRouter } from 'react-router';

class MedicalFacility extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataClinics: []
        }
    }

    async componentDidMount() {
        let res = await getAllClinic();
        if (res && res.data) {
            this.setState({
                dataClinics: res.data
            });
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
                    <div className="section-body">
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
