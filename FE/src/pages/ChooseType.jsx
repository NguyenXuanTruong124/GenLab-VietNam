import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function ChooseType() {
    const navigate = useNavigate();
    const location = useLocation();
    const selectedService = location.state?.service;

    const handleCivilClick = () => {
        if (selectedService === 'facility') {
            navigate('/medical-facility');
        } else if (selectedService === 'home') {
            navigate('/home-sampling'); 
        } else if (selectedService === 'customer') {
            navigate('/send-sampling'); 
        } else {
            alert("Services are not support!!!");
        }
    };

    const handleAdminClick = () => {
        if (selectedService === 'facility') {
            navigate('/medical-facility');
        } else if (selectedService === 'home') {
            navigate('/home-sampling');
        } else if (selectedService === 'customer') {
            navigate('/send-sampling');
        } else {
            alert("Services are not support!!!");
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <h2>Bạn muốn giám định loại nào?</h2>
            <button onClick={handleCivilClick} style={{ margin: '1rem' }}>Dân sự</button>
            <button onClick={handleAdminClick} style={{ margin: '1rem' }}>Hành chính</button>
        </div>
    );
}
