import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { getAllCodeService } from '../../../services/userService';
import* as actions from '../../../store/actions/index';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

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
            isOpen: false
        };
    }

    componentDidMount = async () => {
        this.props.getGenderStart();
        this.props.getRoleStart();
        this.props.getPositionStart();

        // try {
        //     await this.getListGender();
        //     await this.getListRoles();
        //     await this.getListPositions();
        // }
        // catch (e) {
        //     console.log(e);
        // }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.genderRedux !== this.props.genderRedux) {
            this.setState({
                genderArr: this.props.genderRedux
            })
        }
        if (prevProps.roleRedux !== this.props.roleRedux) {
            this.setState({
                roleArr: this.props.roleRedux
            })
        }
        if (prevProps.positionRedux !== this.props.positionRedux) {
            this.setState({
                positionArr: this.props.positionRedux
            })
        }
    }

    handleOnChangeImg = (event) => {
        let file = event.target.files[0];
        if (file) {
            let objectUrl = URL.createObjectURL(file);
            this.setState({
                previewImgURL: objectUrl,
                previewWidth: null,
                previewHeight: null
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

    render() {
        console.log('check state: ', this.state);
        let genders = this.props.genderRedux;
        let roles = this.props.roleRedux;
        let positions = this.props.positionRedux;
        let isLoadingGender = this.props.isLoadingGender;

        return (
            <React.Fragment>
                <div className="user-redux-container">
                    <div className="title">
                        <FormattedMessage id="menu.admin.user-redux" />
                    </div>
                    <div className="user-redux-body">
                        <div className="container">
                            <h4><FormattedMessage id="user.create_title" /></h4>
                            <form>
                                {/* Row 1: email (left) | firstName (right) */}
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label><FormattedMessage id="user.email" /></label>
                                            <input name="email" type="email" className="form-control" required />
                                        </div>                                        
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label><FormattedMessage id="user.firstName" /></label>
                                            <input name="firstName" type="text" className="form-control" />
                                        </div>
                                    </div>
                                </div>

                                {/* Row 2: lastName (left) | password (right) */}
                                <div className="row mb-3">
                                    <div className="form-group col-md-6">
                                        <label><FormattedMessage id="user.lastName" /></label>
                                        <input name="lastName" type="text" className="form-control" />
                                    </div>
                                    <div className="form-group col-md-6">
                                        <label><FormattedMessage id="user.password" /></label>
                                        <input name="password" type="password" className="form-control" required />
                                    </div>
                                </div>

                                {/* Row 3: address | phoneNumber */}
                                <div className="row mb-3">
                                    <div className="form-group col-md-4">
                                        <label><FormattedMessage id="user.phoneNumber" /></label>
                                        <input name="phoneNumber" type="text" className="form-control" />
                                    </div>
                                    <div className="form-group col-md-8">
                                        <label><FormattedMessage id="user.address" /></label>
                                        <input name="address" type="text" className="form-control" />
                                    </div>
                                </div>

                                {/* Row 4:  role | position */}
                                <div className="row mb-3">

                                    <div className="form-group col-md-6">
                                        <label><FormattedMessage id="user.role" /></label>
                                        <select name="roleId" className="form-control" defaultValue="R1">
                                            {
                                                roles && roles.length > 0 && roles.map((role, index) => {
                                                    return (
                                                        <option key={role.keyMap || index} value={role.keyMap} defaultValue={index === 0}>
                                                            {this.props.language === 'vi' ? role.valueVi : role.valueEn}
                                                        </option>
                                                    )
                                                })
                                            }
                                        </select>
                                    </div>

                                    <div className="form-group col-md-6">
                                        <label><FormattedMessage id="user.position" /></label>
                                        <select name="positionId" className="form-control" defaultValue="P1">
                                            {
                                                positions && positions.length > 0 && positions.map((position, index) => {
                                                    return (
                                                        <option key={position.keyMap || index} value={position.keyMap} defaultValue={index === 0}>
                                                            {this.props.language === 'vi' ? position.valueVi : position.valueEn}
                                                        </option>
                                                    )
                                                })
                                            }
                                        </select>
                                    </div>
                                </div>

                                {/* Row 5: image upload */}
                                <div className="row mb-3">
                                    <div className="form-group col-md-6">
                                            <label><FormattedMessage id="user.gender" /></label>
                                            <div>
                                                {genders && genders.length > 0 && genders.map((g, idx) => {
                                                    const label = this.props.language === 'vi' ? g.valueVi : g.valueEn;
                                                    return (
                                                        <div className="form-check form-check-inline" key={g.keyMap || idx}>
                                                            <input className="form-check-input" type="radio" name="gender" id={`gender-${g.keyMap || idx}`} value={g.keyMap} defaultChecked={idx === 0} />
                                                            <label className="form-check-label" htmlFor={`gender-${g.keyMap || idx}`}>{label}</label>
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
                                    <button type="submit" className="btn btn-primary"><FormattedMessage id="user.submit" /></button>
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
        isLoadingGender: state.admin.isLoadingGender
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGenderStart: () => dispatch(actions.fetchGenderStart()),
        getPositionStart: () => dispatch(actions.fetchPositionStart()),
        getRoleStart: () => dispatch(actions.fetchRoleStart())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);
