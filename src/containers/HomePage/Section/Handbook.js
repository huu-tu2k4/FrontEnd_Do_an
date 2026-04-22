import React, { Component } from 'react';
import { connect } from 'react-redux';

import { FormattedMessage } from 'react-intl';
import Slider from 'react-slick';

class Handbook extends Component {

    render() {
        

        return (
            <div className="section-share section-handbook">
                <div className="section-container">
                    <div className="section-header">
                        <span className="title-section"><FormattedMessage id="section.handbook" /></span>
                        <button className="btn-section"><FormattedMessage id="section.see-more" /></button>
                    </div>
                    <div className="section-body">
                        <Slider {...this.props.settings}>
                            <div className="section-customize">
                                <div className="bg-image section-handbook"> </div>
                                <span>Cẩm nang sức khỏe 1</span>
                            </div>
                            <div className="section-customize">
                                <div className="bg-image section-handbook"> </div>
                                <span>Cẩm nang sức khỏe 2</span>
                            </div>
                            <div className="section-customize">
                                <div className="bg-image section-handbook"> </div>
                                <span>Cẩm nang sức khỏe 3</span>
                            </div>
                            <div className="section-customize">
                                <div className="bg-image section-handbook"> </div>
                                <span>Cẩm nang sức khỏe 4</span>
                            </div>
                            <div className="section-customize">
                                <div className="bg-image section-handbook"> </div>
                                <span>Cẩm nang sức khỏe 5</span>
                            </div>
                            <div className="section-customize">
                                <div className="bg-image section-handbook"> </div>
                                <span>Cẩm nang sức khỏe 6</span>
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

export default connect(mapStateToProps, mapDispatchToProps)(Handbook);
