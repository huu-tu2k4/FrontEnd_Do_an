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
                <table id="customers">
                    <tbody>
                        <tr>
                            <th><FormattedMessage id="user.email"/></th>
                            <th><FormattedMessage id="user.firstName"/></th>
                            <th><FormattedMessage id="user.lastName"/></th>
                            <th><FormattedMessage id="user.role"/></th>
                            <th><FormattedMessage id="user.address" /></th>
                            <th><FormattedMessage id="user.action"/></th>
                        </tr>
                        {(this.props.listUsers || []).map((item, index) => {
                            return (
                                <tr key={index}>
                                    <td>{item.email}</td>
                                    <td>{item.firstName}</td>
                                    <td>{item.lastName}</td>
                                    <td>{language === LANGUAGE.VI ? item.roleData.valueVi : item.roleData.valueEn}</td>
                                    <td>{item.address}</td>
                                    <td>
                                        <FormattedMessage id="user.edit">
                                            {(editTxt) => (
                                                <button type="button" className="btn-edit" onClick={() => this.handleUpdateUser(item)} aria-label={editTxt} title={editTxt}>
                                                    <i className="fas fa-pencil-alt"></i>
                                                </button>
                                            )}
                                        </FormattedMessage>
                                        <FormattedMessage id="user.delete">
                                            {(delTxt) => (
                                                <button type="button" className="btn-delete" onClick={() => this.handleDeleteUser(item.id)} aria-label={delTxt} title={delTxt}>
                                                    <i className="fas fa-trash-alt"></i>
                                                </button>
                                            )}
                                        </FormattedMessage>
                                    </td>
                                </tr>
                            )
                        })} 
                    </tbody>
                </table>  
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
