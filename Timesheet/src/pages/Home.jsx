import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import loginImage from '../assets/Loginform/loginimage.png';
import classes from '../assets/HomePage/homepage.module.css';
import EditLeaveModal from '../components/EditLeaveModalIndividual';
import Swal from "sweetalert2";

function Home() {
    const [firstname, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");
    const [leaveData, setLeaveData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentLeaveToEdit, setCurrentLeaveToEdit] = useState(null);

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
                    Logout
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
        </div >
    );
}

export default Home;