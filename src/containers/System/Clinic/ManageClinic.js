import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from 'react-intl';
import MdEditor from 'react-markdown-editor-lite';
import MarkdownIt from 'markdown-it';
import { CommonUtils, LANGUAGE } from '../../../utils';
import GlobalLoadingOverlay from '../../../components/GlobalLoadingOverlay/GlobalLoadingOverlay';
import SectionLoadingOverlay from '../../../components/SectionLoadingOverlay/SectionLoadingOverlay';
import { toast } from 'react-toastify';
import { createNewClinic, getAllClinic, getDetailClinicById, updateClinic } from '../../../services/userService';

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
            ,
            saveLoading: false,
            listLoading: false,
            clinics: [],
            isEdit: false,
            editId: null
            ,
            showModal: false,
            currentPage: 1,
            itemsPerPage: 10,
            itemsPerPageOptions: [5,10,20],
            totalItems: 0,
            searchQuery: ''
        }
    }

    componentDidMount() {
        this.fetchClinics(1, this.state.itemsPerPage, '');
        
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
        this.setState({ saveLoading: true });
        try {
            const payload = {
                name: this.state.name,
                address: this.state.address,
                imageBase64: this.state.imageBase64,
                descriptionHTML: this.state.descriptionHTML,
                descriptionMarkdown: this.state.descriptionMarkdown
            };

            let res;
            if (this.state.isEdit && this.state.editId) {
                res = await updateClinic(this.state.editId, payload);
            } else {
                res = await createNewClinic(payload);
            }
            if(res && res.errCode === 0) {
                toast.success(this.props.intl.formatMessage({ id: this.state.isEdit ? 'admin.manage-clinic.update-success' : 'admin.manage-clinic.create-success' }));
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
                this.fetchClinics(this.state.currentPage, this.state.itemsPerPage, this.state.searchQuery);
                this.setState({ showModal: false, isEdit: false, editId: null });
            } else {
                toast.error(this.props.intl.formatMessage({ id: 'admin.manage-clinic.create-failed' }));
                console.log('check res: ', res);
            }
            return res;
        }
        catch (e) {
            console.log('Error creating clinic:', e);
            toast.error(this.props.intl.formatMessage({ id: 'admin.manage-clinic.create-failed' }));
            return { errCode: -1, errMessage: 'Error creating clinic' };
        }
        finally {
            this.setState({ saveLoading: false });
        }
    }

    fetchClinics = async () => {
        this.setState({ listLoading: true });
        try {
            const { currentPage, itemsPerPage, searchQuery } = this.state;
            const res = await getAllClinic(searchQuery, currentPage, itemsPerPage);
            if (res && res.data && res.data.errCode === 0) {
                this.setState({ clinics: res.data.data || [], totalItems: res.data.total || 0 });
            } else if (res && res.data && res.data.data) {
                this.setState({ clinics: res.data.data || [], totalItems: res.data.total || 0 });
            } else if (res && res.errCode === 0) {
                this.setState({ clinics: res.data || [], totalItems: res.total || 0 });
            }
        } catch (e) {
            console.error('fetchClinics error', e);
        } finally {
            this.setState({ listLoading: false });
        }
    }

    handleEdit = async (item) => {
        try {
            const res = await getDetailClinicById({ id: item.id });
            if (res && res.errCode === 0) {
                const data = res.data || {};
                this.setState({
                    name: data.name || item.name || '',
                    address: data.address || item.address || '',
                    descriptionHTML: data.descriptionHTML || '',
                    descriptionMarkdown: data.descriptionMarkdown || '',
                    isEdit: true,
                    editId: item.id,
                    previewImgURL: item.image || '',
                    showModal: true
                });
            }
        } catch (e) {
            console.error('edit clinic error', e);
        }
    }

    handleSearchChange = (q) => {
        if (this.searchTimeout) clearTimeout(this.searchTimeout);
        this.setState({ searchQuery: q });
        this.searchTimeout = setTimeout(() => {
            this.setState({ currentPage: 1 }, () => this.fetchClinics(1, this.state.itemsPerPage, q));
        }, 500);
    }

    handleChangePage = (page) => {
        this.setState({ currentPage: page }, () => this.fetchClinics(page, this.state.itemsPerPage, this.state.searchQuery));
    }

    handlePrev = () => {
        this.setState((state) => ({ currentPage: Math.max(1, state.currentPage - 1) }), () => {
            this.fetchClinics(this.state.currentPage, this.state.itemsPerPage, this.state.searchQuery);
        });
    }

    handleNext = () => {
        const totalPages = Math.max(1, Math.ceil((this.state.totalItems || 0) / this.state.itemsPerPage));
        const nextPage = Math.min(totalPages, this.state.currentPage + 1);
        this.setState({ currentPage: nextPage }, () => this.fetchClinics(this.state.currentPage, this.state.itemsPerPage, this.state.searchQuery));
    }

    handleChangeItemsPerPage = (e) => {
        const itemsPerPage = parseInt(e.target.value, 10) || 10;
        this.setState({ itemsPerPage, currentPage: 1 }, () => this.fetchClinics(1, itemsPerPage, this.state.searchQuery));
    }

    toggleModal = (open = false) => {
        this.setState({ showModal: open });
    }

    openCreateModal = () => {
        this.setState({ name: '', address: '', imageBase64: '', descriptionHTML: '', descriptionMarkdown: '', previewImgURL: '', isEdit: false, editId: null, showModal: true });
    }

    render() {
        
        return (
            <div className="manage-clinic-container">
                <GlobalLoadingOverlay active={this.state.saveLoading} text={this.props.language === LANGUAGE.VI ? 'Đang lưu...' : 'Saving...'} />
                <div className="mc-title"><FormattedMessage id="admin.manage-clinic.title" /></div>

                {this.state.showModal && (
                    <div className="custom-modal-overlay">
                        <div className="custom-modal">
                            <div className="modal-header d-flex justify-content-between align-items-center">
                                <h5 className="m-0">{this.state.isEdit ? <FormattedMessage id="admin.manage-clinic.edit-modal-title" /> : <FormattedMessage id="admin.manage-clinic.create-modal-title" />}</h5>
                                <button className="btn btn-sm" onClick={() => this.toggleModal(false)}>×</button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
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
                                            <input id="prevImg" type="file" hidden onChange={(event) => this.handleOnChangeImg(event)}></input>
                                            <label htmlFor="prevImg" className="btn btn-primary">
                                                <FormattedMessage id="user.choose-image" />
                                                <i className="fas fa-upload"></i>
                                            </label>
                                            <div className="priview-image">
                                                {this.state.previewImgURL && (
                                                    <img src={this.state.previewImgURL} alt="preview" onLoad={this.handleImgLoad} />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <span><FormattedMessage id="admin.manage-clinic.description" /></span>
                                    </div>
                                    <div className="col-12">
                                        <MdEditor style={{ height: '300px' }} renderHTML={text => mdParser.render(text)} onChange={this.handleEditorChange} value={this.state.descriptionMarkdown} />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => this.toggleModal(false)}><FormattedMessage id="button.cancel" /></button>
                                <button className="btn btn-primary" onClick={() => this.handleSaveNewClinic()}>{this.state.isEdit ? <FormattedMessage id="button.save-changes" /> : <FormattedMessage id="button.create" />}</button>
                            </div>
                        </div>
                    </div>
                )}
                <div className="col-12 mt-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div style={{display:'flex', alignItems:'center', gap:12}}>
                            <h5 className="m-0"><FormattedMessage id="admin.manage-clinic.list-title" /></h5>
                            <div className="search-input-wrapper" style={{minWidth:360, marginLeft: 12}}>
                                <input
                                    className="form-control"
                                    placeholder={this.props.intl.formatMessage({ id: 'admin.manage-clinic.search-placeholder' })}
                                    value={this.state.searchQuery || ''}
                                    onChange={(e) => this.handleSearchChange(e.target.value)}
                                />
                                <i className="fas fa-search search-icon" aria-hidden="true"></i>
                            </div>
                        </div>
                        <div>
                            <button type="button" className="btn btn-primary" onClick={this.openCreateModal}>
                                <i className="fas fa-plus" /> <span style={{ marginLeft: 8 }}><FormattedMessage id="admin.manage-clinic.add-new" /></span>
                            </button>
                        </div>
                    </div>
                    <div style={{ position: 'relative' }}>
                        <SectionLoadingOverlay active={this.state.listLoading} text={this.props.language === LANGUAGE.VI ? 'Đang tải...' : 'Loading...'} />
                        <div className="table-wrapper">
                        <table className="user-table">
                            <thead>
                                <tr>
                                    <th><FormattedMessage id="admin.manage-clinic.table.index" /></th>
                                    <th><FormattedMessage id="admin.manage-clinic.table.name" /></th>
                                    <th><FormattedMessage id="admin.manage-clinic.table.address" /></th>
                                    <th><FormattedMessage id="admin.manage-clinic.table.image" /></th>
                                    <th><FormattedMessage id="admin.manage-clinic.table.actions" /></th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.clinics && this.state.clinics.map((item, idx) => (
                                    <tr key={item.id}>
                                        <td>{idx + 1}</td>
                                        <td>{item.name}</td>
                                        <td className="td-muted">{item.address}</td>
                                        <td style={{ width: 80 }}>{item.image && <img src={item.image} alt="thumb" style={{ maxWidth: 80, maxHeight: 60 }} />}</td>
                                        <td>
                                            <button
                                                type="button"
                                                className="btn-edit"
                                                title={this.props.intl.formatMessage({ id: 'admin.manage-clinic.table.edit' })}
                                                aria-label={this.props.intl.formatMessage({ id: 'admin.manage-clinic.table.edit' })}
                                                onClick={() => this.handleEdit(item)}>
                                                <i className="fas fa-pencil-alt" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                    <div className="pagination-wrapper">
                        <div className="pagination-meta">
                            <label>
                                <span><FormattedMessage id="pagination.showing" /> </span>
                                <select value={this.state.itemsPerPage} onChange={this.handleChangeItemsPerPage}>
                                    {this.state.itemsPerPageOptions.map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                                <span> <FormattedMessage id="pagination.total" values={{ count: this.state.totalItems }} /></span>
                            </label>
                        </div>
                        <div className="pagination-controls">
                            <button type="button" onClick={this.handlePrev} disabled={this.state.currentPage <= 1}>←</button>
                            {[...Array(Math.max(1, Math.ceil((this.state.totalItems || 0) / this.state.itemsPerPage)))].map((_, i) => {
                                const page = i + 1;
                                return (
                                    <button key={page} type="button" className={page === this.state.currentPage ? 'active' : ''} onClick={() => this.handleChangePage(page)}>{page}</button>
                                )
                            })}
                            <button type="button" onClick={this.handleNext} disabled={this.state.currentPage >= Math.max(1, Math.ceil((this.state.totalItems || 0) / this.state.itemsPerPage))}>→</button>
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

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(ManageClinic));
