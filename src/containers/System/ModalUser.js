import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import ValidatedInput from '../../components/Input/ValidatedInput';
import { connect } from 'react-redux';
import { emitter } from '../../utils/emitter';


class ModalUser extends Component {

    constructor(props){
        super(props);
        this.state = {
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            address: ''
        }
        this.listenToEmitter();
    }

    listenToEmitter() {
        emitter.on('EVENT_CLEAR_MODAL_DATA', () => {
            this.setState({
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                address: ''
            });
        });
    }


    componentDidMount() {
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


    handleAddNewUser = () => {
        let isValid = this.checkValidateInput();
        if(isValid === true){
            this.props.createNewUser(this.state);
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
                <ModalHeader toggle={this.toggle}>You're Gay</ModalHeader>
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
                                value={this.state.email}
                                required
                            />
                        </div>
                        <div className="input-container">
                            {/* <label><FormattedMessage id="manage-user.first-name"/></label> */}
                            <label>Password</label>
                            <input onChange={(event) => {this.handleOnChange(event, 'password')}} 
                                type="password" 
                                className="form-control" 
                                placeholder="Password" 
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
                    <Button color="primary" className="px-3" onClick={() => {this.handleAddNewUser()}}>Add New+</Button>{' '}
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalUser);
