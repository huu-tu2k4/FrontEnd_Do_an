import React, { Component } from 'react';
import { connect } from 'react-redux';

import { FormattedMessage } from 'react-intl';
import Slider from 'react-slick';
import handbookService from '../../../services/handbookService';
import { Link } from 'react-router-dom';
import { path } from '../../../utils';

class Handbook extends Component {
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
        return (
            <div className="section-share section-handbook">
                <div className="section-container">
                    <div className="section-header">
                        <span className="title-section"><FormattedMessage id="section.handbook" /></span>
                        <Link to={path.HANDBOOK} className="btn-section"><FormattedMessage id="section.see-more" /></Link>
                    </div>
                    <div className="section-body">
                        <Slider {...this.props.settings}>
                            {handbooks && handbooks.length > 0 ? handbooks.map((item, index) => (
                                <Link key={index} to={path.DETAIL_HANDBOOK.replace(':id', item.id)} className="section-customize" style={{ display: 'block' }}>
                                    <div className="bg-image section-handbook" style={{ backgroundImage: `url(${item.image})` }}></div>
                                    <span>{this.props.language === 'vi' ? item.nameVi : item.nameEn}</span>
                                </Link>
                            )) : (
                                <div className="section-customize">
                                    <div className="bg-image section-handbook"> </div>
                                    <span>No handbook</span>
                                </div>
                            )}
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
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Handbook);
