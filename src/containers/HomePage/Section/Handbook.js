import React, { Component } from 'react';
import { connect } from 'react-redux';

import { FormattedMessage } from 'react-intl';
import Slider from 'react-slick';
import { getAllhandbooks } from '../../../services/userService';
import SectionLoadingOverlay from '../../../components/SectionLoadingOverlay/SectionLoadingOverlay';
import { withRouter } from 'react-router';


class Handbook extends Component {

    constructor(props) {
        super(props);
        this.state = {
            handbooks: [],
            loading: false
        }
    }

    componentDidMount() {
        this.handleGetAllHandbooks();
    }

    handleGetAllHandbooks = async () => {
        this.setState({ loading: true });
        try {
            const res = await getAllhandbooks();
            if (res && res.errCode === 0) {
                this.setState({ handbooks: res.data ? res.data : [] });
            }
        } catch (e) {
            console.error('Fetch handbooks error', e);
        } finally {
            this.setState({ loading: false });
        }
    }

    handleViewDetailHandbook = (item) => {
        if (this.props.history) {
            this.props.history.push(`/detail-handbook/${item.id}`);
        }
    }

    render() {
        let { handbooks } = this.state;
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
                        <SectionLoadingOverlay active={this.state.loading} text={this.props.language === 'vi' ? 'Đang tải...' : 'Loading...'} />
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
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Handbook));