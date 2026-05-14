import React, {Component} from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { LANGUAGE } from "../../../utils";
const process = require('process');
require('dotenv').config();

class LikeAndShare extends Component {

    constructor(props) {
        super(props);
        this.state = {
            likeCount: 0,
            shareCount: 0
        }
    }

    initFacebookSDK() {
        if (window.FB) {
            window.FB.XFBML.parse();
        }

        let { language } = this.props;
        let locale = language === LANGUAGE.VI ? 'vi_VN' : 'en_US';

        window.fbAsyncInit = function() {
            const initFB = () => {
                if (window.FB && typeof window.FB.init === 'function') {
                    window.FB.init({
                        appId      : process.env.REACT_APP_FACEBOOK_APP_ID,
                        cookie     : true,
                        xfbml      : true,
                        version    : 'v12.0'
                    });
                }
            };

            if (window.FB && typeof window.FB.init === 'function') {
                initFB();
            } else {
                const check = setInterval(() => {
                    if (window.FB && typeof window.FB.init === 'function') {
                        clearInterval(check);
                        initFB();
                    }
                }, 100);
            }
        }

        (function(d, s, id){
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {return;}
            js = d.createElement(s); js.id = id;
            js.src = `https://connect.facebook.net/${locale}/sdk.js`;
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    }

    componentDidMount() {
        this.initFacebookSDK();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {
            this.initFacebookSDK();
        }
    }

    render() {
        let { dataHref } = this.props;
        return (
            <>
                <div className="fb-like"
                    data-href={dataHref}
                    data-width=""
                    data-layout="standard"
                    data-action="like"
                    data-size="small"
                    data-share="true">
                </div>
            </>
        )
    }
}

export default LikeAndShare;