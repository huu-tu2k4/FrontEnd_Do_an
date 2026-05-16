import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import HomeHeader from '../../HomePage/HomeHeader';
import handbookService from '../../../services/handbookService';
import { path } from '../../../utils';

import './HandbookList.scss';

class HandbookList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            handbooks: []
        }
    }

    async componentDidMount() {
        try {
            const res = await handbookService.getAllCategories();
            if (res && res.errCode === 0) {
                this.setState({ handbooks: res.data });
            }
        } catch (e) {
            console.error('Fetch handbooks error', e);
        }
    }

    render() {
        const { handbooks } = this.state;
        const { language } = this.props;
        return (
            <div className="handbook-list-page">
                <HomeHeader />
                <div className="container mt-3">
                    <h2><FormattedMessage id="section.handbook" /></h2>
                    <div className="row">
                        {handbooks && handbooks.length > 0 && handbooks.map((item) => (
                            <div className="col-md-4" key={item.id}>
                                <div className="handbook-card">
                                    <div className="thumb" style={{ backgroundImage: `url(${item.image})` }}></div>
                                    <h4>{language === 'vi' ? item.nameVi : item.nameEn}</h4>
                                    <Link to={`${path.DETAIL_HANDBOOK.replace(':id', item.id)}`} className="btn btn-link">Xem chi tiết</Link>
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
const mapDispatchToProps = dispatch => ({ });

export default connect(mapStateToProps, mapDispatchToProps)(HandbookList);
