import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { getAllUsers, createNewUserService, editUserService, deleteUserService } from '../../services/userService';
import ModalUser from './ModalUser';
import ModalEditUser from './ModalEditUser';
import { emitter } from '../../utils/emitter';

import './UserManage.scss';

class UserManage extends Component {

    constructor(props){
        super(props);
        this.state = {
            arrUsers: [],
            isOpenModalUser: false,
            isOpenModalEditUser: false,
            userEdit: {}
        }
    }

    async componentDidMount() {
        let response = await getAllUsers('ALL');
        if(response && response.errCode === 0){
            this.setState({
                arrUsers: response.users
            })
        }
    }

    handleAddNewUser = () => {
        this.setState({
            isOpenModalUser: true
        })
    }

    getAllUsers = async () => {
        let response = await getAllUsers('ALL');
        if(response && response.errCode === 0){
            this.setState({
                arrUsers: response.users
            })
        }
    }


    createNewUser = async (userData) => {
        try {
            let response = await createNewUserService(userData);
            if(response && response.errCode === 0){
                await this.getAllUsers();
                this.setState({
                    isOpenModalUser: false
                });
                emitter.emit('EVENT_CLEAR_MODAL_DATA');
                alert('Create new user successfully!');
            }else{
                alert(response.errMessage)
            }
        } catch (error) {
            console.log('Error creating new user: ', error);
        }
    }

    toggle = () => {
        this.setState({
            isOpenModalUser: !this.state.isOpenModalUser
        })
    }

    toggleEditModal = () => {
        this.setState({
            isOpenModalEditUser: !this.state.isOpenModalEditUser
        })
    }

    handleEditUser = async (user) => {
        console.log('Edit user: ', user);
        this.setState({
            isOpenModalEditUser: true,
            userEdit: user

        });
    }
    
    updateUser = async (userData) => {
        console.log('Check data from Modal Edit: ', userData);
        try {
            let response = await editUserService(userData);
            if(response && response.errCode === 0){
                await this.getAllUsers();
                this.setState({
                    isOpenModalEditUser: false
                });
                alert('Update user successfully!');
            }else{
                alert(response.errMessage)
            }
        } catch (error) {
            console.log('Error updating user: ', error);
        }
    }

    handleDeleteUser = async (user) => {
        console.log('Delete user: ', user);
        try {
            let response = await deleteUserService(user.id);
            if(response && response.errCode === 0){
                await this.getAllUsers();
                alert('Delete user successfully!');
            }else{
                alert(response.errMessage)
            }
        }
        catch (error) {
            console.log('Error deleting user: ', error);
        }
    }

    render() {
        let arrUsers = this.state.arrUsers;
        return (
            <div className="user-container">
                <ModalUser
                    isOpen={this.state.isOpenModalUser}
                    toggleFromParent={this.toggle}
                    createNewUser={this.createNewUser}
                />
                {
                    this.state.isOpenModalEditUser &&
                    <ModalEditUser
                        isOpen={this.state.isOpenModalEditUser}
                        toggleFromParent={this.toggleEditModal}
                        currentUser={this.state.userEdit}
                        updateUser={this.updateUser}
                    />
                }
                <div className="text-center title">Manage users</div>
                <div>
                    <button 
                    type="button"
                    className="btn btn-primary px-3"
                    onClick={() => this.handleAddNewUser()}
                    >
                        <i className="fas fa-plus"></i> Add new user
                    </button>
                </div>
                <div className="user-table ml-3 mx-1">

                <table id="customers">
                    <tbody>
                        <tr>
                            <th>Email</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Address</th>
                            <th>Action</th>
                        </tr>
                        {
                            arrUsers && arrUsers.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td key={index}>{item.email}</td>
                                        <td key={`firstName-${index}`}>{item.firstName}</td>
                                        <td key={`lastName-${index}`}>{item.lastName}</td>
                                        <td key={`address-${index}`}>{item.address}</td>
                                        <td>
                                            <button type="button" className="btn-edit" onClick={() => this.handleEditUser(item)}>
                                                <i className="fas fa-pencil-alt"></i>
                                            </button>
                                            <button type="button" className="btn-delete" onClick={() => this.handleDeleteUser(item)}>
                                                <i className="fas fa-trash-alt"></i>
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
