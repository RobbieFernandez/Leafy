import React from 'react';

export const LoadingOverlay = (props) => <div className="is-overlay level has-text-centered disabled-overlay" style={{ display: 'flex' }}>
    <div className="container has-text-centered" style={{ display: 'flex', flexDirection: 'column', margin: 'auto' }}>
        <i className="fas fa-circle-notch fa-spin is-size-1"></i>
    </div>
</div>