import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from 'react-intl';
import MdEditor from 'react-markdown-editor-lite';
import MarkdownIt from 'markdown-it';
import { CommonUtils, LANGUAGE } from '../../../utils';
import GlobalLoadingOverlay from '../../../components/GlobalLoadingOverlay/GlobalLoadingOverlay';
import SectionLoadingOverlay from '../../../components/SectionLoadingOverlay/SectionLoadingOverlay';
import { createNewSpecialtyService, getAllSpecialty, getDetailSpecialtyById, updateSpecialty } from '../../../services/userService';
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
            ,
            saveLoading: false,
            specialties: [],
            listLoading: false,
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
        this.fetchSpecialties(1, this.state.itemsPerPage, '');
        
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
        this.setState({ saveLoading: true });
        try {
            const payload = {
                nameVi: this.state.nameVi,
                nameEn: this.state.nameEn,
                imageBase64: this.state.imageBase64,
                descriptionHTML: this.state.descriptionHTML,
                descriptionMarkdown: this.state.descriptionMarkdown
            };

            let res;
            if (this.state.isEdit && this.state.editId) {
                res = await updateSpecialty(this.state.editId, payload);
            } else {
                res = await createNewSpecialtyService(payload);
            }
            if(res && res.errCode === 0) {
                toast.success(this.state.isEdit ? 'Cập nhật chuyên khoa thành công' : 'Tạo chuyên khoa thành công');
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
                this.fetchSpecialties(this.state.currentPage, this.state.itemsPerPage, this.state.searchQuery);
                this.setState({ showModal: false, isEdit: false, editId: null });
            }
            else {
                toast.error('Create new specialty failed!');
                console.log('check res: ', res);
            }
            return res;
        }
        catch (e) {
            console.log('Error creating specialty:', e);
            toast.error('Create new specialty failed!');
            return { errCode: -1, errMessage: 'Error creating specialty' };
        }
        finally {
            this.setState({ saveLoading: false });
        }
    }

    fetchSpecialties = async (page = 1, limit = 10, q = '') => {
        this.setState({ listLoading: true });
        try {
            const res = await getAllSpecialty(q, page, limit);
            // Debug log to inspect response shape when total shows 0
            // eslint-disable-next-line no-console
            console.log('fetchSpecialties response:', res && res.data ? res.data : res);

            let dataList = [];
            let total = 0;

            if (res) {
                const body = res.data || res;
                if (body.errCode === 0 && Array.isArray(body.data)) {
                    dataList = body.data;
                    total = typeof body.total === 'number' ? body.total : (body.total ? Number(body.total) : dataList.length);
                } else if (body.rows || body.count !== undefined) {
                    dataList = body.rows || [];
                    total = typeof body.count === 'number' ? body.count : (body.count ? Number(body.count) : dataList.length);
                } else if (Array.isArray(body)) {
                    dataList = body;
                    total = body.length;
                }
            }

            this.setState({ specialties: dataList || [], totalItems: total || 0 });

        } catch (e) {
            console.error('fetchSpecialties error', e);
        } finally {
            this.setState({ listLoading: false });
        }
    }

    handleEdit = async (item) => {
        try {
            const res = await getDetailSpecialtyById({ id: item.id, location: 'ALL' });
            if (res && res.errCode === 0) {
                const data = res.data || {};
                this.setState({
                    nameVi: data.nameVi || item.nameVi || '',
                    nameEn: data.nameEn || item.nameEn || '',
                    descriptionHTML: data.descriptionHTML || '',
                    descriptionMarkdown: data.descriptionMarkdown || '',
                    isEdit: true,
                    editId: item.id,
                    previewImgURL: item.image || '',
                    showModal: true
                });
            }
        } catch (e) {
            console.error('edit specialty error', e);
        }
    }

    handleSearchChange = (q) => {
        if (this.searchTimeout) clearTimeout(this.searchTimeout);
        this.setState({ searchQuery: q });
        this.searchTimeout = setTimeout(() => {
            this.setState({ currentPage: 1 }, () => this.fetchSpecialties(1, this.state.itemsPerPage, q));
        }, 500);
    }

    handleChangePage = (page) => {
        this.setState({ currentPage: page }, () => this.fetchSpecialties(page, this.state.itemsPerPage, this.state.searchQuery));
    }

    handlePrev = () => {
        this.setState((state) => ({ currentPage: Math.max(1, state.currentPage - 1) }), () => {
            this.fetchSpecialties(this.state.currentPage, this.state.itemsPerPage, this.state.searchQuery);
        });
    }

    handleNext = () => {
        const totalPages = Math.max(1, Math.ceil((this.state.totalItems || 0) / this.state.itemsPerPage));
        const nextPage = Math.min(totalPages, this.state.currentPage + 1);
        this.setState({ currentPage: nextPage }, () => this.fetchSpecialties(this.state.currentPage, this.state.itemsPerPage, this.state.searchQuery));
    }

    handleChangeItemsPerPage = (e) => {
        const itemsPerPage = parseInt(e.target.value, 10) || 10;
        this.setState({ itemsPerPage, currentPage: 1 }, () => this.fetchSpecialties(1, itemsPerPage, this.state.searchQuery));
    }

    toggleModal = (open = false) => {
        this.setState({ showModal: open });
    }

    openCreateModal = () => {
        this.setState({
            nameVi: '', nameEn: '', imageBase64: '', descriptionHTML: '', descriptionMarkdown: '', previewImgURL: '', isEdit: false, editId: null, showModal: true
        });
    }

    render() {
        
        return (
            <div>
                <div className="manage-specialty-container">
                    <GlobalLoadingOverlay active={this.state.saveLoading} text={this.props.language === LANGUAGE.VI ? 'Đang lưu...' : 'Saving...'} />
                    <div className="ms-title"><FormattedMessage id="admin.manage-specialty.title" /></div>
                    

                    {this.state.showModal && (
                        <div className="custom-modal-overlay">
                            <div className="custom-modal">
                                <div className="modal-header d-flex justify-content-between align-items-center">
                                    <h5 className="m-0">{this.state.isEdit ? <FormattedMessage id="admin.manage-specialty.edit" defaultMessage="Sửa chuyên khoa" /> : <FormattedMessage id="admin.manage-specialty.create" defaultMessage="Tạo chuyên khoa" />}</h5>
                                    <button className="btn btn-sm" onClick={() => this.toggleModal(false)}>×</button>
                                </div>
                                <div className="modal-body">
                                    <div className="row">
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
                                            <span><FormattedMessage id="admin.manage-specialty.description" /></span>
                                        </div>
                                        <div className="col-12">
                                            <MdEditor style={{ height: '300px' }} renderHTML={text => mdParser.render(text)} onChange={this.handleEditorChange} value={this.state.descriptionMarkdown} />
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button className="btn btn-secondary" onClick={() => this.toggleModal(false)}><FormattedMessage id="button.cancel" defaultMessage="Hủy" /></button>
                                    <button className="btn btn-primary" onClick={() => this.handleSaveNewSpecialty()}>{this.state.isEdit ? <FormattedMessage id="button.save" defaultMessage="Lưu thay đổi" /> : <FormattedMessage id="button.create" defaultMessage="Tạo" />}</button>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="col-12 mt-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <div style={{display:'flex', alignItems:'center', gap:12}}>
                                <h5 className="m-0"><FormattedMessage id="admin.manage-specialty.list" defaultMessage="Danh sách chuyên khoa" /></h5>
                                <div className="search-input-wrapper" style={{minWidth:360, marginLeft: 12}}>
                                    <input
                                        className="form-control"
                                        placeholder={this.props.intl.formatMessage({ id: 'admin.manage-specialty.search', defaultMessage: 'Tìm theo tên' })}
                                        value={this.state.searchQuery || ''}
                                        onChange={(e) => this.handleSearchChange(e.target.value)}
                                    />
                                    <i className="fas fa-search search-icon" aria-hidden="true"></i>
                                </div>
                            </div>
                            <div>
                                <button type="button" className="btn btn-primary" onClick={this.openCreateModal}>
                                    <i className="fas fa-plus" /> <span style={{ marginLeft: 8 }}><FormattedMessage id="admin.manage-specialty.add-new" defaultMessage="Thêm mới" /></span>
                                </button>
                            </div>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <SectionLoadingOverlay active={this.state.listLoading} text={this.props.language === LANGUAGE.VI ? 'Đang tải...' : 'Loading...'} />
                            <div className="table-wrapper">
                            <table className="user-table">
                                <thead>
                                    <tr>
                                        <th><FormattedMessage id="admin.manage-specialty.table.index"/></th>
                                        <th><FormattedMessage id="admin.manage-specialty.table.nameVi"/></th>
                                        <th><FormattedMessage id="admin.manage-specialty.table.nameEn"/></th>
                                        <th><FormattedMessage id="admin.manage-specialty.table.image"/></th>
                                        <th><FormattedMessage id="admin.manage-specialty.table.actions"/></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.specialties && this.state.specialties.map((item, idx) => (
                                        <tr key={item.id}>
                                            <td>{idx + 1}</td>
                                            <td>{item.nameVi}</td>
                                            <td>{item.nameEn}</td>
                                            <td style={{ width: 80 }}>
                                                {item.image && <img src={item.image} alt="thumb" style={{ maxWidth: 80, maxHeight: 60 }} />}
                                            </td>
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

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(ManageSpecialty));
