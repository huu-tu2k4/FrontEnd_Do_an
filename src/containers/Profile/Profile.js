import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { FormattedMessage, injectIntl } from 'react-intl';
import { USER_ROLE, LANGUAGE } from '../../utils/constant';
import './Profile.scss';
import Header from '../Header/Header';
import ValidatedInput from '../../components/Input/ValidatedInput';
import { editUserService } from '../../services/userService';
import { toast } from 'react-toastify';
import { userLoginSuccess } from '../../store/actions/userActions';
import _ from 'lodash';
import * as actions from '../../store/actions';
import Select from 'react-select';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
        id: '',
        email: '',
        firstName: '',
        lastName: '',
        address: '',
        phoneNumber: '',
        gender: '',
        position: ''
        };
    }

    componentDidMount() {
        this.loadFromProps();
        this.props.getGenderStart();
        this.props.getPositionStart();
    }

    componentDidUpdate(prevProps) {
        // Chỉ load lại khi userInfo thay đổi
        if (prevProps.userInfo !== this.props.userInfo) {
            this.loadFromProps();
        }

        // Xử lý gender khi data load xong
        if (prevProps.genderRedux !== this.props.genderRedux) {
            this.setState({
                genderArr: this.props.genderRedux || []
            });
        }

        // Xử lý position khi data load xong
        if (prevProps.positionRedux !== this.props.positionRedux) {
            this.setState({
                positionArr: this.props.positionRedux || []
            });
        }
    }

    loadFromProps = () => {
        const { userInfo } = this.props;
        if (userInfo && !_.isEmpty(userInfo)) {
            this.setState({
                id: userInfo.id || '',
                email: userInfo.email || '',
                firstName: userInfo.firstName || '',
                lastName: userInfo.lastName || '',
                address: userInfo.address || '',
                phoneNumber: userInfo.phoneNumber || '',
                gender: userInfo.genderData.keyMap || '',
                position: userInfo.positionData.keyMap || ''
            });
        }
    };

    onChangeInput = (event, field) => {
        let value = event.target.value;

        // For password field: strip non-ASCII characters (prevents Vietnamese diacritics / Unikey input)
        if (field === 'password') {
            // remove all non-ASCII characters
            value = value.replace(/[^\x00-\x7F]/g, '');
        }
        this.setState(prev => ({
            ...prev,
            [field]: value,
            errors: {
                ...prev.errors,
                [field === 'phoneNumber' ? 'phoneNumber' : field]: ''
            }
        }));
    }

    getRoleLabel = () => {
        const { userInfo, language } = this.props;
        if (!userInfo) return '';
        const role = userInfo.roleId;
        if (role === USER_ROLE.ADMIN) return language === LANGUAGE.VI ? 'Quản trị' : 'Admin';
        if (role === USER_ROLE.DOCTOR) return language === LANGUAGE.VI ? 'Bác sĩ' : 'Doctor';
        return '';
    }

    handleChange = (e, field) => {
        const copy = { ...this.state };
        copy[field] = e.target.value;
        this.setState(copy);
    }

    validate = () => {
        const { firstName, lastName } = this.state;
        const { intl } = this.props;
        if (!firstName || !lastName) {
        toast.warn(intl.formatMessage({ id: 'profile.validation_name_required', defaultMessage: 'First name and last name are required' }));
        return false;
        }
        return true;
    }

    handleSave = async () => {
        if (!this.validate()) return;
        const payload = {
            id: this.state.id,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            address: this.state.address,
            phoneNumber: this.state.phoneNumber,
            gender: this.state.gender,
            positionId: this.state.position,
            roleId: this.props.userInfo.roleId
        };
        try {
            const res = await editUserService(payload);
            if (res && res.errCode === 0) {
                toast.success(this.props.intl.formatMessage({ id: 'profile.update_success', defaultMessage: 'Profile updated' }));
                // update redux user info locally
                const updated = { ...(this.props.userInfo || {}), ...payload };
                this.props.userLoginSuccess(updated);
            } else {
                toast.error(res.errMessage || this.props.intl.formatMessage({ id: 'profile.update_failed', defaultMessage: 'Failed to update profile' }));
            }
            } catch (e) {
            console.error(e);
            toast.error('Failed to update profile');
        }
    }
    buildName = (firstName, lastName) => {
        const { language } = this.props;
        if (language === LANGUAGE.VI) {
            return `${lastName} ${firstName}`;
        }
        return `${firstName} ${lastName}`;
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
                        if (text && text.trim().startsWith('data:')) {
                            return text.trim();
                        }
                    }
                } catch (e) {}

                let binary = '';
                for (let i = 0; i < uint8.length; i++) {
                    binary += String.fromCharCode(uint8[i]);
                }
                const b64 = typeof btoa === 'function' ? btoa(binary) : '';
                return b64 ? `data:image/jpeg;base64,${b64}` : '';
            } catch (e) {
                return '';
            }
        }
        return '';
    }

    render() {
        let positions = this.props.positionRedux;
        let genders = this.props.genderRedux;
        let { position, gender } = this.state;
        const avatarUrl = this.buildImageUrl(this.props.userInfo && this.props.userInfo.image);
        return (
        <div className="profile-page">
            <Header />
            <div className="profile-inner">
                <div className="profile-card">
                    <div className="profile-side">
                        <div className="avatar-wrap">
                            {avatarUrl ? (
                                <img className="avatar-img" src={avatarUrl} alt={this.state.firstName} />
                            ) : (
                                <div className="avatar-initials">{(this.state.firstName || this.state.lastName) ? (`${(this.state.firstName||'')[0]}${(this.state.lastName||'')[0]}`).toUpperCase() : 'U'}</div>
                            )}
                        </div>
                        <div className="side-name">{this.buildName(this.state.firstName, this.state.lastName)}</div>
                        <div className="side-role">{this.getRoleLabel()}</div>
                    </div>
                    <div className="profile-form">
                        <h2><FormattedMessage id="profile.title" defaultMessage="My Profile" /></h2>
                        <div className="form-row">
                            <label><FormattedMessage id="user.email" defaultMessage="Email" /></label>
                            <ValidatedInput
                                type="email"
                                value={this.state.email}
                                disabled = {true}
                            />
                        </div>
                        <div className="form-row two-col">
                            <div>
                            <label><FormattedMessage id="user.firstName" defaultMessage="First name" /></label>
                            <input value={this.state.firstName} onChange={(e) => this.handleChange(e, 'firstName')} />
                            </div>
                            <div>
                            <label><FormattedMessage id="user.lastName" defaultMessage="Last name" /></label>
                            <input value={this.state.lastName} onChange={(e) => this.handleChange(e, 'lastName')} />
                            </div>
                        </div>
                        <div className="form-row">
                            <label><FormattedMessage id="user.phoneNumber" defaultMessage="Phone" /></label>
                            <ValidatedInput type="phone" value={this.state.phoneNumber} onChange={(e) => this.handleChange(e, 'phoneNumber')} />
                        </div>
                        <div className="form-row">
                            <label><FormattedMessage id="user.address" defaultMessage="Address" /></label>
                            <input value={this.state.address} onChange={(e) => this.handleChange(e, 'address')} />
                        </div>
                        <div className="form-row">
                            <label><FormattedMessage id="user.position" />(*)</label>
                            <select key={`position-${positions?.length}`} value={position} name="positionId" className="form-control" onChange={(event) => this.onChangeInput(event, 'position')}>
                                {
                                    positions && positions.length > 0 && positions.map((position, index) => {
                                        return (
                                            <option key={position.keyMap || index} value={position.keyMap}>
                                                {this.props.language === 'vi' ? position.valueVi : position.valueEn}
                                            </option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                        <div className="form-row">
                            <label><FormattedMessage id="profile.gender" defaultMessage="Gender" /></label>
                            <select key={`gender-${genders?.length}`} value={this.state.gender} name="genderId" className="form-control" onChange={(event) => this.onChangeInput(event, 'gender')}>
                                {
                                    genders && genders.length > 0 && genders.map((gender, index) => {
                                        console.log('check gender: ', gender);
                                        return (
                                            <option key={gender.keyMap || index} value={gender.keyMap}>
                                                {this.props.language === 'vi' ? gender.valueVi : gender.valueEn}
                                            </option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                        
                    <div className="form-actions">
                        <button className="btn-save" onClick={this.handleSave}><FormattedMessage id="profile.save" defaultMessage="Save" /></button>
                    </div>
                    </div>
                </div>
            </div>
        </div>
        );
    }
}

const mapStateToProps = state => ({
    userInfo: state.user.userInfo,
    language: state.app.language,
    positionRedux: state.admin.positions,
    genderRedux: state.admin.genders
});

const mapDispatchToProps = dispatch => ({
    userLoginSuccess: (user) => dispatch(userLoginSuccess(user)),
    getGenderStart: () => dispatch(actions.fetchGenderStart()),
    getPositionStart: () => dispatch(actions.fetchPositionStart()),
});

const Connected = connect(mapStateToProps, mapDispatchToProps)(Profile);
export default withRouter(injectIntl(Connected));
