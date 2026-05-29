import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { aiSuggestSpecialty } from '../services/userService';
import iconAi from '../assets/icon-ai.png';
import './AIChatbot.scss';

class AIChatbot extends Component {

    constructor(props) {
        super(props);
        const { intl } = props;
        this.state = {
            isOpen: false,
            messages: [
                {
                    type: 'bot',
                    text: intl ? intl.formatMessage({ id: 'aiChatbot.initialGreeting' }) : 'Xin chào!'
                }
            ],
            inputMessage: '',
            loading: false
        };
    }

    toggleChat = () => {
        this.setState({ isOpen: !this.state.isOpen });
    }

    handleSendMessage = async () => {
        const { inputMessage, messages } = this.state;
        if (!inputMessage.trim() || this.state.loading) return;

        const userMessage = { type: 'user', text: inputMessage.trim() };

        this.setState({
            messages: [...messages, userMessage],
            inputMessage: '',
            loading: true
        });

        try {
            const response = await aiSuggestSpecialty(inputMessage.trim());

            const { intl } = this.props;
            let botMessage = { type: 'bot', isStructured: true };

            if (response && response.errCode === 0 && response.data) {
                const data = response.data;

                botMessage.mainSpecialty = data.suggestedSpecialties?.[0]?.name || intl.formatMessage({ id: 'aiChatbot.mainSpecialtyLabel' });
                botMessage.reason = data.suggestedSpecialties?.[0]?.reason || "";
                botMessage.advice = data.advice || intl.formatMessage({ id: 'aiChatbot.adviceDefault' });
            } else {
                botMessage.text = intl.formatMessage({ id: 'aiChatbot.unknown' });
                botMessage.isStructured = false;
            }

            this.setState(prev => ({
                messages: [...prev.messages, botMessage],
                loading: false
            }));

        } catch (err) {
            console.error(err);
            const { intl } = this.props;
            this.setState(prev => ({
                messages: [...prev.messages, {
                    type: 'bot',
                    text: intl ? intl.formatMessage({ id: 'aiChatbot.error' }) : 'Xin lỗi, hiện tại tôi đang gặp vấn đề.',
                    isStructured: false
                }],
                loading: false
            }));
        }
    }

    handleKeyPress = (e) => {
        if (e.key === 'Enter' && !this.state.loading) {
            this.handleSendMessage();
        }
    }

    render() {
        const { isOpen, messages, inputMessage, loading } = this.state;
        const { intl } = this.props;

        return (
            <div className="ai-chatbot-container">
                {/* Floating Button */}
                <div className="floating-ai-button" onClick={this.toggleChat}>
                    <div className="ai-button-content">
                        <div className="ai-avatar">
                            <img
                                src={iconAi}
                                alt={intl ? intl.formatMessage({ id: 'aiChatbot.floatingTitle' }) : 'AI Assistant'}
                            />
                        </div>
                        <div className="ai-info">
                            <h4><FormattedMessage id="aiChatbot.floatingTitle" /></h4>
                            <p><FormattedMessage id="aiChatbot.floatingSubtitle" /></p>
                        </div>
                    </div>
                </div>

                {/* Chat Modal */}
                {isOpen && (
                    <div className="ai-chat-modal">
                        <div className="chat-header">
                            <div className="header-left">
                                <div className="header-avatar">
                                    <img
                                        src={iconAi}
                                        alt="AI"
                                    />
                                </div>
                                <div>
                                    <div className="font-semibold"><FormattedMessage id="aiChatbot.headerTitle" /></div>
                                    <div className="text-xs opacity-75"><FormattedMessage id="aiChatbot.headerSubtitle" /></div>
                                </div>
                            </div>
                            <div className="close-btn" onClick={this.toggleChat} title={intl ? intl.formatMessage({ id: 'aiChatbot.close' }) : 'Close'}>×</div>
                        </div>

                        <div className="chat-body">
                            {messages.map((msg, index) => (
                                <div key={index} className={`message ${msg.type === 'user' ? 'user' : 'bot'}`}>
                                    {msg.type === 'user' ? (
                                        msg.text
                                    ) : msg.isStructured ? (
                                        <>
                                            <div className="main-specialty">
                                                <strong><FormattedMessage id="aiChatbot.mainSpecialtyLabel" /></strong><br />
                                                <span className="specialty-name">{msg.mainSpecialty}</span>
                                            </div>

                                            {msg.reason && (
                                                <div className="reason mt-2">
                                                    {msg.reason}
                                                </div>
                                            )}

                                            {msg.advice && (
                                                <div className="advice mt-4">
                                                    <strong><FormattedMessage id="aiChatbot.adviceLabel" /></strong><br />
                                                    {msg.advice}
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        msg.text
                                    )}
                                </div>
                            ))}

                            {loading && (
                                <div className="message bot"><FormattedMessage id="aiChatbot.analyzing" /></div>
                            )}
                        </div>

                        <div className="chat-footer">
                            <div className="input-wrapper">
                                <input
                                    type="text"
                                    value={inputMessage}
                                    onChange={(e) => this.setState({ inputMessage: e.target.value })}
                                    onKeyPress={this.handleKeyPress}
                                    placeholder={intl ? intl.formatMessage({ id: 'aiChatbot.placeholder' }) : 'Mô tả triệu chứng của bạn...'}
                                />
                                <button
                                    onClick={this.handleSendMessage}
                                    disabled={loading || !inputMessage.trim()}
                                >
                                    <FormattedMessage id="aiChatbot.sendButton" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    language: state.app.language
});

export default connect(mapStateToProps)(injectIntl(AIChatbot));