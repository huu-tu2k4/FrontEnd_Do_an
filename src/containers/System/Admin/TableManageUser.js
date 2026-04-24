import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';

import './TableManageUser.scss';

class TableManageUser extends Component {

    constructor(props){
        super(props);
        this.state = {
            
        }
    }

    componentDidMount() {
        this.props.fetchAllUsers();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.listUsers !== this.props.listUsers) {
            this.setState({
                listUsers: this.props.listUsers
            })
        }
    }

    handleUpdateUser = (user) => {
        this.props.handleEditUserFromParent(user);
    }

    handleDeleteUser = (userId) => {
        this.props.deleteUser(userId);
    }
    
    render() {
        return (
                <table id="customers">
                    <tbody>
                        <tr>
                            <th>Email</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Address</th>
                            <th>Action</th>
                        </tr>
                        {this.props.listUsers.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <td>{item.email}</td>
                                    <td>{item.firstName}</td>
                                    <td>{item.lastName}</td>
                                    <td>{item.address}</td>
                                    <td>
                                        <button type="button" className="btn-edit" onClick={() => this.handleUpdateUser(item)}>
                                            <i className="fas fa-pencil-alt"></i>
                                        </button>
                                        <button type="button" className="btn-delete" onClick={() => this.handleDeleteUser(item.id)}>
                                            <i className="fas fa-trash-alt"></i>
                                        </button>
                                    </td>
                                </tr>
                            )
                        })} 
                    </tbody>
                </table>
        );
    }

}

const mapStateToProps = state => {
    return {
        listUsers: state.admin.users
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllUsers: () => dispatch(actions.fetchAllUsers()),
        deleteUser: (userId) => dispatch(actions.deleteUser(userId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableManageUser);
