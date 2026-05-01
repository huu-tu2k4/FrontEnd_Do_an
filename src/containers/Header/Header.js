import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from "../../store/actions";
import Navigator from '../../components/Navigator';
import { adminMenu, doctorMenu } from './menuApp';
import { FormattedMessage } from 'react-intl';
import { LANGUAGE, USER_ROLE } from '../../utils/constant';
import { changeLanguageApp } from '../../store/actions/appActions';

import './Header.scss';
import _ from 'lodash';

class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {
            menuApp: [],
        }
    }

    changeLanguage = (language) => {
        // this.props.changeLanguageApp(language);
        this.props.changeLanguageAppRedux(language);
    }
    
    componentDidMount() {
        let {userInfo} = this.props;
        let menu = [];
        if(userInfo && !_.isEmpty(userInfo)) {
            let role = userInfo.roleId;
            if(role === USER_ROLE.ADMIN) {
                menu = adminMenu;
            } else if(role === USER_ROLE.DOCTOR) {
                menu = doctorMenu;
            }
        }
        this.setState({ menuApp: menu });
    }
    render() {
        const { processLogout, language, userInfo } = this.props;
        return (
            <div className="header-container">
                {/* thanh navigator */}
                <div className="header-tabs-container">
                    <Navigator menus={this.state.menuApp} />
                </div>

                <div className="language">
                    <span className="wellcome"><FormattedMessage id="home_header.wellcome" />{userInfo && userInfo.firstName ? userInfo.firstName : ''}</span>
                    <span className={`${language === LANGUAGE.VI ? 'active language-vi' : 'language-vi'}`} onClick={() => this.changeLanguage(LANGUAGE.VI)}>
                        VN
                    </span>
                    <span className={`${language === LANGUAGE.EN ? 'active language-en' : 'language-en'}`} onClick={() => this.changeLanguage(LANGUAGE.EN)}>
                        EN
                    </span>
                    {/* nút logout */}
                    <div className="btn btn-logout" onClick={processLogout} title='Log out'>
                        <i className="fas fa-sign-out-alt"></i>
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
        userInfo: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
        changeLanguageAppRedux: (language) => dispatch(changeLanguageApp(language))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
