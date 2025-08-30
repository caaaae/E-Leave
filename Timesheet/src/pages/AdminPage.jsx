import { useState, useEffect } from "react";
import api from "../api";
import loginImage from '../assets/Loginform/loginimage.png';
import classes from '../assets/AdminPage/adminpage.module.css';
import EditLeaveModal from '../components/EditLeaveModal';
import Swal from "sweetalert2";

function Home() {
    const [leaveData, setLeaveData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentLeaveToEdit, setCurrentLeaveToEdit] = useState(null);

    const fetchLeaveData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/api/allgetleaves/');
            setLeaveData(response.data);
            console.log("Fetched leave data:", response.data);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Failed to fetch leave data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaveData();
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
                    fetchLeaveData();
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
        fetchLeaveData();
    };

    if (loading) {
        return <div className={classes.message}>Loading leave data...</div>;
    }

    if (error) {
        return <div className={`${classes.message} ${classes.error}`}>{error}</div>;
    }

    if (leaveData.length === 0) {
        return <div className={classes.message}>No leave requests found.</div>;
    }

    return (
        <div className={classes['leave-history-container']}>
            <header className={classes['header-section']}>
                <img className={classes['imageLogo']} src={loginImage} alt={"loginImage"} />
            </header>

            <div className={classes['main-content-box']}>
                <div className={classes['top-bar']}>
                    <h2 className={classes['leave-history-title']}>Leave History</h2>
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
                        {leaveData.map((leave, index) => (
                            <div
                                className={`${classes['table-row']} ${index % 2 === 0 ? classes['row-even'] : classes['row-odd']
                                    }`}
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
                                    >
                                        <span className={classes['btn-text']}>Update</span>
                                        <span className={classes['btn-icon']}>📝</span>
                                    </button>

                                    <button
                                        onClick={() => handleDelete(leave.id)}
                                        className={classes['delete-button']}
                                    >
                                        <span className={classes['btn-text']}>Delete</span>
                                        <span className={classes['btn-icon']}>🗑️</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>

            {/* Conditionally render the EditLeaveModal */}
            {isModalOpen && (
                <EditLeaveModal
                    leave={currentLeaveToEdit} // Pass the data of the leave to be edited
                    onClose={handleCloseModal} // Function to close the modal
                    onSaveSuccess={handleSaveSuccess} // Function to call after successful save
                />
            )}
        </div>
    );
}

export default Home;