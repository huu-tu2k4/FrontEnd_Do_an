import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { getAllClinic } from '../../../services/userService';
import HomeHeader from '../../HomePage/HomeHeader';
import { Link } from 'react-router-dom';
import { path } from '../../../utils';
import { connect } from 'react-redux';

import '../Specialty/DetailSpecialty.scss';

class AllClinics extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clinics: []
        }
    }

    async componentDidMount() {
        let res = await getAllClinic();
        if (res && res.data) {
            this.setState({ clinics: res.data });
        }
    }

    handleViewDetail = (item) => {
        if (this.props.history) {
            this.props.history.push(`/detail-clinic/${item.id}`);
        }
    }

    render() {
        const { clinics } = this.state;
        return (
            <div className="handbook-list-page">
                <HomeHeader />
                <div className="container mt-3">
                    <h2>Tất cả cơ sở y tế</h2>
                    <div className="row">
                        {clinics && clinics.length > 0 && clinics.map((item) => (
                            <div className="col-md-4" key={item.id}>
                                <div className="handbook-card">
                                    <div className="thumb" style={{ backgroundImage: `url(${item.image})` }}></div>
                                    <h4>{item.name}</h4>
                                    <Link to={`${path.DETAIL_CLINIC.replace(':id', item.id)}`} className="btn btn-link">Xem chi tiết</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({ language: state.app.language });

export default withRouter(connect(mapStateToProps)(AllClinics));
