import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import MdEditor from 'react-markdown-editor-lite';
import MarkdownIt from 'markdown-it';
import { CommonUtils } from '../../../utils';
import { getAllSpecialty, createHandbook } from '../../../services/userService';
import { toast } from 'react-toastify';
import Select from 'react-select';

import './ManageHandbook.scss';

const mdParser = new MarkdownIt();

class ManageHandbook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nameVi: '',
            nameEn: '',
            imageBase64: '',
            descriptionHTML: '',
            descriptionMarkdown: '',
            previewImgURL: '',
            specialties: [],
            selectedSpecialty: ''
        }
    }

    componentDidMount() {
        this.fetchSpecialties();
    }

    fetchSpecialties = async () => {
        try {
            const res = await getAllSpecialty();
            if (res && res.errCode === 0) {
                this.setState({ specialties: res.data });
            }
        } catch (e) {
            console.error('Fetch specialties error', e);
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
                imageBase64: base64
            })
        } else {
            this.setState({ previewImgURL: '' })
        }
    }

    handleSaveNewHandbook = async () => {
        const payload = {
            nameVi: this.state.nameVi,
            nameEn: this.state.nameEn,
            imageBase64: this.state.imageBase64,
            descriptionHTML: this.state.descriptionHTML,
            descriptionMarkdown: this.state.descriptionMarkdown
            ,
            specialtyId: this.state.selectedSpecialty
        };
        let res = await createHandbook(payload);
        if (res && res.errCode === 0) {
            toast.success('Tạo Handbook thành công');
            this.setState({
                nameVi: '', nameEn: '', imageBase64: '', descriptionHTML: '', descriptionMarkdown: '', previewImgURL: '', selectedSpecialty: ''
            });
        } else {
            toast.error('Tạo Handbook thất bại');
            console.log('handbook create res:', res);
        }
    }

    render() {
        return (
            <div className="manage-handbook-container">
                <div className="mh-title"><FormattedMessage id="admin.manage-handbook.title" /></div>
                <div className="all-new-handbook row">
                    <div className="col-6 form-group">
                        <label><FormattedMessage id="admin.manage-handbook.name-vi" /></label>
                        <input className="form-control" type="text" value={this.state.nameVi} onChange={(e) => this.setState({ nameVi: e.target.value })} />
                    </div>
                    <div className="col-6 form-group">
                        <label><FormattedMessage id="admin.manage-handbook.name-en" /></label>
                        <input className="form-control" type="text" value={this.state.nameEn} onChange={(e) => this.setState({ nameEn: e.target.value })} />
                    </div>
                    <div className="col-6 form-group">
                        <label><FormattedMessage id="admin.manage-handbook.specialty" /></label>
                        {/* <select className="form-control" value={this.state.selectedSpecialty} onChange={(e) => this.setState({ selectedSpecialty: e.target.value })}>
                            <option value="" disabled>{this.props.language === 'vi' ? '-- Chọn --' : '-- Select --'}</option>
                            {this.state.specialties && this.state.specialties.length > 0 && this.state.specialties.map((sp) => (
                                <option key={sp.id} value={sp.id}>{this.props.language === 'vi' ? sp.nameVi : sp.nameEn}</option>
                            ))}
                        </select> */}
                        <Select
                            value={this.state.selectedSpecialty}
                            onChange={(e) => this.setState({ selectedSpecialty: e.target.value })}
                            options={this.state.specialties.map(sp => ({ value: sp.id, label: this.props.language === 'vi' ? sp.nameVi : sp.nameEn }))}
                            placeholder={<FormattedMessage id="admin.manage-handbook.select-specialty" />}
                        />
                    </div>
                    <div className="form-group col-md-6">
                        <label><FormattedMessage id="user.image" /></label>
                        <div className="preview-img-container">
                            <input id="handbookImg" type="file" hidden onChange={(event) => this.handleOnChangeImg(event)}></input>
                            <label htmlFor="handbookImg" className="btn btn-primary">
                                <FormattedMessage id="user.choose-image" />
                                <i className="fas fa-upload"></i>
                            </label>
                            <div className="priview-image">
                                {this.state.previewImgURL && (
                                    <img src={this.state.previewImgURL} alt="preview" />
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="col-12">
                        <span><FormattedMessage id="admin.manage-handbook.content" /></span>
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
                        <button className="btn btn-primary btn-save-handbook" onClick={() => this.handleSaveNewHandbook()}>
                            <FormattedMessage id="admin.manage-handbook.save" />
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({ language: state.app.language });
const mapDispatchToProps = dispatch => ({ });

export default connect(mapStateToProps, mapDispatchToProps)(ManageHandbook);
