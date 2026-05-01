import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import './ManageDoctor.scss';
import Select from 'react-select';
import {CRUD_ACTIONS, LANGUAGE} from '../../../utils';
import { getDetailInforDoctor } from '../../../services/userService';
import e from 'cors';
import { has } from 'lodash';

const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageDoctor extends Component {

    constructor(props){
        super(props);
        this.state = {
            contentMarkdown: '',
            contentHTML: '',
            selectedDoctor: '',
            descripton: '',
            hasOldData: false
        }
    }

    componentDidMount() {
        this.props.fetchAllDoctors();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.listDoctors !== this.props.listDoctors) {
            let dataSelect = this.buildDataInputSelect(this.props.listDoctors);
            this.setState({
                listDoctors: dataSelect
            })
        }
        if(prevProps.language !== this.props.language) {
            let dataSelect = this.buildDataInputSelect(this.props.listDoctors);
            this.setState({
                listDoctors: dataSelect
            })
        }
    }

    buildDataInputSelect = (inputData) => {
        let result = [];
        let language = this.props.language;
        if (inputData && inputData.length > 0) {
            inputData.map((item, index) => {
                let object = {};
                let labelEn = `${item.firstName} ${item.lastName}`;
                let labelVi = `${item.lastName} ${item.firstName}`;
                object.label = language === LANGUAGE.VI ? labelVi : labelEn;
                object.value = item.id;
                result.push(object);
            })
        }
        return result;
    }

    handleEditorChange = ({ html, text }) => {
        this.setState({
            contentMarkdown: text,
            contentHTML: html
        })
    }

    handleOnChangeDes = (event) => {
        this.setState({
            descripton: event.target.value
        })
    }

    handleSaveContentMarkdown = () => {
        let { hasOldData } = this.state;
        this.props.saveDetailDoctor({
            contentHTML: this.state.contentHTML,
            contentMarkdown: this.state.contentMarkdown,
            description: this.state.descripton,
            doctorId: this.state.selectedDoctor.value,
            action: hasOldData === true ? CRUD_ACTIONS.EDIT : CRUD_ACTIONS.CREATE
        })
        this.setState({
            contentHTML: '',
            contentMarkdown: '',
            descripton: '',
            selectedDoctor: '',
            hasOldData: false
        })
    }

    handleChange = async (selectedDoctor) => {
        this.setState({ selectedDoctor });

        let res = await getDetailInforDoctor(selectedDoctor.value);
        console.log('check res: ', res);
        if(res && res.errCode === 0 && res.data && res.data.markdownData && res.data.markdownData.contentMarkdown) {
            let markdown = res.data.markdownData;
            console.log('check markdown: ', markdown);
            this.setState({
                contentMarkdown: markdown.contentMarkdown,
                contentHTML: markdown.contentHTML,
                descripton: markdown.description,
                hasOldData: true
            })
        }
        else {
            this.setState({
                contentMarkdown: '',
                contentHTML: '',
                descripton: '',
                hasOldData: false
            })
        }
    }
    render() {
        console.log('check state selected doctor: ', this.state);
        let { hasOldData } = this.state;
        return (
            <div className="manage-doctor-container">
                <div className="manage-doctor-title">Manage Doctor</div>
                <div className="more-infor">
                    <div className="content-left form-group">
                        <label><FormattedMessage id="admin.manage-doctor.select-doctor" /></label>
                        <Select
                            value={this.state.selectedDoctor}
                            onChange={this.handleChange}
                            options={this.state.listDoctors}
                        />
                    </div>
                    <div className="content-right form-group">
                        <label><FormattedMessage id="admin.manage-doctor.description" /></label>
                        <textarea
                            className="form-control"
                            rows="4"
                            onChange={this.handleOnChangeDes}
                            value={this.state.descripton}
                        />
                    </div>
                </div>
                <div className="manage-doctor-editor" style={{ marginTop: '16px' }}>
                    <MdEditor
                        renderHTML={text => mdParser.render(text)}
                        onChange={this.handleEditorChange}
                        style={{ height: '500px' }}
                        value={this.state.contentMarkdown}
                    />   
                </div>
                <div>
                    <button 
                    className={hasOldData === true ? "save-content-doctor" : "create-content-doctor"}
                    onClick={() => this.handleSaveContentMarkdown()}
                    >{hasOldData === true ? <FormattedMessage id="admin.manage-doctor.save" /> : <FormattedMessage id="admin.manage-doctor.create" />}</button>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        listDoctors: state.admin.allDoctors
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
        saveDetailDoctor: (data) => dispatch(actions.saveDetailDoctor(data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
