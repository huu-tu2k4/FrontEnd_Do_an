import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import MdEditor from 'react-markdown-editor-lite';
import MarkdownIt from 'markdown-it';
import { CommonUtils } from '../../../utils';
import { createNewSpecialtyService } from '../../../services/userService';
import { toast } from 'react-toastify';

import './ManageSpecialty.scss';

const mdParser = new MarkdownIt(/* Markdown-it options */);
class ManageSpecialty extends Component {

    constructor(props) {
        super(props);
        this.state = {
            nameVi: '',
            nameEn: '',
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
    handleSaveNewSpecialty = async () => {
        console.log('check state: ', this.state);
        let res = await createNewSpecialtyService({
            nameVi: this.state.nameVi,
            nameEn: this.state.nameEn,
            imageBase64: this.state.imageBase64,
            descriptionHTML: this.state.descriptionHTML,
            descriptionMarkdown: this.state.descriptionMarkdown
        });
        if(res && res.errCode === 0) {
            toast.success('Create new specialty succeed!');
            this.setState({
                nameVi: '',
                nameEn: '',
                imageBase64: '',
                descriptionHTML: '',
                descriptionMarkdown: '',
                previewImgURL: '',
                previewWidth: null,
                previewHeight: null
            })
        }
        else {
            toast.error('Create new specialty failed!');
            console.log('check res: ', res);
        }
    }

    render() {
        
        return (
            <div>
                <div className="manage-specialty-container">
                    <div className="ms-title"><FormattedMessage id="admin.manage-specialty.title" /></div>
                    <div className="all-new-specialty row">
                        <div className="col-6 form-group">
                            <label><FormattedMessage id="admin.manage-specialty.name-vi" /></label>
                            <input className="form-control" type="text" value={this.state.nameVi} onChange={(e) => this.setState({ nameVi: e.target.value })} />
                        </div>
                        <div className="col-6 form-group">
                            <label><FormattedMessage id="admin.manage-specialty.name-en" /></label>
                            <input className="form-control" type="text" value={this.state.nameEn} onChange={(e) => this.setState({ nameEn: e.target.value })} />
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
                            <MdEditor
                                style={{ height: '300px' }}
                                renderHTML={text => mdParser.render(text)}
                                onChange={this.handleEditorChange}
                                value={this.state.descriptionMarkdown}
                            />
                        </div>
                        <div className="col-12">
                            <button 
                            className="btn btn-primary btn-save-specialty"
                            onClick={() => this.handleSaveNewSpecialty()}
                            ><FormattedMessage id="admin.manage-specialty.save" /></button>
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageSpecialty);
