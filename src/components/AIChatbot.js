import React, { Component } from 'react';
import { connect } from 'react-redux';
import { aiSuggestSpecialty } from '../services/userService';
import iconAi from '../assets/icon-ai.png';
import './AIChatbot.scss';

class AIChatbot extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            messages: [
                {
                    type: 'bot',
                    text: 'Xin chào! Tôi là Trợ lý AI của Booking Care. Hãy mô tả triệu chứng để tôi gợi ý chuyên khoa phù hợp nhất cho bạn.'
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

            let botMessage = { type: 'bot', isStructured: true };

            if (response && response.errCode === 0 && response.data) {
                const data = response.data;
                
                botMessage.mainSpecialty = data.suggestedSpecialties?.[0]?.name || "Nội khoa";
                botMessage.reason = data.suggestedSpecialties?.[0]?.reason || "";
                botMessage.advice = data.advice || "Bạn nên đi khám sớm để được chẩn đoán và điều trị kịp thời.";
            } else {
                botMessage.text = "Tôi không hiểu rõ, bạn có thể mô tả chi tiết triệu chứng hơn được không?";
                botMessage.isStructured = false;
            }

            this.setState(prev => ({
                messages: [...prev.messages, botMessage],
                loading: false
            }));

        } catch (err) {
            console.error(err);
            this.setState(prev => ({
                messages: [...prev.messages, {
                    type: 'bot',
                    text: 'Xin lỗi, hiện tại tôi đang gặp vấn đề. Vui lòng thử lại sau!',
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

        return (
            <div className="ai-chatbot-container">
                {/* Floating Button */}
                <div className="floating-ai-button" onClick={this.toggleChat}>
                    <div className="ai-button-content">
                        <div className="ai-avatar">
                            <img
                                src={iconAi}
                                alt="AI Assistant"
                            />
                        </div>
                        <div className="ai-info">
                            <h4>Trợ lý AI</h4>
                            <p>Hỗ trợ 24/7</p>
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
                                    <div className="font-semibold">Trợ lý AI Booking Care</div>
                                    <div className="text-xs opacity-75">Gợi ý chuyên khoa</div>
                                </div>
                            </div>
                            <div className="close-btn" onClick={this.toggleChat}>×</div>
                        </div>

                        <div className="chat-body">
                            {messages.map((msg, index) => (
                                <div key={index} className={`message ${msg.type === 'user' ? 'user' : 'bot'}`}>
                                    {msg.type === 'user' ? (
                                        msg.text
                                    ) : msg.isStructured ? (
                                        <>
                                            <div className="main-specialty">
                                                <strong>🏥 Chuyên khoa nên khám:</strong><br />
                                                <span className="specialty-name">{msg.mainSpecialty}</span>
                                            </div>

                                            {msg.reason && (
                                                <div className="reason mt-2">
                                                    {msg.reason}
                                                </div>
                                            )}

                                            {msg.advice && (
                                                <div className="advice mt-4">
                                                    <strong>💡 Lời khuyên:</strong><br />
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
                                <div className="message bot">Đang phân tích triệu chứng...</div>
                            )}
                        </div>

                        <div className="chat-footer">
                            <div className="input-wrapper">
                                <input
                                    type="text"
                                    value={inputMessage}
                                    onChange={(e) => this.setState({ inputMessage: e.target.value })}
                                    onKeyPress={this.handleKeyPress}
                                    placeholder="Mô tả triệu chứng của bạn..."
                                />
                                <button
                                    onClick={this.handleSendMessage}
                                    disabled={loading || !inputMessage.trim()}
                                >
                                    Gửi
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

export default connect(mapStateToProps, null)(AIChatbot);