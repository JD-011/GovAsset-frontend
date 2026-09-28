export const ROLES = {
    ADMIN: 'ADMIN',
    ASSET_MANAGER: 'ASSET_MANAGER',
    MAINTENANCE_STAFF: 'MAINTENANCE_STAFF',
    CITIZEN: 'CITIZEN',
};

export const ASSET_TYPES = [
    { value: 'OFFICE', label: 'Office Building' },
    { value: 'SCHOOL', label: 'Educational / School' },
    { value: 'HOSPITAL', label: 'Hospital / Healthcare Facility' },
];

export const ASSET_CONDITIONS = [
    { value: 'GOOD', label: 'Good', badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    { value: 'FAIR', label: 'Fair', badgeClass: 'bg-amber-100 text-amber-800 border-amber-200' },
    { value: 'POOR', label: 'Poor', badgeClass: 'bg-rose-100 text-rose-800 border-rose-200' },
];

export const LIFECYCLE_STATUSES = [
    { value: 'PLANNED', label: 'Planned', badgeClass: 'bg-slate-100 text-slate-800 border-slate-200' },
    { value: 'ACQUIRED', label: 'Acquired', badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
    { value: 'ACTIVE', label: 'Active', badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    { value: 'UNDER_MAINTENANCE', label: 'Under Maintenance', badgeClass: 'bg-amber-100 text-amber-800 border-amber-200' },
    { value: 'RETIRED', label: 'Retired', badgeClass: 'bg-purple-100 text-purple-800 border-purple-200' },
    { value: 'DISPOSED', label: 'Disposed', badgeClass: 'bg-gray-200 text-gray-700 border-gray-300' },
];

export const COMPLAINT_CATEGORIES = [
    { value: 'ELECTRICAL', label: 'Electrical' },
    { value: 'PLUMBING', label: 'Plumbing' },
    { value: 'CLEANLINESS', label: 'Cleanliness & Sanitation' },
    { value: 'STRUCTURAL', label: 'Structural / Repair' },
    { value: 'OTHER', label: 'Other Infrastructure Issue' },
];

export const COMPLAINT_STATUSES = [
    { value: 'SUBMITTED', label: 'Submitted', badgeClass: 'bg-blue-100 text-blue-800 border-blue-200' },
    { value: 'ASSIGNED', label: 'Assigned', badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
    { value: 'IN_PROGRESS', label: 'In Progress', badgeClass: 'bg-amber-100 text-amber-800 border-amber-200' },
    { value: 'RESOLVED', label: 'Resolved', badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    { value: 'CLOSED', label: 'Closed', badgeClass: 'bg-slate-100 text-slate-700 border-slate-200' },
];

export const PRIORITIES = [
    { value: 'LOW', label: 'Low', badgeClass: 'bg-slate-100 text-slate-700 border-slate-200' },
    { value: 'MEDIUM', label: 'Medium', badgeClass: 'bg-blue-100 text-blue-800 border-blue-200' },
    { value: 'HIGH', label: 'High', badgeClass: 'bg-orange-100 text-orange-800 border-orange-200' },
    { value: 'CRITICAL', label: 'Critical', badgeClass: 'bg-rose-100 text-rose-800 border-rose-200 font-semibold' },
];

export const MAINTENANCE_STATUSES = [
    { value: 'ASSIGNED', label: 'Assigned', badgeClass: 'bg-blue-100 text-blue-800 border-blue-200' },
    { value: 'IN_PROGRESS', label: 'In Progress', badgeClass: 'bg-amber-100 text-amber-800 border-amber-200' },
    { value: 'COMPLETED', label: 'Completed', badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
];
