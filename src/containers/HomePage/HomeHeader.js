import React, { Component } from 'react';
import { connect } from 'react-redux';

import './HomeHeader.scss';
import logo from '../../assets/logo_v3.png';
import { FormattedMessage } from 'react-intl';
import { LANGUAGE, path } from '../../utils/constant';
import { changeLanguageApp } from '../../store/actions/appActions';
import { withRouter } from 'react-router';



class HomeHeader extends Component {

    state = {
        isMenuOpen: false,
        searchTerm: '',
        searchResults: null
    }

    menuRef = React.createRef();

    changeLanguage = (language) => {
        // this.props.changeLanguageApp(language);
        this.props.changeLanguageAppRedux(language);
    }

    toggleMenu = (e) => {
        e.stopPropagation();
        this.setState(prev => ({ isMenuOpen: !prev.isMenuOpen }));
    }

    closeMenu = () => {
        this.setState({ isMenuOpen: false });
    }

    handleDocumentClick = (e) => {
        if (this.menuRef.current && !this.menuRef.current.contains(e.target)) {
            this.closeMenu();
        }
    }

    handleSearchChange = (e) => {
        const val = e.target.value;
        console.log('Search input changed:', val);
        if (val.trim() === '') {
            this.setState({ searchTerm: val, searchResults: null });
        } else {
            this.setState({ searchTerm: val });
        }
    }

    

    navigateToDoctor = (id) => {
        if (!id) return;
        const target = path.DETAIL_DOCTOR.replace(':id', id);
        this.props.history.push(target);
    }

    navigateToSpecialty = (id) => {
        if (!id) return;
        const target = path.DETAIL_SPECIALTY.replace(':id', id);
        this.props.history.push(target);
    }

    handleSearchKeyDown = async (e) => {
        if (e.key === 'Enter') {
            console.log('Search key pressed:', e.key);
            const q = this.state.searchTerm.trim();
            console.log('Search query:', q);
            if (!q) {
                console.log('Empty query, skipping search');
                return;
            }
            try {
                const searchService = require('../../services/searchService').default;
                console.log('Calling searchService.search with:', q, 'type=both');
                const resp = await searchService.search(q, 'both');
                console.log('Search response:', resp);
                if (resp && resp.data) {
                    // store payload to render on page
                    this.setState({ searchResults: resp.data });
                    if (Array.isArray(resp.data)) {
                        console.log('Search results array length:', resp.data.length);
                    } else if (resp.data.doctors || resp.data.specialties) {
                        const d = Array.isArray(resp.data.doctors) ? resp.data.doctors.length : 0;
                        const s = Array.isArray(resp.data.specialties) ? resp.data.specialties.length : 0;
                        console.log(`Found ${d} doctors and ${s} specialties`);
                    } else {
                        console.log('Unexpected search payload:', resp.data);
                    }
                }
            } catch (err) {
                console.error('Search error', err);
            }
        }
    }

