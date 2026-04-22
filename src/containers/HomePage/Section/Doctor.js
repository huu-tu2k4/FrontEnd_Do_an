import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Slider from 'react-slick';

class Doctor extends Component {

    render() {
        return (
            <div className="section-share section-doctor">
                <div className="section-container">
                    <div className="section-header">
                        <span className="title-section"><FormattedMessage id="section.outstanding-doctor" /></span>
                        <button className="btn-section"><FormattedMessage id="section.see-more" /></button>
                    </div>
                    <div className="section-body">
                        <Slider {...this.props.settings}>
                            <div className="section-customize">
                                <div className="customize-border">
                                    <div className="outer-bg">
                                        <div className="bg-image section-doctor"> </div>
                                    </div>
                                    <div className="positon text-center">
                                        <div>Giáo sư Cù Trọng Xoay</div>
                                        <span>Cơ xương khớp 1</span>
                                    </div>
                                </div>
                            </div>
                            <div className="section-customize">
                                <div className="customize-border">
                                    <div className="outer-bg">
                                        <div className="bg-image section-doctor"> </div>
                                    </div>
                                    <div className="positon text-center">
                                        <div>Giáo sư Cù Trọng Xoay</div>
                                        <span>Cơ xương khớp 2</span>
                                    </div>
                                </div>
                            </div>
                            <div className="section-customize">
                                <div className="customize-border">
                                    <div className="outer-bg">
                                        <div className="bg-image section-doctor"> </div>
                                    </div>
                                    <div className="positon text-center">
                                        <div>Giáo sư Cù Trọng Xoay</div>
                                        <span>Cơ xương khớp 3</span>
                                    </div>
                                </div>
                            </div>
                            <div className="section-customize">
                                <div className="customize-border">
                                    <div className="outer-bg">
                                        <div className="bg-image section-doctor"> </div>
                                    </div>
                                    <div className="positon text-center">
                                        <div>Giáo sư Cù Trọng Xoay</div>
                                        <span>Cơ xương khớp 4</span>
                                    </div>
                                </div>
                            </div>
                            <div className="section-customize">
                                <div className="customize-border">
                                    <div className="outer-bg">
                                        <div className="bg-image section-doctor"> </div>
                                    </div>
                                    <div className="positon text-center">
                                        <div>Giáo sư Cù Trọng Xoay</div>
                                        <span>Cơ xương khớp 5</span>
                                    </div>
                                </div>
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
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Doctor);
