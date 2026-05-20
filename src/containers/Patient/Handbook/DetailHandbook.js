import React, { Component } from 'react';
import { connect } from 'react-redux';
import HomeHeader from '../../HomePage/HomeHeader';
import { getHandbookById } from '../../../services/userService';

import './DetailHandbook.scss';

class DetailHandbook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            handbook: null
        }
    }

    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            try {
                const res = await getHandbookById(id);
                if (res && res.errCode === 0) {
                    this.setState({ handbook: res.data });
                }
            } catch (e) {
                console.error('Get handbook detail error', e);
            }
        }
    }

    render() {
        const { handbook } = this.state;
        return (
            <div className="detail-handbook-container">
                <HomeHeader />
                <div className="container mt-3">
                    {handbook && (
                        <div>
                            <h2>{this.props.language === 'vi' ? handbook.nameVi : handbook.nameEn}</h2>
                            <div className="handbook-image" style={{ backgroundImage: `url(${handbook.image})` }}></div>
                            <div dangerouslySetInnerHTML={{ __html: handbook.descriptionHTML }}></div>
                        </div>
                    )}
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({ language: state.app.language });
const mapDispatchToProps = dispatch => ({ });

export default connect(mapStateToProps, mapDispatchToProps)(DetailHandbook);
