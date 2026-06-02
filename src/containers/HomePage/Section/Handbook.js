import React, { Component } from 'react';
import { connect } from 'react-redux';

import { FormattedMessage } from 'react-intl';
import Slider from 'react-slick';
import { fetchAllHandbooks } from '../../../store/actions/adminActions';
import SectionLoadingOverlay from '../../../components/SectionLoadingOverlay/SectionLoadingOverlay';
import { withRouter } from 'react-router';


class Handbook extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        this.props.fetchAllHandbooks();
    }
    

    handleViewDetailHandbook = (item) => {
        if (this.props.history) {
            this.props.history.push(`/detail-handbook/${item.id}`);
        }
    }

    render() {
        let { handbooks } = this.props;
        let { language } = this.props;

        return (
            <div className="section-share section-handbook">
                <div className="section-container">
                    <div className="section-header">
                        <span className="title-section"><FormattedMessage id="section.handbook" /></span>
                        <button 
                            className="btn-section" 
                            onClick={() => this.props.history.push('/handbooks')}
                        >
                            <FormattedMessage id="section.see-more" />
                        </button>
                    </div>
                    <div className="section-body" style={{ position: 'relative' }}>
                        <SectionLoadingOverlay active={this.props.isLoadingHandbooks} text={this.props.language === 'vi' ? 'Đang tải...' : 'Loading...'} />
                        <Slider {...this.props.settings}>
                            {handbooks && handbooks.length > 0 &&
                                handbooks.map((item, index) => {
                                    return (
                                        <div 
                                            className="section-customize handbook-item" 
                                            key={index}
                                            onClick={() => this.handleViewDetailHandbook(item)}
                                        >
                                            <div 
                                                className="bg-image section-handbook"
                                                style={{ backgroundImage: `url(${item.image})` }}
                                            > </div>
                                            <div className="handbook-name">
                                                <span>
                                                    {language === 'vi' ? item.nameVi : item.nameEn}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })
                            }
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
        language: state.app.language,
        handbooks: state.admin.handbooks,
        isLoadingHandbooks: state.admin.isLoadingHandbooks
    };
};

const mapDispatchToProps = dispatch => {
    return {};
};

const mapDispatch = {
    fetchAllHandbooks
};

export default withRouter(connect(mapStateToProps, mapDispatch)(Handbook));