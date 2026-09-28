import React from 'react';
import {
    ASSET_CONDITIONS,
    LIFECYCLE_STATUSES,
    COMPLAINT_STATUSES,
    PRIORITIES,
    MAINTENANCE_STATUSES,
} from '../../utils/constants';

const StatusBadge = ({ type, value }) => {
    let list = [];
    switch (type) {
        case 'condition':
            list = ASSET_CONDITIONS;
            break;
        case 'lifecycle':
            list = LIFECYCLE_STATUSES;
            break;
        case 'complaintStatus':
            list = COMPLAINT_STATUSES;
            break;
        case 'priority':
            list = PRIORITIES;
            break;
        case 'maintenanceStatus':
            list = MAINTENANCE_STATUSES;
            break;
        default:
            break;
    }

    const match = list.find((item) => item.value === value);
    const label = match ? match.label : value;
    const badgeClass = match
        ? match.badgeClass
        : 'bg-slate-100 text-slate-700 border-slate-200';

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badgeClass}`}
        >
            {label}
        </span>
    );
};

export default StatusBadge;
