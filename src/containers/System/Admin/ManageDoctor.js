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

const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageDoctor extends Component {

    constructor(props){
        super(props);
        this.state = {
            //save to markdown table
            contentMarkdown: '',
            contentHTML: '',
            selectedDoctor: '',
            description: '',
            hasOldData: false,
            listDoctors: [],

            //save to doctor_infor table
            listPrice: [],
            listPayment: [],
            listProvince: [],
            listClinic: [],
            listSpecialty: [],
            listClinic: [],
            selectedPrice: '',
            selectedPayment: '',
            selectedProvince: '',
            selectedClinic: '',
            selectedSpecialty: '',
            nameClinic: '',
            addressClinic: '',
            note: '',
            clinicId: '',
            specialtyId: '',
            
        }
    }

    componentDidMount() {
        this.props.fetchAllDoctors();
        this.props.getRequiredDoctorInfor();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.listDoctors !== this.props.listDoctors) {
            let dataSelect = this.buildDataInputSelect(this.props.listDoctors, 'USERS');
            this.setState({
                listDoctors: dataSelect
            })
        }
        if(prevProps.language !== this.props.language) {
            let dataSelect = this.buildDataInputSelect(this.props.listDoctors, 'USERS');
            let { price, payment, province, specialty, clinic } = this.props.listDataRequiredDoctorInfor;
            let dataSelectPrice = this.buildDataInputSelect(price, 'PRICE');
            let dataSelectPayment = this.buildDataInputSelect(payment, 'PAYMENT');
            let dataSelectProvince = this.buildDataInputSelect(province, 'PROVINCE');
            let dataSelectedSpecialty = this.buildDataInputSelect(specialty, 'SPECIALTY');
            let dataSelectedClinic = this.buildDataInputSelect(clinic, 'CLINIC');
            this.setState({
                listDoctors: dataSelect,
                listPrice: dataSelectPrice,
                listPayment: dataSelectPayment,
                listProvince: dataSelectProvince,
                listSpecialty: dataSelectedSpecialty,
                listClinic: dataSelectedClinic
            })
        }
        if(prevProps.listDataRequiredDoctorInfor !== this.props.listDataRequiredDoctorInfor) {
            let { price, payment, province, specialty, clinic } = this.props.listDataRequiredDoctorInfor;
            let dataSelectPrice = this.buildDataInputSelect(price, 'PRICE');
            let dataSelectPayment = this.buildDataInputSelect(payment, 'PAYMENT');
            let dataSelectProvince = this.buildDataInputSelect(province, 'PROVINCE');
            let dataSelectedSpecialty = this.buildDataInputSelect(specialty, 'SPECIALTY');
            let dataSelectedClinic = this.buildDataInputSelect(clinic, 'CLINIC');
            this.setState({
                listPrice: dataSelectPrice,
                listPayment: dataSelectPayment,
                listProvince: dataSelectProvince,
                listSpecialty: dataSelectedSpecialty,
                listClinic: dataSelectedClinic
            })
        }
    }

    buildDataInputSelect = (inputData, type) => {
        let result = [];
        let language = this.props.language;
        if (inputData && inputData.length > 0) {
            if(type === 'USERS') {
                inputData.map((item, index) => {
                    let object = {};
                    let labelVi = `${item.lastName} ${item.firstName}`;
                    let labelEn = `${item.firstName} ${item.lastName}`;
                    object.label = language === LANGUAGE.VI ? labelVi : labelEn;
                    object.value = item.id;
                    result.push(object);
                })
            } else if(type === 'PRICE') {
                inputData.map((item, index) => {
                    let object = {};
                    let labelVi = item.valueVi + ' VND';
                    let labelEn = item.valueEn + ' USD';
                    object.label = language === LANGUAGE.VI ? labelVi : labelEn;
                    object.value = item.keyMap;
                    result.push(object);
                })
            }
            else if(type === 'SPECIALTY') {
                inputData.map((item, index) => {
                    let object = {};
                    let labelVi = item.nameVi;
                    let labelEn = item.nameEn;
                    object.label = language === LANGUAGE.VI ? labelVi : labelEn;
                    object.value = item.id;
                    result.push(object);
                })
            }
            else if(type === 'CLINIC') {
                inputData.map((item, index) => {
                    console.log('check item clinic: ', item);
                    let object = {};
                    let label = item.name;
                    object.label = label;
                    object.value = item.id;
                    object.name = item.name;
                    object.address = item.address;
                    result.push(object);
                })
            }
            else {
                inputData.map((item, index) => {
                    let object = {};
                    let labelVi = item.valueVi;
                    let labelEn = item.valueEn;
                    object.label = language === LANGUAGE.VI ? labelVi : labelEn;
                    object.value = item.keyMap;
                    result.push(object);
                })
            }
        }
        return result;
    }

    handleEditorChange = ({ html, text }) => {
        this.setState({
            contentMarkdown: text,
            contentHTML: html
        })
    }

    handleOnChangeText = (event, id) => {
        let stateCopy = { ...this.state };
        stateCopy[id] = event.target.value;
        this.setState({
            ...stateCopy
        })
    }

    handleSaveContentMarkdown = async () => {
        let { hasOldData } = this.state;
        let res = await this.props.saveDetailDoctor({
            contentHTML: this.state.contentHTML,
            contentMarkdown: this.state.contentMarkdown,
            description: this.state.description,
            doctorId: this.state.selectedDoctor.value,
            action: hasOldData === true ? CRUD_ACTIONS.EDIT : CRUD_ACTIONS.CREATE,

            selectedPrice: this.state.selectedPrice ? this.state.selectedPrice.value : '',
            selectedPayment: this.state.selectedPayment ? this.state.selectedPayment.value : '',
            selectedProvince: this.state.selectedProvince ? this.state.selectedProvince.value : '',
            nameClinic: this.state.nameClinic,
            addressClinic: this.state.addressClinic,
            note: this.state.note,
            clinicId: this.state.selectedClinic && this.state.selectedClinic.value ? this.state.selectedClinic.value : '',
            specialtyId: this.state.selectedSpecialty && this.state.selectedSpecialty.value ? this.state.selectedSpecialty.value : ''
        })
        if(res && res.errCode === 0) {
            // this.setState({
            //     contentHTML: '',
            //     contentMarkdown: '',
            //     description: '',
            //     selectedDoctor: '',
            //     hasOldData: false,
            //     selectedPrice: '',
            //     selectedPayment: '',
            //     selectedProvince: '',
            //     nameClinic: '',
            //     addressClinic: '',
            //     note: '',
            //     selectedClinic: '',
            //     selectedSpecialty: ''
            // })
        }
    }

    handleChangeSelectedDoctor = async (selectedDoctor) => {
        this.setState({ selectedDoctor: selectedDoctor });

        let res = await getDetailInforDoctor(selectedDoctor.value);
        console.log('check res: ', res);
        if(res && res.errCode === 0 && res.data && res.data.markdownData && res.data.markdownData.contentMarkdown) {
            let markdown = res.data.markdownData;
            let addressClinic = '', nameClinic = '', note = '', paymentId = '', priceId = '', provinceId = '', selectedPayment = '', selectedPrice = '', selectedProvince = '', selectedClinic = '', selectedSpecialty = '', clinicId = '', specialtyId = '';
            if(res.data.doctorInforData) {
                const docInfo = res.data.doctorInforData;
                addressClinic = docInfo.addressClinic ?? '';
                nameClinic = docInfo.nameClinic ?? '';
                note = docInfo.note ?? '';
                paymentId = docInfo.paymentId ?? '';
                priceId = docInfo.priceId ?? '';
                provinceId = docInfo.provinceId ?? '';
                clinicId = docInfo.clinicId ?? '';
                specialtyId = docInfo.specialtyId ?? '';
                selectedClinic = this.state.listClinic.find(item => item && item.value === clinicId) || '';
                selectedSpecialty = this.state.listSpecialty.find(item => item && item.value === specialtyId) || '';
                selectedPayment = this.state.listPayment.find(item => item && item.value === paymentId) || '';
                selectedPrice = this.state.listPrice.find(item => item && item.value === priceId) || '';
                selectedProvince = this.state.listProvince.find(item => item && item.value === provinceId) || '';
            }
            this.setState({
                contentMarkdown: markdown.contentMarkdown,
                contentHTML: markdown.contentHTML,
                description: markdown.description,
                hasOldData: true,
                addressClinic: addressClinic,
                nameClinic: nameClinic,
                note: note,
                selectedPayment: selectedPayment,
                selectedPrice: selectedPrice,
                selectedProvince: selectedProvince,
                selectedClinic: selectedClinic,
                selectedSpecialty: selectedSpecialty
            })
        }
        else {
            this.setState({
                contentMarkdown: '',
                contentHTML: '',
                description: '',
                hasOldData: false,
                addressClinic: '',
                nameClinic: '',
                note: '',
                selectedPayment: '',
                selectedPrice: '',
                selectedProvince: '',
                selectedClinic: '',
                selectedSpecialty: ''
            })
        }
    }
    

    render() {
        let { hasOldData } = this.state;
        let {listPayment, listPrice, listProvince} = this.state;
        return (
            <div className="manage-doctor-container">
                <div className="manage-doctor-title">{hasOldData === true ? <FormattedMessage id="admin.manage-doctor.edit_title" /> : <FormattedMessage id="admin.manage-doctor.create_title" />}</div>
                <div className="more-infor">
                    <div className="content-left form-group">
                        <label><FormattedMessage id="admin.manage-doctor.doctor" />(*)</label>
                        <Select
                            value={this.state.selectedDoctor}
                            onChange={this.handleChangeSelectedDoctor}
                            options={this.state.listDoctors}
                            placeholder={<FormattedMessage id="admin.manage-doctor.select-doctor" />}
                        />
                    </div>
                    <div className="content-right form-group">
                        <label><FormattedMessage id="admin.manage-doctor.description" /></label>
                        <textarea
                            className="form-control"
                            onChange={(event) => this.handleOnChangeText(event, 'description')}
                            value={this.state.description}
                        />
                    </div>
                </div>
                <div className="row doctor-infor-extra">
                    <div className="col-4 form-group">
                        <label><FormattedMessage id="admin.manage-doctor.price" />(*)</label>
                        <Select
                            value={this.state.selectedPrice}
                            onChange={(selectedOption) => this.setState({ selectedPrice: selectedOption })}
                            options={this.state.listPrice}
                            placeholder={<FormattedMessage id="admin.manage-doctor.select-price" />}
                        />
                    </div>
                    <div className="col-4 form-group">
                        <label><FormattedMessage id="admin.manage-doctor.payment" />(*)</label>
                        <Select
                            value={this.state.selectedPayment}
                            onChange={(selectedOption) => this.setState({ selectedPayment: selectedOption })}
                            options={this.state.listPayment}
                            placeholder={<FormattedMessage id="admin.manage-doctor.select-payment" />}
                        />
                    </div>
                    <div className="col-4 form-group">
                        <label><FormattedMessage id="admin.manage-doctor.note" /></label>
                        <input 
                            type="text" 
                            className="form-control" 
                            value={this.state.note}
                            onChange={(event) => this.handleOnChangeText(event, 'note')}
                        />
                    </div>
                    <div className="col-4 form-group">
                        <label><FormattedMessage id="admin.manage-doctor.specialty" /></label>
                        <Select
                            value={this.state.selectedSpecialty}
                            onChange={(selectedOption) => this.setState({ selectedSpecialty: selectedOption })}
                            options={this.state.listSpecialty}
                            placeholder={<FormattedMessage id="admin.manage-doctor.select-specialty" />}
                        />
                    </div>
                    <div className="col-4 form-group">
                        <label><FormattedMessage id="admin.manage-doctor.clinic" /></label>
                        <Select
                            value={this.state.selectedClinic}
                            onChange={(selectedOption) => this.setState({ 
                                selectedClinic: selectedOption,
                                nameClinic: selectedOption && selectedOption.name ? selectedOption.name : '',
                                addressClinic: selectedOption && selectedOption.address ? selectedOption.address : ''
                            })}
                            options={this.state.listClinic}
                            placeholder={<FormattedMessage id="admin.manage-doctor.select-clinic" />}
                        />
                    </div>
                    <div className="col-4 form-group">
                        <label><FormattedMessage id="admin.manage-doctor.province" />(*)</label>
                        <Select
                            value={this.state.selectedProvince}
                            onChange={(selectedOption) => this.setState({ selectedProvince: selectedOption })}
                            options={this.state.listProvince}
                            placeholder={<FormattedMessage id="admin.manage-doctor.select-province" />}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-6 form-group">
                        <label><FormattedMessage id="admin.manage-doctor.clinic_address" />(*)</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            value={this.state.addressClinic}
                            disabled={this.state.selectedClinic && this.state.selectedClinic.value ? true : false}
                            onChange={(event) => this.handleOnChangeText(event, 'addressClinic')}
                        />
                    </div>
                </div>
                <div className="manage-doctor-editor" style={{ marginTop: '16px' }}>
                    <label><FormattedMessage id="admin.manage-doctor.content" />(*)</label>
                    <MdEditor
                        renderHTML={text => mdParser.render(text)}
                        onChange={this.handleEditorChange}
                        style={{ height: '300px' }}
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
        listDoctors: state.admin.allDoctors,
        listDataRequiredDoctorInfor: state.admin.allDataRequiredDoctorInfor
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
        getRequiredDoctorInfor: () => dispatch(actions.getRequiredDoctorInfor()),
        // getDoctorPayment: () => dispatch(actions.getDoctorPayment()),
        // getDoctorProvince: () => dispatch(actions.getDoctorProvince()),
        saveDetailDoctor: (data) => dispatch(actions.saveDetailDoctor(data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
