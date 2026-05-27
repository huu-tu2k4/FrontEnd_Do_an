import React, { Component } from 'react';
import { connect } from 'react-redux';

import { FormattedMessage } from 'react-intl';

class About extends Component {

    render() {
        

        return (
            <div className="section-share section-about">
                <div className="section-about-header">
                    <FormattedMessage id="about.title" />
                </div>
                <div className="section-about-content">
                    <div className="content-left">
                        <iframe width="560" height="315" 
                        src="https://www.youtube.com/embed/1sHF_Fa9-0E?si=gTXolQ3gTQyE9mB4" 
                        title="Truyền thông nói gì về các web đặt lịch khám bệnh trực tuyến" 
                        frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                    </div>
                    <div className="content-right">
                        <p>
                            <FormattedMessage id="about.description" />
                        </p>

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

export default connect(mapStateToProps, mapDispatchToProps)(About);
