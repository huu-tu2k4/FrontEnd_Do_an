import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from 'react-intl';
import MdEditor from 'react-markdown-editor-lite';
import MarkdownIt from 'markdown-it';
import { CommonUtils, LANGUAGE } from '../../../utils';
import GlobalLoadingOverlay from '../../../components/GlobalLoadingOverlay/GlobalLoadingOverlay';
import SectionLoadingOverlay from '../../../components/SectionLoadingOverlay/SectionLoadingOverlay';
import { getAllSpecialty, createHandbook, getAllhandbooks, getHandbookById, updateHandbook } from '../../../services/userService';
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
            selectedSpecialty: null
            ,
            saveLoading: false,
            handbooks: [],
            listLoading: false,
            isEdit: false,
            editId: null
            ,
            showModal: false,
            // pagination/search
            currentPage: 1,
            itemsPerPage: 10,
            itemsPerPageOptions: [5,10,20],
            totalItems: 0,
            searchQuery: ''
        }
    }

    componentDidMount() {
        this.fetchSpecialties();
        this.fetchHandbooks(1, this.state.itemsPerPage, '');
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
        this.setState({ saveLoading: true });
        try {
            const payload = {
                nameVi: this.state.nameVi,
                nameEn: this.state.nameEn,
                imageBase64: this.state.imageBase64,
                descriptionHTML: this.state.descriptionHTML,
                descriptionMarkdown: this.state.descriptionMarkdown,
                specialtyId: this.state.selectedSpecialty ? this.state.selectedSpecialty.value : ''
            };
            let res;
            if (this.state.isEdit && this.state.editId) {
                res = await updateHandbook(this.state.editId, payload);
            } else {
                res = await createHandbook(payload);
            }
            if (res && res.errCode === 0) {
                toast.success(this.state.isEdit ? 'Cập nhật Handbook thành công' : 'Tạo Handbook thành công');
                this.setState({
                    nameVi: '', nameEn: '', imageBase64: '', descriptionHTML: '', descriptionMarkdown: '', previewImgURL: '', selectedSpecialty: null, isEdit: false, editId: null, showModal: false
                });
                this.fetchHandbooks();
            } else {
                toast.error('Tạo Handbook thất bại');
                console.log('handbook create res:', res);
            }
            return res;
        }
        catch (e) {
            console.log('Error creating handbook:', e);
            toast.error('Tạo Handbook thất bại');
            return { errCode: -1, errMessage: 'Error creating handbook' };
        }
        finally {
            this.setState({ saveLoading: false });
        }
    }

    fetchHandbooks = async () => {
        this.setState({ listLoading: true });
        try {
            const { currentPage, itemsPerPage, searchQuery } = this.state;
            const res = await getAllhandbooks(searchQuery, currentPage, itemsPerPage);
            if (res && res.data && res.data.errCode === 0) {
                this.setState({ handbooks: res.data.data || [], totalItems: res.data.total || 0 });
            } else if (res && res.data && res.data.data) {
                // fallback if service returns raw data
                this.setState({ handbooks: res.data.data || [], totalItems: res.data.total || 0 });
            } else if (res && res.errCode === 0) {
                this.setState({ handbooks: res.data || [], totalItems: res.total || 0 });
            }
        } catch (e) {
            console.error('fetchHandbooks error', e);
        } finally {
            this.setState({ listLoading: false });
        }
    }

    handleEdit = async (item) => {
        try {
            const res = await getHandbookById(item.id);
            if (res && res.errCode === 0) {
                const data = res.data || {};
                const specialtyOption = this.state.specialties.find(sp => sp.id === (data.specialtyId || item.specialtyId));
                this.setState({
                    nameVi: data.nameVi || '',
                    nameEn: data.nameEn || '',
                    descriptionHTML: data.descriptionHTML || '',
                    descriptionMarkdown: data.descriptionMarkdown || '',
                    previewImgURL: data.image || item.image || '',
                    selectedSpecialty: specialtyOption ? { value: specialtyOption.id, label: this.props.language === 'vi' ? specialtyOption.nameVi : specialtyOption.nameEn } : null,
                    isEdit: true,
                    editId: item.id
                });
                this.setState({ showModal: true });
            }
        } catch (e) {
            console.error('edit handbook error', e);
        }
    }

    handleSearchChange = (q) => {
        if (this.searchTimeout) clearTimeout(this.searchTimeout);
        this.setState({ searchQuery: q });
        this.searchTimeout = setTimeout(() => {
            this.setState({ currentPage: 1 }, () => this.fetchHandbooks(1, this.state.itemsPerPage, q));
        }, 500);
    }

    handleChangePage = (page) => {
        this.setState({ currentPage: page }, () => this.fetchHandbooks(page, this.state.itemsPerPage, this.state.searchQuery));
    }

    handlePrev = () => {
        this.setState((state) => ({ currentPage: Math.max(1, state.currentPage - 1) }), () => {
            this.fetchHandbooks(this.state.currentPage, this.state.itemsPerPage, this.state.searchQuery);
        });
    }

    handleNext = () => {
        const totalPages = Math.max(1, Math.ceil((this.state.totalItems || 0) / this.state.itemsPerPage));
        const nextPage = Math.min(totalPages, this.state.currentPage + 1);
        this.setState({ currentPage: nextPage }, () => this.fetchHandbooks(this.state.currentPage, this.state.itemsPerPage, this.state.searchQuery));
    }

    handleChangeItemsPerPage = (e) => {
        const itemsPerPage = parseInt(e.target.value, 10) || 10;
        this.setState({ itemsPerPage, currentPage: 1 }, () => this.fetchHandbooks(1, itemsPerPage, this.state.searchQuery));
    }

    render() {
        return (
            <div className="manage-handbook-container">
                <GlobalLoadingOverlay active={this.state.saveLoading} text={this.props.language === LANGUAGE.VI ? 'Đang lưu...' : 'Saving...'} />
                <div className="mh-title"><FormattedMessage id="admin.manage-handbook.title" /></div>


                {this.state.showModal && (
                    <div className="custom-modal-overlay">
                        <div className="custom-modal">
                            <div className="modal-header d-flex justify-content-between align-items-center">
                                <h5 className="m-0">{this.state.isEdit ? <FormattedMessage id="admin.manage-handbook.edit" defaultMessage="Sửa Handbook" /> : <FormattedMessage id="admin.manage-handbook.create" defaultMessage="Tạo Handbook" />}</h5>
                                <button className="btn btn-sm" onClick={() => this.setState({ showModal: false })}>×</button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
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
                                        <Select
                                            value={this.state.selectedSpecialty}
                                            onChange={(option) => this.setState({ selectedSpecialty: option })}
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
                                        <MdEditor style={{ height: '300px' }} renderHTML={text => mdParser.render(text)} onChange={this.handleEditorChange} value={this.state.descriptionMarkdown} />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => this.setState({ showModal: false })}><FormattedMessage id="button.cancel" defaultMessage="Hủy" /></button>
                                <button className="btn btn-primary" onClick={() => this.handleSaveNewHandbook()}>{this.state.isEdit ? <FormattedMessage id="button.save" defaultMessage="Lưu thay đổi" /> : <FormattedMessage id="button.create" defaultMessage="Tạo" />}</button>
                            </div>
                        </div>
                    </div>
                )}
                    <div className="col-12 mt-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <div style={{display:'flex', alignItems:'center', gap:12}}>
                                <h5 className="m-0"><FormattedMessage id="admin.manage-handbook.list" defaultMessage="Danh sách"/></h5>
                                <div className="search-input-wrapper" style={{minWidth:360, marginLeft: 12}}>
                                    <input
                                        className="form-control"
                                        placeholder={this.props.intl.formatMessage({ id: 'admin.manage-handbook.search', defaultMessage: 'Tìm theo tiêu đề' })}
                                        value={this.state.searchQuery || ''}
                                        onChange={(e) => this.handleSearchChange(e.target.value)}
                                    />
                                    <i className="fas fa-search search-icon" aria-hidden="true"></i>
                                </div>
                            </div>
                            <div>
                                <button type="button" className="btn btn-primary" onClick={() => this.setState({ showModal: true, isEdit: false, editId: null, nameVi: '', nameEn: '', descriptionHTML: '', descriptionMarkdown: '', imageBase64: '', previewImgURL: '', selectedSpecialty: null })}>
                                    <i className="fas fa-plus" /> <span style={{ marginLeft: 8 }}><FormattedMessage id="admin.manage-handbook.add-new" defaultMessage="Thêm mới" /></span>
                                </button>
                            </div>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <SectionLoadingOverlay active={this.state.listLoading} text={this.props.language === LANGUAGE.VI ? 'Đang tải...' : 'Loading...'} />
                            <div className="table-wrapper">
                            <table className="user-table">
                                <thead>
                                    <tr>
                                        <th><FormattedMessage id="admin.manage-handbook.table.index" defaultMessage="#" /></th>
                                        <th><FormattedMessage id="admin.manage-handbook.table.titleVi" defaultMessage="Tiêu đề (VI)" /></th>
                                        <th><FormattedMessage id="admin.manage-handbook.table.titleEn" defaultMessage="Tiêu đề (EN)" /></th>
                                        <th><FormattedMessage id="admin.manage-handbook.table.specialty" defaultMessage="Chuyên khoa" /></th>
                                        <th><FormattedMessage id="admin.manage-handbook.table.actions" defaultMessage="Hành động" /></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.handbooks && this.state.handbooks.map((item, idx) => (
                                        <tr key={item.id}>
                                            <td>{idx + 1}</td>
                                            <td>{item.nameVi}</td>
                                            <td>{item.nameEn}</td>
                                            <td>{item.specialtyData ? (this.props.language === 'vi' ? item.specialtyData.nameVi : item.specialtyData.nameEn) : ''}</td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="btn-edit"
                                                    title={this.props.intl.formatMessage({ id: 'button.edit', defaultMessage: 'Sửa' })}
                                                    aria-label={this.props.intl.formatMessage({ id: 'button.edit', defaultMessage: 'Sửa' })}
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

const mapStateToProps = state => ({ language: state.app.language });
const mapDispatchToProps = dispatch => ({ });

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(ManageHandbook));
