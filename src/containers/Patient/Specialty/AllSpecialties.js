import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import { getAllSpecialty } from '../../../services/userService';
import SectionLoadingOverlay from '../../../components/SectionLoadingOverlay/SectionLoadingOverlay';
import HomeHeader from '../../HomePage/HomeHeader';
import { LANGUAGE } from '../../../utils';

import './DetailSpecialty.scss';

class AllSpecialties extends Component {
    constructor(props) {
        super(props);
        this.state = {
            specialties: [],
            searchQuery: '',
            loading: false
        };
        this.searchTimeout = null;
    }

    componentDidMount() {
        this.fetchSpecialties('');
    }

    componentWillUnmount() {
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }
    }

    fetchSpecialties = async (q = '') => {
        this.setState({ loading: true });

        try {
            const res = await getAllSpecialty(q);
            if (res && res.errCode === 0) {
                this.setState({
                    specialties: res.data || []
                });
            }
        } catch (e) {
            console.error('fetchSpecialties error:', e);
        } finally {
            this.setState({ loading: false });
        }
    };

    handleSearchChange = (e) => {
        const q = e.target.value;
        this.setState({ searchQuery: q });

        if (this.searchTimeout) clearTimeout(this.searchTimeout);

        this.searchTimeout = setTimeout(() => {
            this.fetchSpecialties(q);
        }, 500);
    };

    handleClearSearch = () => {
        this.setState({ searchQuery: '' });
        if (this.searchTimeout) clearTimeout(this.searchTimeout);
        this.fetchSpecialties('');
    };

    handleViewDetail = (item) => {
        this.props.history.push(`/detail-specialty/${item.id}`);
    };

    render() {
        const { specialties, searchQuery, loading } = this.state;
        const { language } = this.props;

        return (
            <div className="handbook-list-page">
                <HomeHeader />

                <div className="container mt-3">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h2>
                            <FormattedMessage id="specialty.allSpecialty" />
                        </h2>

                        <div className="position-relative" style={{ width: '100%', maxWidth: '360px' }}>
                            <input
                                className="list-search"
                                placeholder={language === LANGUAGE.VI ? 'Tìm theo chuyên khoa...' : 'Search specialty...'}
                                value={searchQuery}
                                onChange={this.handleSearchChange}
                                style={{
                                    padding: '8px 48px 8px 16px',
                                    borderRadius: '6px',
                                    border: '1px solid #e2e8f0',
                                    width: '100%'
                                }}
                            />

                            <div style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: 8 }}>
                                {searchQuery && (
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-link p-0 text-muted"
                                        onClick={this.handleClearSearch}
                                        aria-label="Clear search"
                                        style={{ lineHeight: 1, display: 'inline-flex', alignItems: 'center' }}
                                    >
                                        ×
                                    </button>
                                )}
                                <i className="fas fa-search" style={{ color: '#6b7280', lineHeight: 1, display: 'block' }} />
                            </div>
                        </div>
                    </div>

                    <div style={{ position: 'relative' }}>
                        <SectionLoadingOverlay 
                            active={loading} 
                            text={language === LANGUAGE.VI ? 'Đang tải...' : 'Loading...'} 
                        />

                        <div className="row">
                            {specialties.length > 0 ? (
                                specialties.map((item) => (
                                    <div className="col-md-4 mb-4" key={item.id}>
                                        <div
                                            className="handbook-card"
                                            onClick={() => this.handleViewDetail(item)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <div 
                                                className="thumb" 
                                                style={{ backgroundImage: `url(${item.image})` }}
                                            />
                                            <h4>
                                                {language === LANGUAGE.VI ? item.nameVi : item.nameEn}
                                            </h4>
                                            <span className="btn btn-link">Xem chi tiết</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-12 text-center py-5">
                                    <p>Không có chuyên khoa nào.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    language: state.app.language
});

export default withRouter(connect(mapStateToProps)(AllSpecialties));