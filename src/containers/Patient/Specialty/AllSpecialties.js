import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { getAllSpecialty } from '../../../services/userService';
import HomeHeader from '../../HomePage/HomeHeader';
import { Link } from 'react-router-dom';
import { path } from '../../../utils';
import { connect } from 'react-redux';

import './DetailSpecialty.scss';

class AllSpecialties extends Component {
    constructor(props) {
        super(props);
        this.state = {
            specialties: []
        }
    }

    async componentDidMount() {
        let res = await getAllSpecialty();
        if (res && res.data) {
            this.setState({ specialties: res.data });
        }
    }

    handleViewDetail = (item) => {
        if (this.props.history) {
            this.props.history.push(`/detail-specialty/${item.id}`);
        }
    }

    render() {
        const { specialties } = this.state;
        const { language } = this.props;
        return (
            <div className="handbook-list-page">
                <HomeHeader />
                <div className="container mt-3">
                    <h2>{language === 'vi' ? 'Tất cả chuyên khoa' : 'All Specialties'}</h2>
                    <div className="row">
                        {specialties && specialties.length > 0 && specialties.map((item) => (
                            <div className="col-md-4" key={item.id}>
                                <div className="handbook-card">
                                    <div className="thumb" style={{ backgroundImage: `url(${item.image})` }}></div>
                                    <h4>{language === 'vi' ? item.nameVi : item.nameEn}</h4>
                                    <Link to={`${path.DETAIL_SPECIALTY.replace(':id', item.id)}`} className="btn btn-link">Xem chi tiết</Link>
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

export default withRouter(connect(mapStateToProps)(AllSpecialties));
