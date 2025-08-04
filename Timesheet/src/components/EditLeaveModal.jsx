import React, { useState, useEffect } from 'react';
import api from "../api";
import classes from '../assets/Modal/modal.module.css';

function EditLeaveModal({ leave, onClose, onSaveSuccess }) {

    const [formData, setFormData] = useState({
        employee_name: '',
        employee_id: '',
        department: '',
        leave_type: '',
        start_date: '',
        end_date: '',
        reason_leave: '',
        leave_status: '',
        supporting_doc: null,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (leave) {
            setFormData({
                employee_name: leave.employee_name || '',
                employee_id: leave.employee_id || '',
                email : leave.email || '',
                department: leave.department || '',
                leave_type: leave.leave_type || '',
                start_date: leave.start_date || '',
                end_date: leave.end_date || '',
                reason_leave: leave.reason_leave || '',
                leave_status: leave.leave_status || '',
                supporting_doc: leave.supporting_doc || null,
            });
        }
    }, [leave]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const dataToUpdate = { ...formData };
            // Remove supporting_doc from the payload as it's not being updated this way
            delete dataToUpdate.supporting_doc;

            console.log("---> " + dataToUpdate);

            await api.put(`/api/leaves/update/${leave.id}/`, dataToUpdate);
            alert('Leave request updated successfully!');
            onSaveSuccess();
            onClose();
        } catch (err) {
            console.error('Error updating leave:', err.response?.data || err.message);
            setError('Failed to update leave. Please check your inputs and try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!leave) return null;

    // Construct the full download URL here
    let fullDownloadUrl = null;
    let displayFileName = 'Document';

    if (formData.supporting_doc) {
        const cleanedDocPath = formData.supporting_doc.startsWith('/')
            ? formData.supporting_doc.substring(1)
            : formData.supporting_doc;

        fullDownloadUrl = `${cleanedDocPath}`;
        displayFileName = formData.supporting_doc.split('/').pop();
    }

    // Optional: Check if it's an image for inline preview
    const isImage = fullDownloadUrl &&
                    ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'].some(ext =>
                        fullDownloadUrl.toLowerCase().endsWith(ext)
                    );

    return (
        <div className={classes.modalBackdrop}>
            <div className={classes.modalContent}>
                <button className={classes.modalCloseBtn} onClick={onClose}>
                    &times;
                </button>
                <h2>Edit Leave Request</h2>
                {error && <p className={classes.modalError}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className={classes.formGroup}>
                        <label htmlFor="employee_name">Employee Name:</label>
                        <input
                            type="text"
                            id="employee_name"
                            name="employee_name"
                            value={formData.employee_name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={classes.formGroup}>
                        <label htmlFor="employee_id">Employee ID:</label>
                        <input
                            type="text"
                            id="employee_id"
                            name="employee_id"
                            value={formData.employee_id}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={classes.formGroup}>
                        <label htmlFor="department">Department:</label>
                        <input
                            type="text"
                            id="department"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={classes.formGroup}>
                        <label htmlFor="leave_type">Leave Type:</label>
                        <select
                            id="leave_type"
                            name="leave_type"
                            value={formData.leave_type}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Type</option>
                            <option value="Annual Leave">Annual Leave</option>
                            <option value="Sick Leave">Sick Leave</option>
                            <option value="Maternity Leave">Maternity Leave</option>
                            <option value="Paternity Leave">Paternity Leave</option>
                            <option value="Unpaid Leave">Unpaid Leave</option>
                        </select>
                    </div>
                    <div className={classes.formGroup}>
                        <label htmlFor="start_date">Start Date:</label>
                        <input
                            type="date"
                            id="start_date"
                            name="start_date"
                            value={formData.start_date}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={classes.formGroup}>
                        <label htmlFor="end_date">End Date:</label>
                        <input
                            type="date"
                            id="end_date"
                            name="end_date"
                            value={formData.end_date}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={classes.formGroup}>
                        <label htmlFor="reason_for_leave">Reason for Leave:</label>
                        <textarea
                            id="reason_for_leave"
                            name="reason_for_leave"
                            value={formData.reason_leave}
                            onChange={handleChange}
                            rows="4"
                            required
                        ></textarea>
                    </div>
                    <div className={classes.formGroup}>
                        <label htmlFor="leave_status">Leave Status:</label>
                        <select
                            id="leave_status"
                            name="leave_status"
                            value={formData.leave_status}
                            onChange={handleChange}
                            required
                        >
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>

                    {/* NEW: Display for Supporting Document */}
                    <div className={classes.formGroup}>
                        <label>Supporting Document:</label>
                        {fullDownloadUrl ? (
                            <div>
                                {isImage && (
                                    <img
                                        src={fullDownloadUrl}
                                        alt="Supporting Document Preview"
                                        style={{ maxWidth: '100%', height: 'auto', maxHeight: '200px', border: '1px solid #eee', marginBottom: '10px' }}
                                    />
                                )}
                                <p>
                                    <a
                                        href={fullDownloadUrl}
                                        download={displayFileName}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={classes.downloadLink}
                                    >
                                        Download Current Document: {displayFileName}
                                    </a>
                                </p>
                            </div>
                        ) : (
                            <p>No supporting document uploaded.</p>
                        )}
                    </div>

                    <button type="submit" className={classes.modalSubmitBtn} disabled={loading}>
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default EditLeaveModal;