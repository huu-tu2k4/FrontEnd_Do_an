import React, { Component } from 'react';
import { connect } from 'react-redux';

import './HomeHeader.scss';
import logo from '../../assets/logo_v3.png';
import { FormattedMessage } from 'react-intl';
import { LANGUAGE } from '../../utils/constant';
import { changeLanguageApp } from '../../store/actions/appActions';
import { withRouter } from 'react-router';



class HomeHeader extends Component {

changeLanguage = (language) => {
    // this.props.changeLanguageApp(language);
    this.props.changeLanguageAppRedux(language);
}

    render() {
        let language = this.props.language;
        return (
            <React.Fragment>
                <div className="home-header-container">
                    <div className="home-header-content">
                        <div className="left-content" onClick={() => this.props.history.push('/home')}>
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
                                <span className={`${language === LANGUAGE.VI ? 'active language-vi' : 'language-vi'}`} onClick={() => this.changeLanguage(LANGUAGE.VI)}>
                                    VN
                                </span>
                                <span className={`${language === LANGUAGE.EN ? 'active language-en' : 'language-en'}`} onClick={() => this.changeLanguage(LANGUAGE.EN)}>
                                    EN
                                </span>
                            </div>
                            <div className="btn btn-login" onClick={() => this.props.history.push('/login')}>
                                <i className="fas fa-user"></i>
                            </div>
                        </div>
                    </div>
                </div>
                {this.props.isShowBanner === true && (
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
                )}
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
        changeLanguageAppRedux: (language) => dispatch(changeLanguageApp(language))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomeHeader));