    componentDidMount() {
        document.addEventListener('click', this.handleDocumentClick);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleDocumentClick);
    }

    render() {
        let language = this.props.language;
        return (
            <React.Fragment>
                <div className="home-header-container">
                    <div className="home-header-content">
                        <div className="left-content" ref={this.menuRef}>
                            <div className="menu-bars" onClick={this.toggleMenu}>
                                <i className="fas fa-bars"></i>
                            </div>
                            <div className="header-logo" onClick={() => this.props.history.push(path.HOME_PAGE)}>
                                <img src={logo} alt="Logo" />
                            </div>

                            {this.state.isMenuOpen && (
                                <div className="header-dropdown">
                                    <ul>
                                        <li onClick={() => { this.props.history.push(path.SPECIALTIES); this.closeMenu(); }}><FormattedMessage id="home_header.specialty" /></li>
                                        <li onClick={() => { this.props.history.push(path.CLINICS); this.closeMenu(); }}><FormattedMessage id="home_header.medical_examination" /></li>
                                        <li onClick={() => { this.props.history.push(path.DOCTORS); this.closeMenu(); }}><FormattedMessage id="home_header.doctor" /></li>
                                        <li onClick={() => { this.props.history.push(path.HANDBOOK); this.closeMenu(); }}><FormattedMessage id="section.handbook" /></li>
                                    </ul>
                                </div>
                            )}
                        </div>
                        <div className="center-content">
                            <div className="child-content" onClick={() => this.props.history.push(path.SPECIALTIES)}>
                                <div className="title"><b><FormattedMessage id="home_header.specialty" /></b></div>
                                <div className="sub-title"><FormattedMessage id="home_header.find_doctor_by_specialty" /></div>
                            </div>
                            <div className="child-content" onClick={() => this.props.history.push(path.CLINICS)}>
                                <div className="title"><b><FormattedMessage id="home_header.medical_examination" /></b></div>
                                <div className="sub-title"><FormattedMessage id="home_header.select_hospital_clinic" /></div>
                            </div>
                            <div className="child-content" onClick={() => this.props.history.push(path.DOCTORS)}>
                                <div className="title"><b><FormattedMessage id="home_header.doctor" /></b></div>
                                <div className="sub-title"><FormattedMessage id="home_header.find_good_doctor" /></div>
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
                            <div className="btn btn-login" onClick={() => this.props.history.push(path.LOGIN)}>
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
                                <FormattedMessage id="banner.search-placeholder">
                                    {(placeholder) => (
                                        <input
                                            type="text"
                                            value={this.state.searchTerm}
                                            onChange={this.handleSearchChange}
                                            onKeyDown={this.handleSearchKeyDown}
                                            placeholder={placeholder}
                                        />
                                    )}
                                </FormattedMessage>
                                {/* single combined search (both) - selector removed */}

                                {this.state.searchResults && (
                                    <div className="search-results">
                                        {/* doctor-only or array result */}
                                        {Array.isArray(this.state.searchResults) && (
                                            <ul>
                                                {this.state.searchResults.map((item) => (
                                                    <li key={item.id || item.nameEn} className="result-item" onClick={() => {
                                                        if (!item.id) return;
                                                        // detect item type by presence of name fields
                                                        if (item.firstName || item.lastName) {
                                                            this.navigateToDoctor(item.id);
                                                        } else {
                                                            this.navigateToSpecialty(item.id);
                                                        }
                                                    }}>
                                                        {item.firstName || item.lastName
                                                            ? `${item.firstName || ''} ${item.lastName || ''}`
                                                            : (language === LANGUAGE.VI ? item.nameVi || item.nameEn : item.nameEn || item.nameVi)}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}

                                        {/* both result */}
                                        {!Array.isArray(this.state.searchResults) && this.state.searchResults.doctors && (
                                            <div className="result-group">
                                                <h4><FormattedMessage id="home_header.doctor" /></h4>
                                                <ul>
                                                    {this.state.searchResults.doctors.map(d => (
                                                            <li key={d.id} className="result-item" onClick={() => this.navigateToDoctor(d.id)}>
                                                                {d.positionData ? (language === LANGUAGE.VI ? (d.positionData.valueVi || d.positionData.valueEn) : (d.positionData.valueEn || d.positionData.valueVi)) + ' ' : ''}
                                                                {d.lastName} {d.firstName}
                                                                {d.doctorInforData && d.doctorInforData.specialtyData ? ` - ${language === LANGUAGE.VI ? (d.doctorInforData.specialtyData.nameVi || d.doctorInforData.specialtyData.nameEn) : (d.doctorInforData.specialtyData.nameEn || d.doctorInforData.specialtyData.nameVi)}` : ''}
                                                            </li>
                                                        ))}
                                                </ul>
                                            </div>
                                        )}

                                        {!Array.isArray(this.state.searchResults) && this.state.searchResults.specialties && (
                                            <div className="result-group">
                                                <h4><FormattedMessage id="section.specialty" /></h4>
                                                <ul>
                                                    {this.state.searchResults.specialties.map(s => (
                                                            <li key={s.id} className="result-item specialty-item" onClick={() => this.navigateToSpecialty(s.id)}>{language === LANGUAGE.VI ? (s.nameVi || s.nameEn) : (s.nameEn || s.nameVi)}</li>
                                                        ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="content-down">
                            <div className="options">
                                <div className="option-child" onClick={() => this.props.history.push(path.SPECIALTIES)}>
                                    <div className="icon-child">
                                        <i className="fas fa-hand-holding-heart"></i>
                                    </div>
                                    <div className="text-child">
                                        <FormattedMessage id="section.specialty" />
                                    </div>
                                </div>
                                <div className="option-child" onClick={() => this.props.history.push(path.CLINICS)}>
                                    <div className="icon-child">
                                        <i className="far fa-hospital"></i>
                                    </div>
                                    <div className="text-child">
                                        <FormattedMessage id="section.medical-facility" />
                                    </div>
                                </div>
                                <div className="option-child" onClick={() => this.props.history.push(path.DOCTORS)}>
                                    <div className="icon-child">
                                        <i className="fas fa-user-md"></i>
                                    </div>
                                    <div className="text-child">
                                        <FormattedMessage id="section.outstanding-doctor" />
                                    </div>
                                </div>
                                <div className="option-child" onClick={() => this.props.history.push(path.HANDBOOK)}>
                                    <div className="icon-child">
                                        <i className="fas fa-book"></i>
                                    </div>
                                    <div className="text-child">
                                        <FormattedMessage id="section.handbook" />
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
