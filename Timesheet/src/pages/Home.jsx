import { useState, useEffect } from "react";
import api from "../api";
import loginImage from '../assets/Loginform/loginimage.png';
import classes from '../assets/HomePage/homepage.module.css';

function Home() {
    const [firstname, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");
    const [leaveData, setLeaveData] = useState([]);

    useEffect(() => {
        api.get('/api/users/')
            .then(response => {
                setFirstName(response.data.first_name);
                setLastName(response.data.last_name);
                setUsername(response.data.username);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });

        api.get('/api/leaves/')
            .then(response => {
                console.log(response.data);
                const data = JSON.parse(JSON.stringify(response.data));
                console.log(data);
                setLeaveData(data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    const handleRequestLeave = () => {
        document.location.href = '/applyLeave';
    };

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

    return (
        <div className={classes['leave-history-container']}>
            <header className={classes['header-section']}>
                <img className={classes['imageLogo']} src={loginImage} alt={"loginImage"}/>
                <div className={classes['welcome-message']}>Welcome, {firstname + " " + lastname}!</div>
            </header>

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
                    </div>

                    <div className={classes['table-body-scrollable']}>
                        {leaveData.map((leave) => (
                            <div className={classes['table-row']} key={leave.id}>
                                <div>{leave.start_date}</div>
                                <div>{leave.end_date}</div>
                                <div>{leave.leave_type}</div>
                                <div className={getStatusClass(leave.leave_status)}>
                                    <span className={classes.icon}>
                                        {getStatusIcon(leave.leave_status)}
                                    </span>
                                    <span className={classes.text}>{leave.leave_status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;