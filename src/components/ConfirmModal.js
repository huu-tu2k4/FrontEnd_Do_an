import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import './ConfirmModal.scss';
import * as actions from "../store/actions";
import { KeyCodeUtils } from "../utils";

class ConfirmModal extends Component {

    constructor(props) {
        super(props);
        this.acceptBtnRef = React.createRef();
        this.modalRef = React.createRef();
    }

    initialState = {
    };

    state = {
        ...this.initialState
    };

    componentDidMount() {
        document.addEventListener('keydown', this.handlerKeyDown);
        console.log('ConfirmModal mounted; initial isOpen =', this.props.contentOfConfirmModal && this.props.contentOfConfirmModal.isOpen);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handlerKeyDown);
    }

    handleBackdropClick = (e) => {
        if (e && e.target === e.currentTarget) {
            this.onClose();
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.contentOfConfirmModal && this.props.contentOfConfirmModal && prevProps.contentOfConfirmModal.isOpen !== this.props.contentOfConfirmModal.isOpen) {
            console.log('ConfirmModal: isOpen changed ->', this.props.contentOfConfirmModal.isOpen, 'messageId:', this.props.contentOfConfirmModal.messageId);
        }
    }

    handlerKeyDown = (event) => {
        const keyCode = event.which || event.keyCode;
        if (keyCode === KeyCodeUtils.ENTER) {
            if (!this.acceptBtnRef.current || this.acceptBtnRef.current.disabled) return;
            this.acceptBtnRef.current.click();
        }
    }

    onAcceptBtnClick = () => {
        const { contentOfConfirmModal } = this.props;
        if (contentOfConfirmModal.handleFunc) {
            contentOfConfirmModal.handleFunc(contentOfConfirmModal.dataFunc);
        }
        this.onClose();
    }

    onClose = () => {
        this.props.setContentOfConfirmModal({
            isOpen: false,
            messageId: "",
            handleFunc: null,
            dataFunc: null
        });
    }

    render() {
        const { contentOfConfirmModal } = this.props;

        if (!contentOfConfirmModal || !contentOfConfirmModal.isOpen) return null;

        return (
            <div className="confirm-modal-overlay" onClick={this.handleBackdropClick}>
                <div className="confirm-modal" ref={this.modalRef} role="dialog" aria-modal="true">
                    <div className="modal-header">
                        <div className="modal-title">
                            <FormattedMessage id={"common.confirm"} />
                        </div>
                        <div className="col-auto">
                            <button className="btn btn-close" onClick={this.onClose}>
                                <i className="fas fa-times" aria-hidden="true"></i>
                            </button>
                        </div>
                    </div>

                    <div className="modal-body">
                        <div className="confirm-modal-content">
                            <div className="row">
                                <div className="col-12" style={{ marginBottom: '20px', textAlign: 'center' }}>
                                    <FormattedMessage
                                        id={contentOfConfirmModal.messageId ? contentOfConfirmModal.messageId : "common.confirm-this-task"}
                                        values={contentOfConfirmModal.values || {}}
                                    />
                                </div>

                                <hr />

                                <div className="col-12">
                                    <div className="btn-container text-center">
                                        <button className="btn btn-cancel" onClick={this.onClose} >
                                            <FormattedMessage id="common.close" />
                                        </button>
                                        <button ref={this.acceptBtnRef} className="btn btn-accept" onClick={this.onAcceptBtnClick}>
                                            <FormattedMessage id={"common.accept"} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        lang: state.app.language,
        contentOfConfirmModal: state.app.contentOfConfirmModal
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setContentOfConfirmModal: (contentOfConfirmModal) => dispatch(actions.setContentOfConfirmModal(contentOfConfirmModal))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmModal);
