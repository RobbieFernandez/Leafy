import React from 'react';

interface TooltipLabelProps {
    label: string;
    tooltipText: string;
}

const TooltipLabel = (props: TooltipLabelProps) => <div className="tooltip-label-wrapper">
    <label className="label">{props.label}</label>
    <div className='tooltip-icon-wrapper'>
        <i className="fas fa-info-circle info tooltip-icon has-text-primary"></i>
        <div className='tooltip-content has-text-centered'>
            {props.tooltipText}
        </div>
    </div>
</div>

export default TooltipLabel;
