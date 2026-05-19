import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import ValidatedInput from '../../components/Input/ValidatedInput';
import { connect } from 'react-redux';
import { emitter } from '../../utils/emitter';
import _ from 'lodash';


class ModalEditUser extends Component {

    constructor(props){
        super(props);
        this.state = {
            id: '',
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            address: ''
        }
    }

    componentDidMount() {
        let user = this.props.currentUser;
        if(user && !_.isEmpty(user)){
            this.setState({
                id: user.id,
                email: user.email,
                password: 'hashcode',
                firstName: user.firstName,
                lastName: user.lastName,
                address: user.address
            })
        }
    }

    toggle = () => {
        this.props.toggleFromParent();
    }

    handleOnChange = (event, id) => {
        let copyState = {...this.state};
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        }, () => {
            // console.log('check state', this.state)
        })
    }

    checkValidateInput = () => {
        let isValid = true;
        let arrInput = ['email', 'password', 'firstName', 'lastName', 'address'];
        for (let i = 0; i < arrInput.length; i++) {
            if (!this.state[arrInput[i]]) {
                isValid = false;
                break;
            }
        }
        return isValid;
    }


    handleSaveUser = () => {
        let isValid = this.checkValidateInput();
        if(isValid === true){
            this.props.updateUser(this.state);
        }else{
            alert('Missing parameter')
        }
    }

    render() {
        return (
            <Modal 
                isOpen={this.props.isOpen} 
                toggle={this.toggle}
                size='lg'
                className='modal-user-container'
                >
                <ModalHeader toggle={this.toggle}>Update You're Gay</ModalHeader>
                <ModalBody>
                    <div className="modal-user-body">
                        {/* <FormattedMessage id="manage-user.add"/> */}
                        <div className="input-container">
                            {/* <label><FormattedMessage id="manage-user.email"/></label> */}
                            <label>Email</label>
                            <ValidatedInput onChange={(event) => {this.handleOnChange(event, 'email')}}
                                type="email"
                                className="form-control"
                                placeholder="Email"
                                disabled
                                value={this.state.email}
                            />
                        </div>
                        <div className="input-container">
                            <label>Password</label>
                            <input onChange={(event) => {this.handleOnChange(event, 'password')}} 
                                type="password" 
                                className="form-control" 
                                placeholder="Password" 
                                disabled
                                value={this.state.password}
                            />
                        </div>
                        <div className="input-container">
                            {/* <label><FormattedMessage id="manage-user.first-name"/></label> */}
                            <label>First Name</label>
                            <input onChange={(event) => {this.handleOnChange(event, 'firstName')}} 
                                type="text" 
                                className="form-control" 
                                placeholder="First Name" 
                                value={this.state.firstName}
                            />
                        </div>
                        <div className="input-container">
                            {/* <label><FormattedMessage id="manage-user.last-name"/></label> */}
                            <label>Last Name</label>
                            <input onChange={(event) => {this.handleOnChange(event, 'lastName')}} 
                                type="text" 
                                className="form-control" 
                                placeholder="Last Name" 
                                value={this.state.lastName}
                            />
                        </div>
                        <div className="input-container input-container-address">
                            {/* <label><FormattedMessage id="manage-user.address"/></label> */}
                            <label>Address</label>
                            <input onChange={(event) => {this.handleOnChange(event, 'address')}} 
                                type="text" 
                                className="form-control" 
                                placeholder="Address" 
                                value={this.state.address}
                            />
                        </div>
                    </div>    
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" className="px-3" onClick={() => {this.handleSaveUser()}}>Save</Button>{' '}
                </ModalFooter>
            </Modal>
        )
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalEditUser);
