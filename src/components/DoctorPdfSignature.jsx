import React from 'react';
import { toCorsSignatureUrl } from '../utils/imageUrl';

const TEXT_SIGNATURE_STYLE = {
    fontFamily: "'Great Vibes', 'Segoe Script', 'Snell Roundhand', 'Brush Script MT', cursive",
    fontSize: '30px',
    color: '#1a365d',
    fontStyle: 'italic',
    lineHeight: 1.2,
    padding: '6px 4px 4px',
    minWidth: '140px',
    display: 'inline-block',
    borderBottom: '1px solid #c3c6d6',
};

const DoctorPdfSignature = ({ signatureUrl, doctorName, accentColor = '#138C9F' }) => {
    const corsUrl = toCorsSignatureUrl(signatureUrl);

    return (
        <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '12px', fontWeight: '700', color: accentColor, marginBottom: '10px' }}>
                توقيع الطبيب المعالج
            </p>
            {corsUrl ? (
                <img
                    crossOrigin="anonymous"
                    src={corsUrl}
                    alt="توقيع الطبيب"
                    style={{ height: '56px', maxWidth: '220px', objectFit: 'contain', display: 'block' }}
                />
            ) : (
                <div style={TEXT_SIGNATURE_STYLE}>
                    {doctorName || 'الطبيب المعالج'}
                </div>
            )}
            <p style={{ fontSize: '12px', fontWeight: '700', color: '#333', marginTop: '5px' }}>
                {doctorName ? (doctorName.startsWith('د.') ? doctorName : `د. ${doctorName}`) : ''}
            </p>
        </div>
    );
};

export default DoctorPdfSignature;
