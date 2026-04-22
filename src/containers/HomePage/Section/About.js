import React, { Component } from 'react';
import { connect } from 'react-redux';

import { FormattedMessage } from 'react-intl';

class About extends Component {

    render() {
        

        return (
            <div className="section-share section-about">
                <div className="section-about-header">
                    Truyền thông nói về BookingCare
                </div>
                <div className="section-about-content">
                    <div className="content-left">
                        <iframe 
                            width="100%" 
                            height="400px" 
                            src="https://www.youtube.com/embed/k92iJuxWwRE" title="🏆[PVS Finals 2026 P1] Ngày 6: AL, TE, FCE, TDT, FL, WDE, VC, UNC, SBTC,..." 
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                            referrerPolicy="strict-origin-when-cross-origin" 
                            allowFullScreen
                        ></iframe>
                    </div>
                    <div className="content-right">
                        <p>
                            BookingCare là nền tảng công nghệ giúp người bệnh dễ dàng đặt lịch khám và kết nối với các bác sĩ chuyên môn. Với sứ mệnh mang lại trải nghiệm chăm sóc sức khỏe tốt nhất, BookingCare luôn nỗ lực để trở thành người bạn đồng hành tin cậy của người dân Việt Nam.
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
