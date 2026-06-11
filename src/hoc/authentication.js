import React from 'react';
import { connect } from 'react-redux';
import locationHelperBuilder from "redux-auth-wrapper/history4/locationHelper";
import { connectedRouterRedirect } from "redux-auth-wrapper/history4/redirect";
import { Redirect } from 'react-router-dom';

const locationHelper = locationHelperBuilder({});

export const userIsAuthenticated = connectedRouterRedirect({
    authenticatedSelector: state => state.user.isLoggedIn,
    wrapperDisplayName: 'UserIsAuthenticated',
    redirectPath: '/login'
});

export const userIsNotAuthenticated = connectedRouterRedirect({
    authenticatedSelector: state => !state.user.isLoggedIn,
    wrapperDisplayName: 'UserIsNotAuthenticated',
    redirectPath: (state, ownProps) => locationHelper.getRedirectQueryParam(ownProps) || '/',
    allowRedirectBack: false
});

export const userHasRole = (allowedRoles = []) => (WrappedComponent) => {
    const RoleWrapper = (props) => {
        const { isLoggedIn, userInfo } = props;
        if (!isLoggedIn) return <Redirect to="/login" />;
        const roleId = (userInfo && userInfo.roleId) || null;
        if (!allowedRoles.includes(roleId)) {
            return (
                <div style={{ padding: 24 }}>
                    <h2>Access Denied</h2>
                    <p>You do not have permission to view this page.</p>
                </div>
            );
        }
        return <WrappedComponent {...props} />;
    };

    const mapStateToProps = (state) => ({
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo
    });

    return connect(mapStateToProps)(RoleWrapper);
};