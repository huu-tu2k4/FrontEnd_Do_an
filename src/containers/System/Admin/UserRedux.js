import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { getAllCodeService } from '../../../services/userService';
import* as actions from '../../../store/actions/index';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import ValidatedInput from '../../../components/Input/ValidatedInput';
import ToastUtil from '../../../utils/ToastUtil';
import { toast } from 'react-toastify';
import LanguageUtils from '../../../utils/LanguageUtils';
import {CRUD_ACTIONS, CommonUtils} from '../../../utils';
import TableManageUser from "./TableManageUser";
import GlobalLoadingOverlay from '../../../components/GlobalLoadingOverlay/GlobalLoadingOverlay';

import './UserRedux.scss';
class UserRedux extends Component {

    constructor(props) {
        super(props);
        this.state = {
            genderArr: [],
            roleArr: [],
            positionArr: [],
            previewImgURL: '',
            previewWidth: null,
            previewHeight: null,
            isOpen: false,

            // form fields
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            address: '',
            gender: '',
            position: '',
            role: '',
            avatar: ''
            ,
            errors: {
                email: '',
                password: '',
                phoneNumber: ''
            },
            action: CRUD_ACTIONS.CREATE
        };
    }

    componentDidMount = async () => {
        this.props.getGenderStart();
        this.props.getRoleStart();
        this.props.getPositionStart();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.genderRedux !== this.props.genderRedux) {
            this.setState({
                genderArr: this.props.genderRedux
            })
        }
        if (prevProps.roleRedux !== this.props.roleRedux) {
            let arr = this.props.roleRedux;
            this.setState({
                roleArr: arr,
                role: arr && arr.length > 0 ? arr[0].keyMap : ''
            })
        }
        if (prevProps.positionRedux !== this.props.positionRedux) {
            let arr = this.props.positionRedux;
            this.setState({
                positionArr: arr,
                position: arr && arr.length > 0 ? arr[0].keyMap : ''
            })
        }
        if (prevProps.listUsers !== this.props.listUsers) {
            let arrPosition = this.props.positionRedux;
            let arrRole = this.props.roleRedux;
            this.setState({
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                address: '',
                phoneNumber: '',
                gender: '',
                position: arrPosition && arrPosition.length > 0 ? arrPosition[0].keyMap : '',
                role: arrRole && arrRole.length > 0 ? arrRole[0].keyMap : '',
                avatar: '',
                userEditId: '',
                action: CRUD_ACTIONS.CREATE,
                avatar: '',
                previewImgURL: ''
            })
        }
    }

    handleOnChangeImg = async (event) => {
        let file = event.target.files[0];
        if (file) {
            let objectUrl = URL.createObjectURL(file);
            let base64 = await CommonUtils.getBase64(file);
            this.setState({
                previewImgURL: objectUrl,
                previewWidth: null,
                previewHeight: null,
                avatar: base64
            })
        }
        else {
            this.setState({
                previewImgURL: ''
            })
        }
    }

    handleImgLoad = (event) => {
        const img = event.target;
        this.setState({
            previewWidth: img.naturalWidth,
            previewHeight: img.naturalHeight
        })
    }

    openPreviewImg = () => {
        if (!this.state.previewImgURL) return;
        this.setState({
            isOpen: true
        })
    }

    handleSaveUser = async () => {
        const { email, password, phoneNumber } = this.state;
        // if (!this.validatePhoneNumber(phoneNumber)) {
        //     ToastUtil.warn('common.warning', 'validation.invalid_phone');
        //     return;
        // }

        // reset errors
        this.setState({ errors: { email: '', password: '', phoneNumber: '' } });
        if (!this.checkValidateInput()) {
            this.setState({ errors: { ...this.state.errors, general: 'validation.missing_fields' } });
            return;
        }

        if (!this.validateEmail(email)) {
            this.setState({ errors: { ...this.state.errors, email: 'validation.invalid_email' } });
            return;
        }

        if (!this.validatePassword(password)) {
            this.setState({ errors: { ...this.state.errors, password: 'validation.invalid_password' } });
            return;
        }

        if (!this.validatePhoneNumber(phoneNumber)) {
            this.setState({ errors: { ...this.state.errors, phoneNumber: 'validation.invalid_phone' } });
            return;
        }
        if(this.state.action === CRUD_ACTIONS.CREATE) {
            // handle create user
            const res = await this.props.createNewUser({
                email: this.state.email,
                password: this.state.password,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                address: this.state.address,
                phoneNumber: this.state.phoneNumber,
                gender: this.state.gender,
                roleId: this.state.role,
                positionId: this.state.position,
                avatar: this.state.avatar
            });

            if (res && res.errCode && res.errCode !== 0) {
                // Map common server messages / errCode to translation keys when possible
                let emailError = null;
                if (res.errCode === 1) {
                    // common case: email already used
                    const msg = (res.errMessage || '').toLowerCase();
                    if (msg.includes('email') && (msg.includes('already') || msg.includes('in used') || msg.includes('exist'))) {
                        emailError = 'validation.email_in_use';
                    }
                }

                this.setState(prev => ({
                    errors: {
                        ...prev.errors,
                        email: emailError || res.errMessage || 'validation.create_failed'
                    }
                }));
            }
        } else if(this.state.action === CRUD_ACTIONS.EDIT) {
            this.props.updateUser({
                id: this.state.userEditId,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                address: this.state.address,
                roleId: this.state.role,
                positionId: this.state.position,
                gender: this.state.gender,
                phoneNumber: this.state.phoneNumber,
                avatar: this.state.avatar
            });
            
        }
    }

    checkValidateInput = () => {
        let isValid = true;
        let arrInput = ['email', 'password', 'phoneNumber', 'firstName', 'address', 'gender',];
        for (let i = 0; i < arrInput.length; i++) {
            if (!this.state[arrInput[i]]) {
                isValid = false;
                // set inline error for the missing field and show a localized toast
                this.setState(prev => ({
                    errors: {
                        ...prev.errors,
                        [arrInput[i]]: 'validation.required'
                    }
                }));
                const title = LanguageUtils.getMessageByKey('common.warning', this.props.language) || 'Warning';
                const msg = LanguageUtils.getMessageByKey('validation.missing_fields', this.props.language) || 'Please fill in required fields';
                toast.warn(
                    <div>
                        <strong>{title}</strong>
                        <div>{msg}</div>
                    </div>
                );
                break;
            }
        }
        // setTimeout(() => {
        //     this.props.fetchAllUsers();
        // }, 1000);
        return isValid;
    }

    validateEmail = (email) => {
        if (!email) return false;
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    validatePassword = (pw) => {
        if (!pw) return false;
        if (pw.length < 6) return false;
        // const hasNumber = /\d/.test(pw);
        // return hasNumber;
        return true;
    }

    validatePhoneNumber = (phone) => {
        if (!phone) return false;
        const cleaned = String(phone).replace(/[\s\-()]+/g, '');
        const re = /^[0-9]{9,12}$/;
        return re.test(cleaned);
    }   
    
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

    handleEditUserFromParent = (user) => {
        let imageBase64 = '';
        if (user.image) {
            if (typeof user.image === 'string' && user.image.startsWith('data:')) {
                imageBase64 = user.image;
            } else {
                imageBase64 = `data:image/jpeg;base64,${user.image}`;
            }
        }
        this.setState({
            email: user.email,
            password: 'hardcode',
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            address: user.address,
            gender: user.gender,
            position: user.positionId,
            role: user.roleId,
            previewImgURL: imageBase64,
            action: CRUD_ACTIONS.EDIT,
            userEditId: user.id
        });
    }

    render() {
        
        let genders = this.props.genderRedux;
        let roles = this.props.roleRedux;
        let positions = this.props.positionRedux;
        let isLoadingGender = this.props.isLoadingGender;
        let isLoadingUsers = this.props.isLoadingUsers;
        let isSavingUser = this.props.isSavingUser;

        let {email, password, firstName, 
            lastName, phoneNumber, address, 
            gender, position, role, avatar} = this.state;
        const loadingActive = isLoadingGender || isLoadingUsers || isSavingUser;
        const loadingText = isSavingUser ? (LanguageUtils.getMessageByKey('common.saving', this.props.language) || 'Saving...') : (LanguageUtils.getMessageByKey('common.loading', this.props.language) || 'Loading...');

        return (
            <React.Fragment>
                <GlobalLoadingOverlay active={loadingActive} text={loadingText} />
                <div className="user-redux-container">
                    <div className="m-u-title">
                        <FormattedMessage id="menu.admin.user-redux" />
                    </div>
                    <div className="user-redux-body">
                        <div className="container">
                            <h4><FormattedMessage id="user.create_title" /></h4>
                            <form>
                                {/* Row 1: email (left) | firstName (right) */}
                                <div className="row mb-1">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label><FormattedMessage id="user.firstName" />(*)</label>
                                            <input 
                                                name="firstName" 
                                                type="text" 
                                                className="form-control" 
                                                
                                                value={firstName}
                                                onChange={(event) => this.onChangeInput(event, 'firstName')}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label><FormattedMessage id="user.email" />(*)</label>
                                            <ValidatedInput
                                                name="email"
                                                type="email"
                                                disabled={this.state.action === CRUD_ACTIONS.EDIT}
                                                value={email}
                                                onChange={(event) => this.onChangeInput(event, 'email')}
                                                error={this.state.errors.email}
                                            />
                                        </div>                                        
                                    </div>
                                </div>

                                {/* Row 2: lastName (left) | password (right) */}
                                <div className="row mb-1">
                                    <div className="form-group col-md-6">
                                        <label><FormattedMessage id="user.lastName" /></label>
                                        <input 
                                            name="lastName" 
                                            type="text" 
                                            className="form-control" 
                                            value={lastName}
                                            onChange={(event) => this.onChangeInput(event, 'lastName')}
                                        />
                                    </div>
                                    <div className="form-group col-md-6">
                                        <label><FormattedMessage id="user.password" />(*)</label>
                                        <input 
                                            name="password" 
                                            type="password" 
                                            className="form-control" 
                                            disabled={this.state.action === CRUD_ACTIONS.EDIT}
                                            value={password}
                                            onChange={(event) => this.onChangeInput(event, 'password')}
                                        />
                                        {this.state.errors.password && (
                                            <div className="invalid-feedback d-block">
                                                {typeof this.state.errors.password === 'string' && this.state.errors.password.startsWith && this.state.errors.password.startsWith('validation.') ? (
                                                    <FormattedMessage id={this.state.errors.password} />
                                                ) : (
                                                    this.state.errors.password
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Row 3: address | phoneNumber */}
                                <div className="row mb-1">
                                    <div className="form-group col-md-4">
                                        <label><FormattedMessage id="user.phoneNumber" />(*)</label>
                                        <ValidatedInput
                                            name="phoneNumber"
                                            type="phone"
                                            value={phoneNumber}
                                            onChange={(event) => this.onChangeInput(event, 'phoneNumber')}
                                            error={this.state.errors.phoneNumber}
                                        />
                                    </div>
                                    <div className="form-group col-md-8">
                                        <label><FormattedMessage id="user.address" /></label>
                                        <input 
                                            name="address" 
                                            type="text" 
                                            className="form-control" 
                                            value={address}
                                            onChange={(event) => this.onChangeInput(event, 'address')}
                                        />
                                    </div>
                                </div>

                                {/* Row 4:  role | position */}
                                <div className="row mb-1">

                                    <div className="form-group col-md-6">
                                        <label><FormattedMessage id="user.role" />(*)</label>
                                        <select value={role} name="roleId" className="form-control" onChange={(event) => this.onChangeInput(event, 'role')}>
                                            {
                                                roles && roles.length > 0 && roles.map((role, index) => {
                                                    return (
                                                        <option key={role.keyMap || index} value={role.keyMap}>
                                                            {this.props.language === 'vi' ? role.valueVi : role.valueEn}
                                                        </option>
                                                    )
                                                })
                                            }
                                        </select>
                                    </div>

                                    <div className="form-group col-md-6">
                                        <label><FormattedMessage id="user.position" />(*)</label>
                                        <select value={position} name="positionId" className="form-control" onChange={(event) => this.onChangeInput(event, 'position')}>
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
                                </div>

                                {/* Row 5: image upload */}
                                <div className="row mb-1">
                                    <div className="form-group col-md-6">
                                        <label><FormattedMessage id="user.gender" />(*)</label>
                                        <div>
                                            {genders && genders.length > 0 && genders.map((g, idx) => {
                                                const label = this.props.language === 'vi' ? g.valueVi : g.valueEn;
                                                const val = g.keyMap || idx;
                                                return (
                                                    <div className="form-check form-check-inline" key={val}>
                                                        <input
                                                            className="form-check-input"
                                                            type="radio"
                                                            name="gender"
                                                            id={`gender-${val}`}
                                                            value={val}
                                                            checked={String(gender) === String(val)}
                                                            onChange={(event) => this.onChangeInput(event, 'gender')}
                                                        />
                                                        <label className="form-check-label" htmlFor={`gender-${val}`}>{label}</label>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                    <div className="form-group col-md-6">
                                        <label><FormattedMessage id="user.image" /></label>
                                        <div className="preview-img-container">
                                            <input id="prevImg" type="file" hidden
                                                onChange={(event) => this.handleOnChangeImg(event)}
                                            ></input>
                                            <label htmlFor="prevImg" className="btn btn-primary">
                                                <FormattedMessage id="user.choose-image" />
                                                <i className="fas fa-upload"></i>
                                            </label>
                                            <div 
                                                className="priview-image"
                                                onClick={() => this.openPreviewImg()}
                                            >
                                                {this.state.previewImgURL && (
                                                    <img
                                                        src={this.state.previewImgURL}
                                                        alt="preview"
                                                        onLoad={this.handleImgLoad}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Row 6: submit */}
                                <div className="form-group d-flex justify-content-end">
                                    <button
                                    onClick={() => this.handleSaveUser()}
                                    type="button" className={this.state.action === CRUD_ACTIONS.CREATE ? "btn btn-primary" : "btn btn-warning"}>{
                                        this.state.action === CRUD_ACTIONS.CREATE ? 
                                        (<FormattedMessage id="user.create" />) 
                                        : 
                                        (<FormattedMessage id="user.edit" />)
                                    }</button>
                                </div>
                                <div className="col-md-12 mb-5">
                                    <TableManageUser 
                                        action={this.state.action}
                                        handleEditUserFromParent={this.handleEditUserFromParent}
                                    />
                                </div>
                            </form>
                        </div>
                    </div>
                    {this.state.isOpen && (
                        <Lightbox
                            mainSrc={this.state.previewImgURL}
                            onCloseRequest={() => this.setState({ isOpen: false })}
                        />
                    )}
                </div>
                
            </React.Fragment>
        )
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genderRedux: state.admin.genders,
        positionRedux: state.admin.positions,
        roleRedux: state.admin.roles,
        isLoadingGender: state.admin.isLoadingGender,
        isLoadingUsers: state.admin.isLoadingUsers,
        isSavingUser: state.admin.isSavingUser,
        listUsers: state.admin.users
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGenderStart: () => dispatch(actions.fetchGenderStart()),
        getPositionStart: () => dispatch(actions.fetchPositionStart()),
        getRoleStart: () => dispatch(actions.fetchRoleStart()),
        createNewUser: (data) => dispatch(actions.createNewUser(data)),
        fetchAllUsers: () => dispatch(actions.fetchAllUsers()),
        updateUser: (data) => dispatch(actions.editUser(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);
