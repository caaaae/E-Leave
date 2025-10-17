import React, { useEffect, useState } from 'react';

const CountdownTimer = ({ submissionTime }) => {
    const [timeLeft, setTimeLeft] = useState(null);

    useEffect(() => {
        if (!submissionTime) return;

        const interval = setInterval(() => {
            const now = new Date();
            const diff = submissionTime.getTime() + 3 * 24 * 60 * 60 * 1000 - now.getTime(); // 3 days in ms

            if (diff <= 0) {
                setTimeLeft('Time expired');
                clearInterval(interval);
            } else {
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((diff / (1000 * 60)) % 60);
                setTimeLeft(`${days}d ${hours}h ${minutes}m left to upload supporting documents`);
            }
        }, 60000); // update every 1 minute

        // Initial check
        const now = new Date();
        const diff = submissionTime.getTime() + 3 * 24 * 60 * 60 * 1000 - now.getTime();
        if (diff <= 0) {
            setTimeLeft('Time expired');
            clearInterval(interval);
        } else {
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            setTimeLeft(`${days}d ${hours}h ${minutes}m left to upload supporting documents`);
        }

        return () => clearInterval(interval);
    }, [submissionTime]);

    return (
        <div style={{ color: 'red', marginBottom: '10px' }}>
            {timeLeft && <p>{timeLeft}</p>}
        </div>
    );
};

export default CountdownTimer;
