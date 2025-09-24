import React, { useState, useEffect, useCallback } from 'react';
import loginImage from '../assets/Loginform/loginimage.png';
import classes from '../assets/LeaveForm/leave.module.css';
import api from "../api";
import Swal from "sweetalert2";

const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
};

function LeaveRequestForm() {
    const [formData, setFormData] = useState(() => {
        const savedDraft = localStorage.getItem('leaveFormDraft');
        if (savedDraft) {
            return JSON.parse(savedDraft);
        }
        return {
            employee_name: "",
            employee_id: "",
            email: "",
            phoneNumber: "",
            department: "Computer Science",
            leave_type: "",
            start_date: "",
            end_date: "",
            reason_leave: "",
            leave_status: "Pending",
        };
    });

    const [supporting_doc, setSelectedFile] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saveStatus, setSaveStatus] = useState('');
    const [isEdited, setIsEdited] = useState(false); 

    const debouncedFormData = useDebounce(formData, 1000);

    useEffect(() => {
        if (isEdited) {
            setSaveStatus('Saving...');
            try {
                const dataToSave = { ...debouncedFormData };
                delete dataToSave.supporting_doc;
                localStorage.setItem('leaveFormDraft', JSON.stringify(dataToSave));
                setSaveStatus('Draft saved automatically! ✅');
            } catch (error) {
                console.error("Failed to save to local storage", error);
                setSaveStatus('Save failed!');
            }
        }
    }, [debouncedFormData, isEdited]);
    
    const fetchUserDataAndLeaveData = useCallback(async () => {
        try {
            const userResponse = await api.get('/api/users/');
            const user = userResponse.data;
            setFormData(prevData => ({
                ...prevData,
                employee_name: `${user.first_name} ${user.last_name}`,
                employee_id: user.employee_id,
                email: user.email,
                phoneNumber: user.phoneNumber,
            }));
        } catch (err) {
            console.error('Error fetching data:', err);
        }
    }, []);

    useEffect(() => {
        fetchUserDataAndLeaveData();
    }, [fetchUserDataAndLeaveData]);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
        setIsEdited(true); 
    };

    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files);
        setSelectedFile(prevFiles => [...prevFiles, ...newFiles]);
        setIsEdited(true); 
    };

    const convertDateToYYYYMMDD = (dateString) => {
        if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
            return dateString;
        }
        const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        const match = dateString.match(dateRegex);
        if (match) {
            const month = match[1];
            const day = match[2];
            const year = match[3];
            return `${year}-${month}-${day}`;
        }
        return dateString;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formattedStartDate = convertDateToYYYYMMDD(formData.start_date);
        const formattedEndDate = convertDateToYYYYMMDD(formData.end_date);

        const formToSend = new FormData();
        for (const key in formData) {
            formToSend.append(key, formData[key]);
        }
        formToSend.set("start_date", formattedStartDate);
        formToSend.set("end_date", formattedEndDate);

        if (supporting_doc && supporting_doc.length > 0) {
            supporting_doc.forEach((file) => {
                formToSend.append(`supporting_doc`, file);
            });
        } else {
            console.log("No files selected for supporting_doc");
        }

        try {
            const res = await api.post("/api/createleaves/", formToSend, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (res.status >= 200 && res.status < 300) {
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Leave request submitted successfully!",
                });
                localStorage.removeItem('leaveFormDraft');
                setFormData(prevData => ({
                    ...prevData,
                    department: "Computer Science", 
                    leave_type: "", 
                    start_date: "",
                    end_date: "", 
                    reason_leave: "", 
                    leave_status: "Pending"
                }));
                setSelectedFile([]);
                setSaveStatus('');
            } else {
                Swal.fire({
                    icon: "error", title: "Submission Failed", text: res.data.message || "Server error",
                });
            }
        } catch (error) {
            console.error('Network or API Error:', error);
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
                            name="employee_name"
                            value={formData.employee_name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={classes['form-group']}>
                        <label htmlFor="employeeId">Employee ID</label>
                        <input
                            disabled
                            type="text"
                            id="employeeId"
                            name="employee_id"
                            value={formData.employee_id}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                
                <div className={classes['form-grid']}>
                    <div className={classes['form-group']}>
                        <label htmlFor="employeeEmail">Employee Email</label>
                        <input
                            disabled
                            type="text"
                            id="employeeEmail"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required/>
                    </div>
                    <div className={classes['form-group']}>
                        <label htmlFor="phoneNumber">Phone Number</label>
                        <input
                            disabled
                            type="tel"
                            id="phoneNumber"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            required/>
                    </div>
                </div>

                <div className={classes['form-group']}>
                    <label htmlFor="department">Department</label>
                    <select
                        id="department"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
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
                            name="start_date"
                            value={formData.start_date}
                            onChange={handleChange}
                            min={new Date().toISOString().split("T")[0]}
                            required
                        />
                    </div>
                    <div className={classes['form-group']}>
                        <label htmlFor="endDate">End Date</label>
                        <input
                            type="date"
                            id="endDate"
                            name="end_date"
                            value={formData.end_date}
                            onChange={handleChange}
                            min={formData.start_date || new Date().toISOString().split("T")[0]}
                            required
                        />
                    </div>
                </div>
                <div className={classes['form-group']}>
                    <label htmlFor="leaveType">Leave Type</label>
                    <select
                        id="leaveType"
                        name="leave_type"
                        value={formData.leave_type}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select a Leave Type</option>
                        <option value="Vacation Leave">Vacation Leave</option>
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
                        name="reason_leave"
                        value={formData.reason_leave}
                        onChange={handleChange}
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
                        name="supporting_doc"
                        className={classes['file-input-hidden']}
                        onChange={handleFileChange}
                        multiple 
                    />
                    <label htmlFor="supportingDocuments" className={classes['attach-file-label']}>
                        <span className={classes.icon}>&#128206;</span>
                        Attach File***
                    </label>
                    {supporting_doc.length > 0 && (
                        <div className={classes['selected-file-list']}>
                            <p>Selected Files:</p>
                            <ul>
                                {supporting_doc.map((file, index) => (
                                    <li key={index}>{file.name}</li>
                                ))}
                            </ul>
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
}

export default LeaveRequestForm;