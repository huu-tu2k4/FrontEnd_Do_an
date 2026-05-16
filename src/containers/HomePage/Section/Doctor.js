import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Slider from 'react-slick';
import * as actions from '../../../store/actions';
import { LANGUAGE } from '../../../utils';
import { withRouter } from 'react-router';
// import { path } from '../utils'

class Doctor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrDoctors: []
        }
    }
    componentDidMount() {
        this.props.loadTopDoctor();
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.topDoctors !== this.props.topDoctors) {
            this.setState({
                arrDoctors: this.props.topDoctors
            })
        }
    }

    handleViewDetailDoctor = (doctor) => {
        // console.log('doctor', doctor);
        this.props.history.push(`/detail-doctor/${doctor.id}`);
    }

    render() {
        let language = this.props.language;
        let arrDoctors = this.state.arrDoctors;
        // const safeArr = Array.isArray(arrDoctors) ? arrDoctors : [];
        // const displayDoctors = safeArr.concat(safeArr, safeArr);
        return (
            <div className="section-share section-doctor">
                <div className="section-container">
                    <div className="section-header">
                        <span className="title-section"><FormattedMessage id="section.outstanding-doctor" /></span>
                        <button className="btn-section" onClick={() => this.props.history.push('/doctors')}><FormattedMessage id="section.see-more" /></button>
                    </div>
                    <div className="section-body">
                        <Slider {...this.props.settings}>
                            {arrDoctors && arrDoctors.length > 0 && arrDoctors.map((item, index) => {
                                if (!item) return null;
                                const firstName = item.firstName || '';
                                const lastName = item.lastName || '';
                                const positionData = item.positionData || {};
                                const nameVi = `${positionData.valueVi || ''}${positionData.valueVi ? ', ' : ''}${lastName} ${firstName}`.trim();
                                const nameEn = `${positionData.valueEn || ''}${positionData.valueEn ? ', ' : ''}${firstName} ${lastName}`.trim();
                                const displayName = (language === LANGUAGE.VI) ? nameVi : nameEn;
                                const position = (language === LANGUAGE.VI) ? (positionData.valueVi || positionData.value || '') : (positionData.valueEn || positionData.value || '');
                                let imageBase64 = '';
                                if(item.image) {
                                    imageBase64 = new Buffer(item.image, 'base64').toString('binary');
                                }
                                return (
                                    <div className="section-customize" key={index} onClick={() => this.handleViewDetailDoctor(item)}>
                                        <div className="customize-border">
                                            <div className="outer-bg">
                                                <div className="bg-image section-doctor" style={{ backgroundImage: `url(${imageBase64})` }}> </div>
                                            </div>
                                            <div className="positon text-center">
                                                <div>{displayName}</div>
                                                <span>{position}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </Slider>
                    </div>
                    
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        topDoctors: state.admin.topDoctors,
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        loadTopDoctor: () => dispatch(actions.fetchTopDoctor())
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Doctor));
