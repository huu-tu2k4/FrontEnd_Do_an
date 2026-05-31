import React, { Component } from 'react';
import { connect } from "react-redux";
import HomeHeader from '../../HomePage/HomeHeader';
import * as actions from '../../../store/actions';
import DoctorSchedule from './DoctorSchedule';
import DoctorExtraInfor from './DoctorExtraInfor';

import './DetailDoctor.scss';

class DetailDoctor extends Component {

    constructor(props) {
        super(props);
        const idFromRoute = props.match && props.match.params && props.match.params.id ? props.match.params.id : -1;
        this.state = {
            detailDoctor: {},
            nameDoctor: '',
            currentId: idFromRoute,
            selectedDate: null
        }
    }

    componentDidMount() {
        const id = this.state.currentId;
        if (id && id !== -1) {
            this.props.fetchDetailDoctor(id);
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.detailDoctor !== prevProps.detailDoctor) {
            let nameDoctor = this.buildNameDoctor(this.props.detailDoctor);
            this.setState({
                detailDoctor: this.props.detailDoctor,
                nameDoctor: nameDoctor
            })
        }
        if(this.props.language !== prevProps.language) {
            let nameDoctor = this.buildNameDoctor(this.props.detailDoctor);
            this.setState({
                nameDoctor: nameDoctor
            })
        }
    }

    buildNameDoctor = (inputData) => {
        let fullName = '';
        let language = this.props.language;
        if (inputData) {
            let labelEn = `${inputData.firstName} ${inputData.lastName}`;
            let labelVi = `${inputData.lastName} ${inputData.firstName}`;
            fullName = language === 'vi' ? labelVi : labelEn;
        }
        return fullName;
    }

    onChangeDate = (date) => {
        this.setState({ selectedDate: date });
    }


    render() {
        let detailDoctor = this.state.detailDoctor;
        // console.log('check state:', this.state);
        let { language } = this.props;
        return (
            <>
                <HomeHeader isShowBanner={false} />
                <div className="doctor-detail-container">
                    <div className="intro-doctor">
                        <div className="content-left"
                            style={detailDoctor && detailDoctor.image ? { backgroundImage: `url(${detailDoctor.image})` } : {}}
                        >

                        </div>
                        <div className="content-right">
                            <div className="up">
                                <div className="name-doctor">
                                    {detailDoctor && detailDoctor.positionData ? (language === 'vi' ? detailDoctor.positionData.valueVi : detailDoctor.positionData.valueEn) + ', ' : ''}{this.state.nameDoctor}
                                </div>
                            </div>
                            <div className="down">
                                {detailDoctor.markdownData && detailDoctor.markdownData.description &&
                                    <span>{detailDoctor.markdownData.description}</span>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="schedule-doctor">
                        <div className="content-left">
                            <DoctorSchedule doctorIdFromParent={this.state.currentId} onChangeDate={this.onChangeDate} />
                        </div>
                        <div className="content-right">
                            <DoctorExtraInfor doctorIdFromParent={this.state.currentId} />
                        </div>
                    </div>
                    <div className="detail-infor-doctor">
                        {detailDoctor.markdownData && detailDoctor.markdownData.contentHTML &&
                            <div dangerouslySetInnerHTML={{ __html: detailDoctor.markdownData.contentHTML }}>
                            </div>
                        }
                    </div>
                </div>
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        detailDoctor: state.user.detailDoctor,
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchDetailDoctor: (id) => dispatch(actions.fetchDetailDoctor(id))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailDoctor);
