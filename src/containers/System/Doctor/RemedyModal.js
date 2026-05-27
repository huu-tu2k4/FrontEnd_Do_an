import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import { toast } from 'react-toastify';
import { CommonUtils } from '../../../utils';
import _ from 'lodash';
import { LANGUAGE } from '../../../utils';

import './RemedyModal.scss';

class RemedyModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            patientName: '',
            patientEmail: '',
            imageBase64: '',
            previewImgURL: '',
            previewWidth: null,
            previewHeight: null
        }
    }

    componentDidMount() {
        
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.language !== prevProps.language) {
            
        }
        if(this.props.dataModal !== prevProps.dataModal) {
            let { dataModal } = this.props;
            this.setState({
                patientName: this.buildNamePatient(dataModal),
                patientEmail: _.get(dataModal, 'patientData.email', ''),
                imageBase64: '',
                previewImgURL: '',
                previewWidth: null,
                previewHeight: null
            })
        }
    }
    
    buildNamePatient = (dataModal) => {
        let result = {};
        if(dataModal && !_.isEmpty(dataModal) && dataModal.patientData && !_.isEmpty(dataModal.patientData)) {
            if(this.props.language === LANGUAGE.VI) {
                result = `${_.get(dataModal, 'patientData.lastName', '')} ${_.get(dataModal, 'patientData.firstName', '')}`;
            }
            else {
                result = `${_.get(dataModal, 'patientData.firstName', '')} ${_.get(dataModal, 'patientData.lastName', '')}`;
            }
        }
        return result;
    }

    handleOnChangeImg = async (event) => {
        let file = event.target.files[0];
        if (file) {
            let objectUrl = URL.createObjectURL(file);
            let base64 = await CommonUtils.getBase64(file);
            this.setState({
                previewImgURL: objectUrl,
                previewWidth: null,
                previewHeight: null,
                imageBase64: base64
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

    handleSendRemedy = () => {
        this.props.sendRemedy({
            email: this.state.patientEmail,
            imgBase64: this.state.imageBase64
        });
    }

    render() {
        let { isOpen, dataModal } = this.props;
        // console.log('check dataModal: ', dataModal);
        return (
            <Modal
                isOpen={isOpen}
                size='lg'
                centered
            >
                <ModalHeader toggle={this.props.closeRemedyModal}>
                    <FormattedMessage id="manage-patient.remedy" />
                </ModalHeader>
                <ModalBody>
                    <div className='remedy-modal-body row'>
                        <div className='col-6 form-group'>
                            <label><FormattedMessage id="manage-patient.table.name" /></label>
                            <input className='form-control' type='text' value={this.state.patientName} disabled />
                        </div>
                        <div className='col-6 form-group'>
                            <label><FormattedMessage id="manage-patient.table.email" /></label>
                            <input className='form-control' type='text' value={this.state.patientEmail} disabled />
                        </div>
                        <div className="form-group col-md-6">
                            <label><FormattedMessage id="manage-patient.remedy-image" /></label>
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
                </ModalBody>
                <ModalFooter>
                    <button className="btn btn-success" onClick={() => this.handleSendRemedy()}>
                        <FormattedMessage id="manage-patient.send-remedy"/>
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={this.props.closeRemedyModal}
                    >
                        <FormattedMessage id="manage-patient.close" />
                    </button>
                </ModalFooter>
            </Modal>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(RemedyModal);
