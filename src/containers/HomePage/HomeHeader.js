import React, { Component } from 'react';
import { connect } from 'react-redux';

import './HomeHeader.scss';
import logo from '../../assets/logo_v3.png';
import { FormattedMessage } from 'react-intl';

class HomeHeader extends Component {

    render() {
        return (
            <React.Fragment>
                <div className="home-header-container">
                    <div className="home-header-content">
                        <div className="left-content">
                            <i className="fas fa-bars"></i>
                            <div className="header-logo">
                                <img src={logo} alt="Logo" />
                            </div>
                        </div>
                        <div className="center-content">
                            <div className="child-content">
                                <div className="title"><b><FormattedMessage id="home_header.specialty" /></b></div>
                                <div className="sub-title"><FormattedMessage id="home_header.find_doctor_by_specialty" /></div>
                            </div>
                            <div className="child-content">
                                <div className="title"><b><FormattedMessage id="home_header.medical_examination" /></b></div>
                                <div className="sub-title"><FormattedMessage id="home_header.select_hospital_clinic" /></div>
                            </div>
                            <div className="child-content">
                                <div className="title"><b><FormattedMessage id="home_header.doctor" /></b></div>
                                <div className="sub-title"><FormattedMessage id="home_header.find_good_doctor" /></div>
                            </div>
                            <div className="child-content">
                                <div className="title"><b><FormattedMessage id="home_header.package" /></b></div>
                                <div className="sub-title"><FormattedMessage id="home_header.full_body_checkup" /></div>
                            </div>
                        </div>
                        <div className="right-content">
                            <div className="support">
                                <i className="fas fa-question-circle"></i>
                                <span><FormattedMessage id="home_header.support" /></span>
                            </div>
                            <div className="language">
                                <span className="language-vi">VN</span>
                                <span className="language-en">EN</span>
                            </div>

                        </div>
                    </div>
                </div>
                <div className="home-header-banner">
                    <div className="content-up">
                        <div className="title1">
                            <FormattedMessage id="banner.title1" />
                        </div>
                        <div className="title2">
                            <FormattedMessage id="banner.title2" />
                        </div>
                        <div className="search">
                            <i className="fas fa-search"></i>
                            <input type="text" placeholder={<FormattedMessage id="banner.search-placeholder" />} />
                        </div>
                    </div>
                    <div className="content-down">
                        <div className="options">
                            <div className="option-child">
                                <div className="icon-child">
                                    <i className="far fa-hospital"></i>
                                </div>
                                <div className="text-child">
                                    <FormattedMessage id="banner.child1" />
                                </div>
                            </div>
                        </div>
                        <div className="options">
                            <div className="option-child">
                                <div className="icon-child">
                                    <i className="fas fa-mobile-alt"></i>
                                </div>
                                <div className="text-child">
                                    <FormattedMessage id="banner.child2" />
                                </div>
                            </div>
                        </div>
                        <div className="options">
                            <div className="option-child">
                                <div className="icon-child">
                                    <i className="fas fa-procedures"></i>
                                </div>
                                <div className="text-child">
                                    <FormattedMessage id="banner.child3" />
                                </div>
                            </div>
                        </div>
                        <div className="options">
                            <div className="option-child">
                                <div className="icon-child">
                                    <i className="fas fa-vial"></i>
                                </div>
                                <div className="text-child">
                                    <FormattedMessage id="banner.child4" />
                                </div>
                            </div>
                        </div>
                        <div className="options">
                            <div className="option-child">
                                <div className="icon-child">
                                    <i className="fas fa-user-md"></i>
                                </div>
                                <div className="text-child">
                                    <FormattedMessage id="banner.child5" />
                                </div>
                            </div>
                        </div>
                        <div className="options">
                            <div className="option-child">
                                <div className="icon-child">
                                    <i className="fas fa-briefcase-medical"></i>
                                </div>
                                <div className="text-child">
                                    <FormattedMessage id="banner.child6" />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    
                </div>
            </React.Fragment>
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeHeader);
