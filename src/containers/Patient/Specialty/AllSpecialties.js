import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { getAllSpecialty } from '../../../services/userService';
import HomeHeader from '../../HomePage/HomeHeader';
import { Link } from 'react-router-dom';
import { path } from '../../../utils';
import { connect } from 'react-redux';

import './DetailSpecialty.scss';

class AllSpecialties extends Component {
    constructor(props) {
        super(props);
        this.state = {
            specialties: []
        }
    }

    async componentDidMount() {
        await this.fetchSpecialties('');
    }

    fetchSpecialties = async (q) => {
        try {
            const res = await getAllSpecialty(q);
            if (res && res.data) this.setState({ specialties: res.data });
        } catch (e) { console.error('fetchSpecialties error', e); }
    }

    handleSearchChange = (e) => {
        const q = e.target.value;
        this.setState({ searchQuery: q });
        if (this.searchTimeout) clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => this.fetchSpecialties(q), 300);
    }

    handleViewDetail = (item) => {
        if (this.props.history) {
            this.props.history.push(`/detail-specialty/${item.id}`);
        }
    }

    render() {
        const { specialties, searchQuery = '' } = this.state;
        const { language } = this.props;
        return (
            <div className="handbook-list-page">
                <HomeHeader />
                <div className="container mt-3">
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:12, marginBottom:12}}>
                        <h2>{language === 'vi' ? 'Tất cả chuyên khoa' : 'All Specialties'}</h2>
                        <div style={{position:'relative', display:'flex', alignItems:'center', width:'100%', justifyContent:'flex-end'}}>
                            <input
                                className="list-search"
                                placeholder={language === 'vi' ? 'Tìm theo chuyên khoa...' : 'Search specialty...'}
                                value={searchQuery || ''}
                                onChange={this.handleSearchChange}
                                style={{padding:8, borderRadius:6, border:'1px solid #e2e8f0', maxWidth:360, paddingRight:48}}
                            />
                            <div style={{position:'absolute', right:8, display:'flex', alignItems:'center', gap:8}}>
                                {searchQuery ? (
                                    <button type="button" className="btn btn-sm btn-light" aria-label="Clear search" onClick={() => { this.setState({ searchQuery: '' }); if (this.searchTimeout) clearTimeout(this.searchTimeout); this.fetchSpecialties(''); }}>
                                        ×
                                    </button>
                                ) : null}
                                <i className="fas fa-search" aria-hidden="true" style={{color:'#6b7280'}} />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        {specialties && specialties.length > 0 && specialties.map((item) => (
                            <div className="col-md-4" key={item.id}>
                                <div 
                                    className="handbook-card"
                                    onClick={() => this.handleViewDetail(item)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="thumb" style={{ backgroundImage: `url(${item.image})` }}></div>
                                    <h4>{language === 'vi' ? item.nameVi : item.nameEn}</h4>
                                    <span className="btn btn-link">Xem chi tiết</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({ language: state.app.language });

export default withRouter(connect(mapStateToProps)(AllSpecialties));
