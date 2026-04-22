import React, { Component } from 'react';
import { connect } from 'react-redux';

import { FormattedMessage } from 'react-intl';
import Slider from 'react-slick';

class Specialty extends Component {

    render() {
        
        return (
            <div className="section-share section-specialty">
                <div className="section-container">
                    <div className="section-header">
                        <span className="title-section"><FormattedMessage id="section.specialty" /></span>
                        <button className="btn-section"><FormattedMessage id="section.see-more" /></button>
                    </div>
                    <div className="section-body">
                        <Slider {...this.props.settings}>
                            <div className="section-customize">
                                <div className="bg-image section-specialty"> </div>
                                <span>Cơ xương khớp 1</span>
                            </div>
                            <div className="section-customize">
                                <div className="bg-image section-specialty"> </div>
                                <span>Cơ xương khớp 2</span>
                            </div>
                            <div className="section-customize">
                                <div className="bg-image section-specialty"> </div>
                                <span>Cơ xương khớp 3</span>
                            </div>
                            <div className="section-customize">
                                <div className="bg-image section-specialty"> </div>
                                <span>Cơ xương khớp 4</span>
                            </div>
                            <div className="section-customize">
                                <div className="bg-image section-specialty"> </div>
                                <span>Cơ xương khớp 5</span>
                            </div>
                            <div className="section-customize">
                                <div className="bg-image section-specialty"> </div>
                                <span>Cơ xương khớp 6</span>
                            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Specialty);
