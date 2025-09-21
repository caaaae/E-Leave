// LeaveRequestForm.jsx
import React, { useState, useEffect} from 'react';
import loginImage from '../assets/Loginform/loginimage.png';
import classes from '../assets/LeaveForm/leave.module.css'; // Import as a CSS Module
import api from "../api";
import Swal from "sweetalert2";

function LeaveRequestForm() {
    // Removed the redundant formData state object and
    // will rely on individual state variables for form fields.
    const [employee_name, setEmployeeName] = useState("");
    const [employee_id, setEmployeeID] = useState("");
    const [email, setEmail] = useState("");
    const [department, setDepartment] = useState("Computer Science"); // Set a default value
    const [leave_type, setLeaveType] = useState("");
    const [start_date, setStartDate] = useState("");
    const [end_date, setEndDate] = useState("");
    const [reason_leave, setReasonLeave] = useState("");
    const [leave_status, setLeaveStatus] = useState("Pending");
    const [supporting_doc, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false); // Added loading state

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
    };

    //fetch function
    const fetchUserDataAndLeaveData = async () => {
        try {
            // Fetch user data
            const userResponse = await api.get('/api/users/');
            const firstName = userResponse.data.first_name;
            const lastName = userResponse.data.last_name;

            setEmployeeName(firstName + " " +lastName);
            setEmployeeID(userResponse.data.employee_id);
            setEmail(userResponse.data.email);

        } catch (err) {
            console.error('Error fetching data:', err);
        }
    };

    useEffect(() => {
        fetchUserDataAndLeaveData();
    }, []);

    // This function might not be strictly necessary if input type="date"
    // is always used and provides YYYY-MM-DD.
    // However, it's kept for robustness in case date input varies.
    const convertDateToYYYYMMDD = (dateString) => {
        // Check if the dateString is already in YYYY-MM-DD format (from type="date" input)
        if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
            return dateString;
        }
        // If it's MM/DD/YYYY, convert it
        const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        const match = dateString.match(dateRegex);

        if (match) {
            const month = match[1];
            const day = match[2];
            const year = match[3];
            return `${year}-${month}-${day}`;
        }
        return dateString; // Return as is if format is not recognized
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        let formattedStartDate = convertDateToYYYYMMDD(start_date);
        let formattedEndDate = convertDateToYYYYMMDD(end_date);

        const formData = new FormData();
        formData.append("employee_name", employee_name);
        formData.append("employee_id", employee_id);
        formData.append("email", email);
        formData.append("department", department);
        formData.append("leave_type", leave_type);
        formData.append("start_date", formattedStartDate);
        formData.append("end_date", formattedEndDate);
        formData.append("reason_leave", reason_leave);
        formData.append("leave_status", leave_status);

        if (supporting_doc) {
            formData.append("supporting_doc", supporting_doc);
        } else {
            console.log("No file selected for supporting_doc");
        }

        try {
            const res = await api.post("/api/createleaves/", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (res.status >= 200 && res.status < 300) {
                console.log("API Response:", res.data);
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Leave request submitted successfully!",
                    confirmButtonColor: "#3085d6"
                });

                setEmployeeName("");
                setEmployeeID("");
                setEmail("");
                setDepartment("Computer Science");
                setLeaveType("");
                setStartDate("");
                setEndDate("");
                setReasonLeave("");
                setSelectedFile(null);
                setLeaveStatus("Pending");
            } else {
                console.error("API Error:", res.status, res.data);
                Swal.fire({
                    icon: "error",
                    title: "Submission Failed",
                    text: res.data.message || "Server error",
                    confirmButtonColor: "#d33"
                });
            }

        } catch (error) {
            console.error('Network or API Error:', error);
            if (error.response) {
                console.error('Error Response Data:', error.response.data);
                console.error('Error Response Status:', error.response.status);
                console.error('Error Response Headers:', error.response.headers);

                Swal.fire({
                    icon: 'error',
                    title: 'Request Failed',
                    text: error.response.data.message || 'Server error',
                    confirmButtonColor: '#d33',
                });
            } else if (error.request) {
                console.error('Error Request:', error.request);

                Swal.fire({
                    icon: 'warning',
                    title: 'No Response',
                    text: 'No response received from the server. Please check your network connection.',
                    confirmButtonColor: '#f39c12',
                });
            } else {
                console.error('Error Message:', error.message);

                Swal.fire({
                    icon: 'error',
                    title: 'Unexpected Error',
                    text: 'An unexpected error occurred. Please try again.',
                    confirmButtonColor: '#d33',
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={classes['leave-request-container']}>
            <header className={classes['eleave-logo']}>
                <img className={classes['imageLogo']} src={loginImage} alt={"loginImage"} />
            </header>

            <form onSubmit={handleSubmit} className={classes['form-inputs']}>
                <div className={classes['form-grid']}>
                    <div className={classes['form-group']}>
                        <label htmlFor="employeeName">Full Name</label>
                        <input
                            disabled
                            type="text"
                            id="employeeName"
                            name="employeeName"
                            value={employee_name}
                            onChange={(e) => setEmployeeName(e.target.value)}
                            placeholder="e.g. Maria Santos"
                            required
                        />
                    </div>
                    <div className={classes['form-group']}>
                        <label htmlFor="employeeId">Employee ID</label>
                        <input
                            disabled
                            type="text"
                            id="employeeId"
                            name="employeeId"
                            value={employee_id}
                            onChange={(e) => setEmployeeID(e.target.value)}
                            placeholder="ABC123456"
                            required
                        />
                    </div>
                </div>

                <div className={classes['form-group']}>
                    <label htmlFor="employeeEmail">Employee Email</label>
                    <input
                        disabled
                        type="text"
                        id="employeeEmail"
                        name="employeeEmail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@company.com"
                        required
                    />
                </div>

                <div className={classes['form-group']}>
                    <label htmlFor="department">Department</label>
                    <select
                        id="department"
                        name="department"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        required
                    >
                        <option value="Computer Science">Computer Science</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Human Resources">Human Resources</option>
                        <option value="Finance">Finance</option>
                        <option value="Marketing">Marketing</option>
                    </select>
                </div>

                <div className={classes['form-grid']}>
                    <div className={classes['form-group']}>
                        <label htmlFor="startDate">Start Date</label>
                        <input
                            type="date"
                            id="startDate"
                            name="startDate"
                            value={start_date}
                            onChange={(e) => setStartDate(e.target.value)}
                            min={new Date().toISOString().split("T")[0]}
                            required
                        />
                    </div>
                    <div className={classes['form-group']}>
                        <label htmlFor="endDate">End Date</label>
                        <input
                            type="date"
                            id="endDate"
                            name="endDate"
                            value={end_date}
                            onChange={(e) => setEndDate(e.target.value)}
                            min={start_date || new Date().toISOString().split("T")[0]}  
                            required
                        />
                    </div>
                </div>
                <div className={classes['form-group']}>
                    <label htmlFor="leaveType">Leave Type</label>
                    <select
                        id="leaveType"
                        name="leaveType"
                        value={leave_type}
                        onChange={(e) => setLeaveType(e.target.value)}
                        required
                    >
                        <option value="">Select Type</option>
                        <option value="Annual Leave">Vacation Leave</option>
                        <option value="Annual Leave">Annual Leave</option>
                        <option value="Sick Leave">Sick Leave</option>
                        <option value="Maternity Leave">Maternity Leave</option>
                        <option value="Paternity Leave">Paternity Leave</option>
                        <option value="Unpaid Leave">Unpaid Leave</option>
                    </select>

                </div>

                <div className={classes['form-group']}>
                    <label htmlFor="reason">Reason for Leave</label>
                    <textarea
                        id="reason"
                        name="reason"
                        value={reason_leave}
                        onChange={(e) => setReasonLeave(e.target.value)}
                        rows="5"
                        placeholder="Enter reason for leave"
                        required
                    ></textarea>
                </div>

                <div className={`${classes['form-group']} ${classes['file-upload-group']}`}>
                    <label htmlFor="supportingDocuments">Supporting Documents</label>
                    <input
                        type="file"
                        id="supportingDocuments"
                        name="supportingDocuments"
                        className={classes['file-input-hidden']}
                        onChange={handleFileChange}
                    />
                    <label htmlFor="supportingDocuments" className={classes['attach-file-label']}>
                        <span className={classes.icon}>&#128206;</span>
                        Attach File***
                    </label>
                    {supporting_doc && ( // Corrected to use supporting_doc
                        <div className={classes['selected-file-name']}>
                            Selected: {supporting_doc.name}
                        </div>
                    )}
                </div>

                <div className={classes['submit-button-container']}>
                    <a href="/" className={classes['back-btn']}>Back</a>
                    <button
                        type="submit"
                        className={classes['submit-btn']}
                        disabled={loading}
                    >
                        {loading ? 'Submitting...' : 'Submit'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LeaveRequestForm;