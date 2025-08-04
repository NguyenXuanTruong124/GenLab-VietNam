//Phan nay chua co xai dau, co spring boot moi xai dc 

import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function StaffSchedule() {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        axios.get('/api/staff/appointments') // Spring Boot endpoint
            .then(res => setAppointments(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="container">
            <h2>Manage Appointments</h2>
            <table>
                <thead>
                    <tr>
                        <th>Patient</th>
                        <th>Phone</th>
                        <th>Time</th>
                        <th>Type</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {appointments.map((apt, index) => (
                        <tr key={index}>
                            <td>{apt.name}</td>
                            <td>{apt.phone}</td>
                            <td>{apt.date}</td>
                            <td>{apt.testType}</td>
                            <td>{apt.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
