import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { LANGUAGE } from '../../../utils';

import './TableManageUser.scss';

const mdParser = new MarkdownIt(/* Markdown-it options */);
function handleEditorChange({ html, text }) {
}



class TableManageUser extends Component {

    constructor(props){
        super(props);
        this.state = {
            listUsers: [],
            currentPage: 1,
            itemsPerPage: 10,
            itemsPerPageOptions: [5, 10, 20]
        }
    }

    componentDidMount() {
        const { currentPage, itemsPerPage } = this.state;
        this.props.fetchAllUsers(currentPage, itemsPerPage, this.props.filterQuery || '');
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.listUsers !== this.props.listUsers) {
            this.setState({ listUsers: this.props.listUsers });
        }
        // if filter query changed, reload first page
        if (prevProps.filterQuery !== this.props.filterQuery) {
            this.setState({ currentPage: 1 }, () => {
                const { itemsPerPage } = this.state;
                this.props.fetchAllUsers(1, itemsPerPage, this.props.filterQuery || '');
            });
        }
        // if pagination changed externally, sync
        if (prevProps.totalUsers !== this.props.totalUsers && this.state.currentPage > Math.ceil((this.props.totalUsers || 0) / this.state.itemsPerPage)) {
            this.setState({ currentPage: 1 });
        }
    }

    handleChangePage = (page) => {
        const { itemsPerPage } = this.state;
        this.setState({ currentPage: page }, () => {
            this.props.fetchAllUsers(page, itemsPerPage, this.props.filterQuery || '');
        });
    }

    handlePrev = () => {
        this.setState((state) => ({ currentPage: Math.max(1, state.currentPage - 1) }), () => {
            const { currentPage, itemsPerPage } = this.state;
            this.props.fetchAllUsers(currentPage, itemsPerPage, this.props.filterQuery || '');
        });
    }

    handleNext = () => {
        const { currentPage, itemsPerPage } = this.state;
        const total = Math.max(1, Math.ceil((this.props.totalUsers || 0) / itemsPerPage));
        const nextPage = Math.min(total, currentPage + 1);
        this.setState({ currentPage: nextPage }, () => {
            this.props.fetchAllUsers(this.state.currentPage, itemsPerPage, this.props.filterQuery || '');
        });
    }

    handleChangeItemsPerPage = (e) => {
        const itemsPerPage = parseInt(e.target.value, 10) || 10;
        this.setState({ itemsPerPage, currentPage: 1 }, () => {
            this.props.fetchAllUsers(1, itemsPerPage, this.props.filterQuery || '');
        });
    }

    handleUpdateUser = (user) => {
        this.props.handleEditUserFromParent(user);
    }

    handleDeleteUser = (userId) => {
        this.props.deleteUser(userId);
    }
    
    render() {
        let language = this.props.language;
        const { currentPage, itemsPerPage, itemsPerPageOptions } = this.state;
        const usersToShow = this.props.listUsers || [];
        const totalItems = this.props.totalUsers || 0;
        const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
        return (
            <React.Fragment>
                <div className="table-wrapper">
                    <table className="user-table">
                        <thead>
                            <tr>
                                <th><FormattedMessage id="user.email" defaultMessage="Email"/></th>
                                <th><FormattedMessage id="user.lastName" defaultMessage="Họ"/></th>
                                <th><FormattedMessage id="user.firstName" defaultMessage="Tên"/></th>
                                <th><FormattedMessage id="user.role" defaultMessage="Vai trò"/></th>
                                <th><FormattedMessage id="user.position" defaultMessage="Chức vụ"/></th>
                                <th><FormattedMessage id="user.phoneNumber" defaultMessage="Số điện thoại"/></th>
                                <th><FormattedMessage id="user.address" defaultMessage="Địa chỉ"/></th>
                                <th><FormattedMessage id="user.action" defaultMessage="Hành động"/></th>
                            </tr>
                        </thead>
                        <tbody>
                            { usersToShow.map((item) => {
                                const roleKey = (item.roleId || (item.roleData && item.roleData.keyMap) || '').toString();
                                const roleLabel = language === LANGUAGE.VI ? (item.roleData && item.roleData.valueVi) : (item.roleData && item.roleData.valueEn);
                                const roleBadgeMap = {
                                    R1: 'badge--admin',
                                    R2: 'badge--doctor',
                                    R3: 'badge--patient'
                                };
                                const onEdit = this.props.onEdit || this.handleUpdateUser;
                                const onDelete = this.props.onDelete || this.handleDeleteUser;
                                return (
                                    <tr key={item.id}>
                                        <td>{item.email}</td>
                                        <td>{item.lastName}</td>
                                        <td>{item.firstName}</td>
                                        <td>
                                            <span className={`badge ${roleBadgeMap[roleKey] || ''}`}>
                                                {roleLabel}
                                            </span>
                                        </td>
                                        <td className="td-muted">{language === LANGUAGE.VI ? (item.positionData && item.positionData.valueVi) : (item.positionData && item.positionData.valueEn)}</td>
                                        <td>{item.phoneNumber}</td>
                                        <td className="td-muted">{item.address}</td>
                                        <td>
                                            <button type="button" className="btn-edit" title="Chỉnh sửa" aria-label="Chỉnh sửa" onClick={() => onEdit(item)}>
                                                <i className="fas fa-pencil-alt" />
                                            </button>
                                            <button type="button" className="btn-delete" title="Xóa" aria-label="Xóa" onClick={() => onDelete(item.id)}>
                                                <i className="fas fa-trash-alt" />
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    <div className="pagination-wrapper">
                                <div className="pagination-meta">
                            <label>
                                <span>Hiển thị </span>
                                <select value={itemsPerPage} onChange={this.handleChangeItemsPerPage}>
                                    {itemsPerPageOptions.map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                                <span> / tổng {totalItems} mục</span>
                            </label>
                        </div>
                        <div className="pagination-controls">
                            <button type="button" onClick={this.handlePrev} disabled={currentPage <= 1} aria-label="Previous page">←</button>
                            {[...Array(totalPages)].map((_, i) => {
                                const page = i + 1;
                                return (
                                    <button key={page} type="button" className={page === currentPage ? 'active' : ''} onClick={() => this.handleChangePage(page)}>{page}</button>
                                )
                            })}
                            <button type="button" onClick={this.handleNext} disabled={currentPage >= totalPages} aria-label="Next page">→</button>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }

}

const mapStateToProps = state => {
    return {
        listUsers: state.admin.users,
        totalUsers: state.admin.totalUsers,
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllUsers: (page, limit, q) => dispatch(actions.fetchAllUsers(page, limit, q)),
        deleteUser: (userId) => dispatch(actions.deleteUser(userId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableManageUser);
