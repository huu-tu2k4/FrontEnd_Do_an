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
            listUsers: []
        }
    }

    componentDidMount() {
        this.props.fetchAllUsers();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.listUsers !== this.props.listUsers) {
            this.setState({
                listUsers: this.props.listUsers
            })
        }
    }

    handleUpdateUser = (user) => {
        this.props.handleEditUserFromParent(user);
    }

    handleDeleteUser = (userId) => {
        this.props.deleteUser(userId);
    }
    
    render() {
        let language = this.props.language;
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
                            { (this.props.listUsers || []).map((item) => {
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
                </div>
            </React.Fragment>
        );
    }

}

const mapStateToProps = state => {
    return {
        listUsers: state.admin.users,
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllUsers: () => dispatch(actions.fetchAllUsers()),
        deleteUser: (userId) => dispatch(actions.deleteUser(userId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableManageUser);
