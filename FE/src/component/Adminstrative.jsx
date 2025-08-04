// lấy file ở đây 

import React from 'react';

export default function Adminstrative() {
    return (
        <div>
            <h3>Administrative Form</h3>
            <p>Click the link below to download and view the administrative form:</p>
            <a
                href="/files/Form.docx"
                download
                style={{ color: 'blue', textDecoration: 'underline' }}
            >
                Download Form.docx
            </a>
        </div>
    );
}
