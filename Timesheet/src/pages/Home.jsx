
import { useNavigate } from "react-router-dom";
import api from "../api";
import loginImage from '../assets/Loginform/loginimage.png';
import classes from '../assets/HomePage/homepage.module.css';
import EditLeaveModal from '../components/EditLeaveModalIndividual';
import Swal from "sweetalert2";
import { useState, useEffect } from "react";

function Home() {
    const [firstname, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");
    const [leaveData, setLeaveData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentLeaveToEdit, setCurrentLeaveToEdit] = useState(null);

    // Chatbox states
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! How can I help you today?", sender: "bot" }
    ]);
    const [inputMessage, setInputMessage] = useState("");

    const navigate = useNavigate();

    // Combined fetch function
    const fetchUserDataAndLeaveData = async () => {
        setLoading(true);
        setError(null);
        try {
            // Fetch user data
            const userResponse = await api.get('/api/users/');
            setFirstName(userResponse.data.first_name);
            setLastName(userResponse.data.last_name);

            // Fetch leave data for the user
            const leaveResponse = await api.get('/api/leaves/');
            setLeaveData(leaveResponse.data);

        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Failed to fetch data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserDataAndLeaveData();
    }, []);

    const getStatusClass = (status) => {
        if (status === 'Approved') return classes['status-approved'];
        if (status === 'Pending') return classes['status-pending'];
        if (status === 'Rejected') return classes['status-rejected'];
        return '';
    };

    const getStatusIcon = (status) => {
        if (status === 'Approved') return '✅';
        if (status === 'Pending') return '🟨';
        if (status === 'Rejected') return '❌';
        return '';
    };

    const handleRequestLeave = () => {
        navigate('/applyLeave');
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    // --- Handle Delete Operation ---
    const handleDelete = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await api.delete(`/api/leaves/delete/${id}/`);
                    Swal.fire("Deleted!", "Leave request deleted successfully.", "success");
                    // Re-fetch data to update the UI
                    fetchUserDataAndLeaveData();
                } catch (err) {
                    console.error("Error deleting leave request:", err.response?.data || err.message);
                    Swal.fire("Error!", "Failed to delete leave request. Please try again.", "error");
                }
            }
        });
    };

    // --- Handle Update Operation (Opens the modal) ---
    const handleUpdate = (leave) => {
        setCurrentLeaveToEdit(leave);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentLeaveToEdit(null);
    };

    const handleSaveSuccess = () => {
        // Re-fetch data after a successful save
        fetchUserDataAndLeaveData();
    };

    // Chatbox functions
    const toggleChat = () => {
        setIsChatOpen(!isChatOpen);
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (inputMessage.trim()) {
            const newMessage = {
                id: messages.length + 1,
                text: inputMessage,
                sender: "user"
            };
            setMessages([...messages, newMessage]);
            setInputMessage("");

            // Simulate bot response (you can replace this with actual API call)
            setTimeout(() => {
                const botResponse = {
                    id: messages.length + 2,
                    text: "Thank you for your message. Our support team will get back to you soon!",
                    sender: "bot"
                };
                setMessages(prev => [...prev, botResponse]);
            }, 1000);
        }
    };

    if (loading) {
        return <div className={classes.message}>Loading leave data...</div>;
    }

    if (error) {
        return <div className={`${classes.message} ${classes.error}`}>{error}</div>;
    }

    return (
        <div className={classes['leave-history-container2']}>
            <header className={classes['header-section']}>
                {/* This is the first child, grouped on the left */}
                <div className={classes['left-header-content']}>
                    <div className={classes['eleave-logo-section']}>
                        <img className={classes['imageLogo']} src={loginImage} alt={"loginImage"} />
                    </div>
                    <div className={classes['welcome-message']}>Welcome, {firstname + " " + lastname}!</div>
                </div>
                {/* This is the second child, grouped on the right */}
                <div className={classes['right-header-content']}>
                    <button className={classes['logout-btn']} onClick={handleLogout}>
                        <span className={classes['btn-text']}>Logout</span>
                        <span className={classes['btn-icon']}>↩️</span>
                    </button>
                </div>

            </header>

            <div className={classes['leave-history-container']}>
                <div className={classes['main-content-box']}>
                    <div className={classes['top-bar']}>
                        <h2 className={classes['leave-history-title']}>Leave History</h2>
                        <button className={classes['request-leave-btn']} onClick={handleRequestLeave}>
                            Request Leave
                        </button>
                    </div>

                    <div className={classes['leave-table']}>
                        <div className={classes['table-header']}>
                            <div>Start Date</div>
                            <div>End Date</div>
                            <div>Leave Type</div>
                            <div>Status</div>
                            <div>Actions</div>
                        </div>

                        <div className={classes['table-body-scrollable']}>
                            {leaveData.map((leave, index) => {
                                // Define a variable to check if the buttons should be disabled
                                const isFinal = leave.leave_status === 'Approved' || leave.leave_status === 'Rejected';

                                return (
                                    <div
                                        className={`${classes['table-row']} ${index % 2 === 0 ? classes['row-even'] : classes['row-odd']}`}
                                        key={leave.id}
                                    >
                                        <div>{leave.start_date}</div>
                                        <div>{leave.end_date}</div>
                                        <div>{leave.leave_type}</div>
                                        <div className={getStatusClass(leave.leave_status)}>
                                            <span className={classes.icon}>
                                                {getStatusIcon(leave.leave_status)}
                                            </span>
                                            <span className={classes.text}>{leave.leave_status}</span>
                                        </div>
                                        <div className={classes['action-buttons']}>
                                            <button
                                                onClick={() => handleUpdate(leave)}
                                                className={classes['update-button']}
                                                disabled={isFinal} // Apply the disabled attribute
                                            >
                                                <span className={classes['btn-text']}>Update</span>
                                                <span className={classes['btn-icon']}>📝</span>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(leave.id)}
                                                className={classes['delete-button']}
                                                disabled={isFinal} // Apply the disabled attribute
                                            >
                                                <span className={classes['btn-text']}>Delete</span>
                                                <span className={classes['btn-icon']}>🗑️</span>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
            {isModalOpen && (
                <EditLeaveModal
                    leave={currentLeaveToEdit}
                    onClose={handleCloseModal}
                    onSaveSuccess={handleSaveSuccess}
                />
            )}

            {/* Chatbox Widget */}
            <div style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                zIndex: 1000
            }}>
                {/* Chat Container */}
                {isChatOpen && (
                    <div style={{
                        width: '350px',
                        height: '450px',
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                        display: 'flex',
                        flexDirection: 'column',
                        marginBottom: '10px',
                        overflow: 'hidden',
                        animation: 'slideUp 0.3s ease-out'
                    }}>
                        {/* Chat Header */}
                        <div style={{
                            backgroundColor: '#4A90E2',
                            color: 'white',
                            padding: '15px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderRadius: '12px 12px 0 0'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{
                                    width: '10px',
                                    height: '10px',
                                    backgroundColor: '#4FD82B',
                                    borderRadius: '50%',
                                    boxShadow: '0 0 5px #4FD82B'
                                }}></div>
                                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Support Chat</span>
                            </div>
                            <button
                                onClick={toggleChat}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'white',
                                    fontSize: '20px',
                                    cursor: 'pointer',
                                    padding: '0',
                                    width: '30px',
                                    height: '30px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '4px',
                                    transition: 'background-color 0.2s'
                                }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                            >
                                ✕
                            </button>
                        </div>

                        {/* Chat Messages Area */}
                        <div style={{
                            flex: 1,
                            overflowY: 'auto',
                            padding: '15px',
                            backgroundColor: '#F8F9FA',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px'
                        }}>
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    style={{
                                        display: 'flex',
                                        justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start'
                                    }}
                                >
                                    <div style={{
                                        maxWidth: '70%',
                                        padding: '10px 15px',
                                        borderRadius: message.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                                        backgroundColor: message.sender === 'user' ? '#4A90E2' : '#E8E8E8',
                                        color: message.sender === 'user' ? 'white' : '#333',
                                        fontSize: '14px',
                                        lineHeight: '1.4',
                                        wordBreak: 'break-word'
                                    }}>
                                        {message.text}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Chat Input Area */}
                        <form onSubmit={handleSendMessage} style={{
                            padding: '15px',
                            backgroundColor: 'white',
                            borderTop: '1px solid #E0E0E0',
                            display: 'flex',
                            gap: '10px'
                        }}>
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                placeholder="Type your message..."
                                style={{
                                    flex: 1,
                                    padding: '10px 15px',
                                    borderRadius: '20px',
                                    border: '1px solid #E0E0E0',
                                    outline: 'none',
                                    fontSize: '14px',
                                    transition: 'border-color 0.2s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#4A90E2'}
                                onBlur={(e) => e.target.style.borderColor = '#E0E0E0'}
                            />
                            <button
                                type="submit"
                                style={{
                                    backgroundColor: '#4A90E2',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '40px',
                                    height: '40px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '18px',
                                    transition: 'background-color 0.2s'
                                }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#357ABD'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = '#4A90E2'}
                            >
                                →
                            </button>
                        </form>
                    </div>
                )}

                {/* Chat Toggle Button */}
                <button
                    onClick={toggleChat}
                    style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        backgroundColor: '#4A90E2',
                        border: 'none',
                        color: 'white',
                        fontSize: '28px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(74, 144, 226, 0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        animation: isChatOpen ? 'none' : 'pulse 2s infinite'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.transform = 'scale(1.1)';
                        e.target.style.boxShadow = '0 6px 16px rgba(74, 144, 226, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.transform = 'scale(1)';
                        e.target.style.boxShadow = '0 4px 12px rgba(74, 144, 226, 0.4)';
                    }}
                >
                    {isChatOpen ? '✕' : '💬'}
                </button>
            </div>

            {/* Add CSS animations */}
            <style>{`
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes pulse {
                    0% {
                        box-shadow: 0 4px 12px rgba(74, 144, 226, 0.4);
                    }
                    50% {
                        box-shadow: 0 4px 20px rgba(74, 144, 226, 0.6);
                    }
                    100% {
                        box-shadow: 0 4px 12px rgba(74, 144, 226, 0.4);
                    }
                }
            `}</style>
        </div >
    );
}

export default Home;