import React, { Component } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';
import UserRedux from '../containers/System/Admin/UserRedux';
import Header from '../containers/Header/Header';
import ManageDoctor from '../containers/System/Admin/ManageDoctor';
import ManageSpecialty from '../containers/System/Specialty/ManageSpecialty';
import ManageClinic from '../containers/System/Clinic/ManageClinic';
import ManageHandbook from '../containers/System/Handbook/ManageHandbook';
import { userHasRole } from '../hoc/authentication';
import { USER_ROLE } from '../utils/constant';

class System extends Component {
    render() {
        const { systemMenuPath, isLoggedIn } = this.props;
        return (
            <React.Fragment>
                {isLoggedIn && <Header />}
                <div className="system-container">
                    <div className="system-list">
                        <Switch>
                            <Route path="/system/user-redux" component={userHasRole([USER_ROLE.ADMIN])(UserRedux)} />
                            <Route path="/system/manage-doctor" component={userHasRole([USER_ROLE.ADMIN])(ManageDoctor)} />
                            <Route path="/system/manage-specialty" component={userHasRole([USER_ROLE.ADMIN])(ManageSpecialty)} />
                            <Route path="/system/manage-clinic" component={userHasRole([USER_ROLE.ADMIN])(ManageClinic)} />
                            <Route path="/system/manage-handbook" component={userHasRole([USER_ROLE.ADMIN])(ManageHandbook)} />
                            <Route component={() => { return (<Redirect to={systemMenuPath} />) }} />
                        </Switch>
                    </div>
                </div>
            </React.Fragment>
            
        );
    }
}

const mapStateToProps = state => {
    return {
        systemMenuPath: state.app.systemMenuPath,
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(System);
