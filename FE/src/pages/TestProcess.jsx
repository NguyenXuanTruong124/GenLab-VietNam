//Phan nay chua co xai dau, co spring boot moi xai dc 

import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ManageTesting() {
    const [samples, setSamples] = useState([]);

    useEffect(() => {
        axios.get('/api/staff/samples') // Spring Boot backend
            .then(res => setSamples(res.data));
    }, []);

    const handleUpdate = (sampleId, updates) => {
        axios.put(`/api/staff/samples/${sampleId}`, updates)
            .then(() => alert("Updated"))
            .catch(err => console.error(err));
    };

    return (
        <div>
            <h2>Testing Process</h2>
            {samples.map((sample, idx) => (
                <div key={idx}>
                    <p>Sample ID: {sample.id}</p>
                    <p>Status: {sample.status}</p>
                    <button onClick={() => handleUpdate(sample.id, { status: 'Completed' })}>
                        Mark as Completed
                    </button>
                </div>
            ))}
        </div>
    );
}
