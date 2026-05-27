import React, { Component } from 'react';
import { connect } from 'react-redux';

import { FormattedMessage } from 'react-intl';

class HomeFooter extends Component {

    render() {
        

        return (
            <div className="home-footer">
                <p>&copy; 2026 Đồ Án Tốt Nghiệp với Tạ Hữu Tú. All rights reserved.</p>
                <p><FormattedMessage id="footer.contact" /><a target='_blank' href=""><FormattedMessage id="footer.contact_link" /></a></p>
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeFooter);
