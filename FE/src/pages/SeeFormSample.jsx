//Phan nay chua co xai dau, co spring boot moi xai dc 

import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function IncomingSamples() {
    const [samples, setSamples] = useState([]);

    useEffect(() => {
        axios.get('/api/staff/incoming-samples')
            .then(res => setSamples(res.data));
    }, []);

    return (
        <div>
            <h2>Samples from Users</h2>
            <ul>
                {samples.map((s, idx) => (
                    <li key={idx}>
                        {s.source} - {s.name} - {s.date}
                    </li>
                ))}
            </ul>
        </div>
    );
}
