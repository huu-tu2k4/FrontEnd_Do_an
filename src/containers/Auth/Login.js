import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";

import * as actions from "../../store/actions";

import './Login.scss';
import { FormattedMessage } from 'react-intl';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            showPassword: false
        }
    }

    handleLogin() {
        console.log('username: ', this.state.username, 'password: ', this.state.password);
    }

    showHidePassword() {
        this.setState({
            showPassword: !this.state.showPassword
        });
    }

    render() {
        return (
            <div className="login-background">
                <div className="login-container">
                    <div className="login-content">
                        <div className="col-12 text-login">Login</div>
                        <div className="col-12 form-group login-input">
                            <label>UserName</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder="Enter your Username"
                                value={this.state.username}
                                onChange={(e) => this.setState({ username: e.target.value })}
                            />
                        </div>
                        <div className="col-12 form-group login-input">
                            <label>Password</label>
                            <div className="custom-input-password">
                                <input 
                                    type={this.state.showPassword ? 'text' : 'password'} 
                                    className="form-control" 
                                    placeholder="Enter your Password"
                                    value={this.state.password}
                                    onChange={(e) => this.setState({ password: e.target.value })}
                                />
                                <span
                                    onClick={() => this.showHidePassword()}
                                    
                                ><i className={this.state.showPassword ? "far fa-eye" : "far fa-eye-slash"}></i></span>
                            </div>
                        </div>
                        <div className="col-12">
                            <button className="btn btn-login" onClick={() => this.handleLogin()}>Login</button>
                        </div>
                        <div className="col-12">
                            <span className="forgot-text">Forgot Password?</span>
                        </div>
                        <div className="col-12 text-center mt-3 mb-3">
                            <span className="login-with-text">Or login with</span>
                        </div>
                        <div className="col-12 social-login">
                            <i className="col-4 fab fa-google-plus-g google"></i>
                            <i className="col-4 fab fa-facebook-f facebook"></i>
                            <i className="col-4 fab fa-twitter twitter"></i>
                        </div>
                    </div>
                    
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        navigate: (path) => dispatch(push(path)),
        adminLoginSuccess: (adminInfo) => dispatch(actions.adminLoginSuccess(adminInfo)),
        adminLoginFail: () => dispatch(actions.adminLoginFail()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
