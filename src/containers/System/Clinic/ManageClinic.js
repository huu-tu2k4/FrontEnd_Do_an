import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import MdEditor from 'react-markdown-editor-lite';
import MarkdownIt from 'markdown-it';
import { CommonUtils } from '../../../utils';
import { toast } from 'react-toastify';
import { createNewClinic } from '../../../services/userService';

import './ManageClinic.scss';

const mdParser = new MarkdownIt(/* Markdown-it options */);
class ManageClinic extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            address: '',
            imageBase64: '',
            descriptionHTML: '',
            descriptionMarkdown: '',
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
    }

    handleEditorChange = ({ html, text }) => {
        this.setState({
            descriptionHTML: html,
            descriptionMarkdown: text,
        })
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
    handleSaveNewClinic = async () => {
        console.log('check state: ', this.state);
        let res = await createNewClinic({
            name: this.state.name,
            address: this.state.address,
            imageBase64: this.state.imageBase64,
            descriptionHTML: this.state.descriptionHTML,
            descriptionMarkdown: this.state.descriptionMarkdown
        });
        if(res && res.errCode === 0) {
            toast.success('Create new clinic succeed!');
            this.setState({
                name: '',
                address: '',
                imageBase64: '',
                descriptionHTML: '',
                descriptionMarkdown: '',
                previewImgURL: '',
                previewWidth: null,
                previewHeight: null
            })
        }
        else {
            toast.error('Create new clinic failed!');
            console.log('check res: ', res);
        }
    }

    render() {
        
        return (
            <div>
                <div className="manage-clinic-container">
                    <div className="mc-title"><FormattedMessage id="admin.manage-clinic.title" /></div>
                    <div className="all-new-clinic row">
                        <div className="col-6 form-group">
                            <label><FormattedMessage id="admin.manage-clinic.name" /></label>
                            <input className="form-control" type="text" value={this.state.name} onChange={(e) => this.setState({ name: e.target.value })} />
                        </div>
                        <div className="col-6 form-group">
                            <label><FormattedMessage id="admin.manage-clinic.address" /></label>
                            <input className="form-control" type="text" value={this.state.address} onChange={(e) => this.setState({ address: e.target.value })} />
                        </div>
                        <div className="form-group col-md-6">
                            <label><FormattedMessage id="user.image" /></label>
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
                        <div className="col-12">
                            <span><FormattedMessage id="admin.manage-clinic.description" /></span>
                        </div>
                        <div className="col-12">
                            <MdEditor
                                style={{ height: '300px' }}
                                renderHTML={text => mdParser.render(text)}
                                onChange={this.handleEditorChange}
                                value={this.state.descriptionMarkdown}
                            />
                        </div>
                        <div className="col-12">
                            <button 
                            className="btn btn-primary btn-save-clinic"
                            onClick={() => this.handleSaveNewClinic()}
                            ><FormattedMessage id="admin.manage-clinic.save" /></button>
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
        
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageClinic);
