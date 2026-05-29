import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from "../../store/actions";
import Navigator from '../../components/Navigator';
import { adminMenu, doctorMenu } from './menuApp';
import { FormattedMessage } from 'react-intl';
import { LANGUAGE, USER_ROLE, path } from '../../utils/constant';
import { changeLanguageApp } from '../../store/actions/appActions';
import { withRouter } from 'react-router';

import './Header.scss';
import _ from 'lodash';
import logo from '../../assets/logo.png';

class Header extends Component {

    constructor(props) {
            super(props);
            this.state = {
                    menuApp: [],
                    isLanguageMenuOpen: false,
            isUserMenuOpen: false,
                    isMobileMenuOpen: false
            ,isMenuOpen: false
            }
            this.languageMenuRef = null;
            this.userMenuRef = null;
        this.menuRef = null;
    }

    changeLanguage = (language) => {
            this.props.changeLanguageAppRedux(language);
            this.setState({ isLanguageMenuOpen: false });
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

            document.addEventListener('click', this.handleDocumentClick);
    }

    componentWillUnmount() {
            document.removeEventListener('click', this.handleDocumentClick);
    }

    handleDocumentClick = (e) => {
            if (this.languageMenuRef && !this.languageMenuRef.contains(e.target)) {
                    this.setState({ isLanguageMenuOpen: false });
            }
            if (this.userMenuRef && !this.userMenuRef.contains(e.target)) {
                    this.setState({ isUserMenuOpen: false });
            }
        if (this.menuRef && !this.menuRef.contains(e.target)) {
            this.setState({ isMenuOpen: false });
        }
    }

    toggleLanguageMenu = () => {
            this.setState(prev => ({ isLanguageMenuOpen: !prev.isLanguageMenuOpen }));
    }

    toggleUserMenu = () => {
            this.setState(prev => ({ isUserMenuOpen: !prev.isUserMenuOpen }));
    }

    toggleMobileMenu = () => {
            this.setState(prev => ({ isMobileMenuOpen: !prev.isMobileMenuOpen }));
    }

    toggleMenu = () => {
        this.setState(prev => ({ isMenuOpen: !prev.isMenuOpen }));
    }

    handleNavigate = (link) => {
            if (link && this.props.history) this.props.history.push(link);
    }

    getUserFullName = () => {
            const { userInfo } = this.props;
            if (!userInfo) return '';
            if (userInfo.lastName) return `${userInfo.firstName || ''} ${userInfo.lastName || ''}`.trim();
            return userInfo.firstName || userInfo.email || '';
    }

    getUserInitials = () => {
            const { userInfo } = this.props;
            if (!userInfo) return '';
            const names = `${userInfo.firstName || ''} ${userInfo.lastName || ''}`.trim().split(' ');
            const initials = names.map(n => n[0]).slice(0,2).join('').toUpperCase();
            return initials || (userInfo.email ? userInfo.email[0].toUpperCase() : '');
    }

    buildImageUrl = (img) => {
        if (!img) return '';
        if (typeof img === 'string') {
            const s = img.trim();
            if (s.startsWith('data:') || s.startsWith('http') || s.startsWith('/')) return s;
            if (/^[A-Za-z0-9+/=\s]+$/.test(s)) return `data:image/jpeg;base64,${s}`;
            return s;
        }
        if (img.data && Array.isArray(img.data)) {
            try {
                const uint8 = new Uint8Array(img.data);
                try {
                    if (typeof TextDecoder !== 'undefined') {
                        const text = new TextDecoder().decode(uint8);
                        if (text && text.trim().startsWith('data:')) return text.trim();
                    }
                } catch (e) {}
                let binary = '';
                for (let i = 0; i < uint8.length; i++) binary += String.fromCharCode(uint8[i]);
                const b64 = typeof btoa === 'function' ? btoa(binary) : '';
                return b64 ? `data:image/jpeg;base64,${b64}` : '';
            } catch (e) {
                return '';
            }
        }
        return '';
    }

    getRoleName = () => {
            const { userInfo, language } = this.props;
            if (!userInfo) return '';
            const role = userInfo.roleId;
            if (role === USER_ROLE.ADMIN) return language === LANGUAGE.VI ? 'Quản trị' : 'Admin';
            if (role === USER_ROLE.DOCTOR) return language === LANGUAGE.VI ? 'Bác sĩ' : 'Doctor';
            return '';
    }

    handleLogout = () => {
            if (this.props.processLogout) this.props.processLogout();
    }

