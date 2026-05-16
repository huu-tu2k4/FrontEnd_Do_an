import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { USER_ROLE } from '../utils/constant';

class Home extends Component {

    render() {
        console.log('check props: ', this.props);
        const { isLoggedIn, userInfo } = this.props;
        let linkToRedirect = '/home';
        if (isLoggedIn) {
            if (userInfo && userInfo.roleId === USER_ROLE.DOCTOR) {
                linkToRedirect = '/doctor/manage-patient';
            } else {
                linkToRedirect = '/system/user-redux';
            }
        }

        return <Redirect to={linkToRedirect} />;
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
