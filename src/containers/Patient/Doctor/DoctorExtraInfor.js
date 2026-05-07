import React, { Component } from 'react';
import { connect } from "react-redux";
import {getDoctorExtraInforById} from '../../../services/userService';
import NumberFormat from 'react-number-format';
import './DoctorExtraInfor.scss';
import { LANGUAGE } from '../../../utils';
import { FormattedMessage } from 'react-intl';

class DoctorExtraInfor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isShowDetailInfor: false,
            extraInfor: {}
        }
    }

    componentDidMount() {
        
        
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.doctorIdFromParent !== prevProps.doctorIdFromParent) {
            let doctorId = this.props.doctorIdFromParent;
            let res = await getDoctorExtraInforById(doctorId);
            if(res && res.errCode === 0) {
                this.setState({
                    extraInfor: res.data
                })
            }
        }
    }

    showHideDetailInfor = (status) => {
        this.setState({
            isShowDetailInfor: status
        })
    }
    render() {
        let { isShowDetailInfor, extraInfor } = this.state;
        let { language } = this.props;
        return (
            <div className='doctor-extra-infor-container'>
                <div className="content-up">
                    <div className="text-address">
                        <FormattedMessage id="patient.detail-doctor.address-clinic" />
                    </div>
                    <div className="name-clinic">
                        {extraInfor && extraInfor.nameClinic ? extraInfor.nameClinic : ''}
                    </div>
                    <div className="address-clinic">
                        {extraInfor && extraInfor.addressClinic ? extraInfor.addressClinic : ''}
                    </div>
                </div>
                <div className="content-down">
                    {isShowDetailInfor === false ? (
                        <div className="short-infor">
                            <span className="left"><FormattedMessage id="patient.detail-doctor.price" /></span>: 
                            {extraInfor && extraInfor.priceData ? (
                                language === LANGUAGE.VI ? (
                                    <NumberFormat
                                        className="currency"
                                        value={extraInfor.priceData.valueVi}
                                        displayType={'text'}
                                        thousandSeparator={true}
                                        suffix={' VND'}
                                    />
                                ) : (
                                    <NumberFormat
                                        className="currency"
                                        value={extraInfor.priceData.valueEn}
                                        displayType={'text'}
                                        thousandSeparator={true}
                                        suffix={'$'}
                                    />
                                )
                            ) : ('')}
                            <span className="detail" onClick={() => this.showHideDetailInfor(true)}><FormattedMessage id="patient.detail-doctor.show-price" /></span>
                        </div>
                    ) : (
                        <div>
                            {/* <div className="title-price">Giá</div> */}
                            <div className="detail-infor">
                                <div className="price-item">
                                    <span className="left"><FormattedMessage id="patient.detail-doctor.price" /></span>
                                    <span className="right">
                                        {extraInfor && extraInfor.priceData ? (
                                            language === LANGUAGE.VI ? (
                                                <NumberFormat
                                                    className="currency"
                                                    value={extraInfor.priceData.valueVi}
                                                    displayType={'text'}
                                                    thousandSeparator={true}
                                                    suffix={' VND'}
                                                />
                                            ) : (
                                                <NumberFormat
                                                    className="currency"
                                                    value={extraInfor.priceData.valueEn}
                                                    displayType={'text'}
                                                    thousandSeparator={true}
                                                    suffix={'$'}
                                                />
                                            )
                                        ) : ('')}
                                    </span>
                                </div>
                                <div className="note">
                                    <p>
                                        {extraInfor && extraInfor.note ? extraInfor.note : ''}
                                    </p>
                                </div>
                            </div>
                            <div className="payment">
                                <span className="left"><FormattedMessage id="patient.detail-doctor.payment" /></span>
                                <span className="right">
                                    {extraInfor && extraInfor.paymentData ? (
                                        language === LANGUAGE.VI ? (
                                            extraInfor.paymentData.valueVi && extraInfor.paymentData.valueVi.toLowerCase() === 'tất cả' ? 'Thẻ ATM và Tiền mặt' : extraInfor.paymentData.valueVi
                                        ) : (
                                            extraInfor.paymentData.valueEn && extraInfor.paymentData.valueEn.toLowerCase() === 'all payment method' ? 'ATM Card and Cash' : extraInfor.paymentData.valueEn
                                        )
                                    ) : ('')}
                                </span>
                            </div>
                            <div className="hide-price">
                                <span className="detail" onClick={() => this.showHideDetailInfor(false)}><FormattedMessage id="patient.detail-doctor.hide-price" /></span>
                            </div>
                        </div>
                    )}
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

export default connect(mapStateToProps, mapDispatchToProps)(DoctorExtraInfor);