    render() {
        const { language, userInfo } = this.props;
        const { menuApp, isLanguageMenuOpen, isUserMenuOpen, isMobileMenuOpen } = this.state;
        const avatarUrl = this.buildImageUrl(userInfo && userInfo.image);

        // flatten menuApp (sections -> menus)
        const flatMenus = [];
        if (Array.isArray(menuApp)) {
            menuApp.forEach(section => {
                if (section && Array.isArray(section.menus)) {
                    section.menus.forEach(item => {
                        flatMenus.push(item);
                    });
                }
            });
        }

        return (
            <header className="admin-header">
                <div className="header-container">
                    {/* Menu Dropdown (left) */}
                    <div className="menu-dropdown" ref={(ref) => (this.menuRef = ref)}>
                        <button className="menu-toggle nav-item" onClick={this.toggleMenu}>
                            <i className="fas fa-bars"></i>
                            <span>Menu</span>
                            <i className={`fas fa-chevron-${this.state.isMenuOpen ? 'up' : 'down'} dropdown-icon`}></i>
                        </button>
                        {this.state.isMenuOpen && (
                            <div className="menu-list">
                                {flatMenus.map((menu, index) => (
                                    <button key={index} className="menu-item" onClick={() => { this.handleNavigate(menu.link); this.setState({ isMenuOpen: false }); }}>
                                        {menu.icon && <i className={menu.icon}></i>}
                                        <span><FormattedMessage id={menu.name} /></span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Logo and Brand */}
                    <div className="header-brand">
                        <div className="brand-logo">
                            <img src={logo} alt="ForHealth" />
                        </div>
                        <div className="brand-text">
                            <span className="brand-name">ForHealth</span>
                            <span className="brand-subtitle">
                                {language === LANGUAGE.VI ? 'Quản trị' : 'Admin Portal'}
                            </span>
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="header-actions">
                        {/* Language Switcher */}
                        <div className="language-dropdown" ref={(ref) => (this.languageMenuRef = ref)}>
                            <button className="language-toggle" onClick={this.toggleLanguageMenu}>
                                <i className="fas fa-globe"></i>
                                <span className="language-text">
                                    {language === LANGUAGE.VI ? 'Tiếng Việt' : 'English'}
                                </span>
                                <i className="fas fa-chevron-down dropdown-icon"></i>
                            </button>

                            {isLanguageMenuOpen && (
                                <div className="language-menu">
                                    <button
                                        className={`language-option ${language === LANGUAGE.VI ? 'active' : ''}`}
                                        onClick={() => this.changeLanguage(LANGUAGE.VI)}
                                    >
                                        <span className="flag">🇻🇳</span>
                                        <span>Tiếng Việt</span>
                                    </button>
                                    <button
                                        className={`language-option ${language === LANGUAGE.EN ? 'active' : ''}`}
                                        onClick={() => this.changeLanguage(LANGUAGE.EN)}
                                    >
                                        <span className="flag">🇬🇧</span>
                                        <span>English</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* User Menu */}
                        <div className="user-dropdown" ref={(ref) => (this.userMenuRef = ref)}>
                            <button className="user-toggle" onClick={this.toggleUserMenu}>
                                <div className="user-avatar">
                                    {avatarUrl ? (
                                        <img src={avatarUrl} alt={this.getUserFullName()} />
                                    ) : (
                                        <span className="avatar-initials">{this.getUserInitials()}</span>
                                    )}
                                </div>
                                <div className="user-info">
                                    <span className="user-name">{this.getUserFullName()}</span>
                                    <span className="user-role">{this.getRoleName()}</span>
                                </div>
                                <i className="fas fa-chevron-down dropdown-icon"></i>
                            </button>

                            {isUserMenuOpen && (
                                <div className="user-menu">
                                    <div className="user-menu-header">
                                        <div className="user-menu-name">{this.getUserFullName()}</div>
                                        <div className="user-menu-role">{this.getRoleName()}</div>
                                    </div>
                                    <div className="user-menu-divider"></div>
                                    <button className="user-menu-item" onClick={() => { this.handleNavigate(path.PROFILE); this.setState({ isUserMenuOpen: false }); }}>
                                        <i className="fas fa-user"></i>
                                        <span>{language === LANGUAGE.VI ? 'Hồ sơ' : 'Profile'}</span>
                                    </button>
                                    <div className="user-menu-divider"></div>
                                    <button className="user-menu-item logout" onClick={this.handleLogout}>
                                        <i className="fas fa-sign-out-alt"></i>
                                        <span>{language === LANGUAGE.VI ? 'Đăng xuất' : 'Log out'}</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button className="mobile-menu-toggle" onClick={this.toggleMobileMenu}>
                            <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMobileMenuOpen && (
                    <nav className="header-nav mobile-nav">
                        {flatMenus.map((menu, index) => (
                            <button
                                key={index}
                                className="nav-item"
                                onClick={() => { this.handleNavigate(menu.link); this.setState({ isMobileMenuOpen: false }); }}
                            >
                                {menu.icon && <i className={menu.icon}></i>}
                                <span><FormattedMessage id={menu.name} /></span>
                            </button>
                        ))}
                    </nav>
                )}
            </header>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
