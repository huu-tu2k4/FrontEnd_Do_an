import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router';

import HomeHeader from '../../HomePage/HomeHeader';
import { getAllhandbooks } from '../../../services/userService';

import './AllHandbook.scss';

class AllHandbook extends Component {

    constructor(props) {
        super(props);
        this.state = {
            handbooks: []
        }
    }

    componentDidMount() {
        this.handleGetAllHandbooks();
    }

    handleGetAllHandbooks = async () => {
        try {
            const res = await getAllhandbooks();
            if (res && res.errCode === 0) {
                this.setState({
                    handbooks: res.data ? res.data : []
                });
            }
        } catch (e) {
            console.error('Fetch handbooks error', e);
        }
    }

    handleViewDetailHandbook = (item) => {
        if (this.props.history) {
            this.props.history.push(`/detail-handbook/${item.id}`);
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
                        {handbooks && handbooks.length > 0 ? (
                            handbooks.map((item) => (
                                <div className="col-md-4" key={item.id}>
                                    <div 
                                        className="handbook-card"
                                        onClick={() => this.handleViewDetailHandbook(item)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div 
                                            className="thumb" 
                                            style={{ backgroundImage: `url(${item.image})` }}
                                        ></div>
                                        <h4>
                                            {language === 'vi' ? item.nameVi : item.nameEn}
                                        </h4>
                                        <span className="btn btn-link">Xem chi tiết</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-12 text-center">
                                <p>Không có cẩm nang nào.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    language: state.app.language
});

const mapDispatchToProps = dispatch => ({});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AllHandbook));