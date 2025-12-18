import { Estate, Unit, UserRole, User, ServiceRequest } from './types';

export const MOCK_ESTATES: Estate[] = [
  { id: 'e1', name: 'BAMK Estate', location: 'Baramulla', totalArea: 50000, establishedDate: '1995-04-12' },
  { id: 'e2', name: 'HMT Estate', location: 'Zainakote', totalArea: 120000, establishedDate: '1982-08-20' },
  { id: 'e3', name: 'Sanat Nagar Estate', location: 'Srinagar', totalArea: 85000, establishedDate: '2001-01-15' },
];

export const MOCK_UNITS: Unit[] = [
  {
    id: 'u1',
    estateId: 'e1',
    name: 'Alpine Woodworks',
    proprietorName: 'Bashir Ahmed',
    lineOfActivity: 'Furniture Manufacturing',
    constitution: 'Proprietorship',
    employeeCount: 15,
    contactEmail: 'bashir@alpine.com',
    contactPhone: '+91 9900112233',
    leaseDeedDate: '2020-01-01',
    leaseDurationYears: 10,
    rentAgreementDate: '2023-01-01',
    monthlyRent: 15000,
    rentStatus: 'PAID',
    lastRentPaymentDate: '2024-05-05',
    history: [
      { id: 'h1', date: '2022-03-10', type: 'NAME_CHANGE', description: 'Changed from Bashir Carpentry to Alpine Woodworks' }
    ],
    rentHistory: [
      { id: 'p1', date: '2024-05-05', amount: 15000, status: 'PAID', receiptNumber: 'RCP-1024', period: 'May 2024' },
      { id: 'p2', date: '2024-04-02', amount: 15000, status: 'PAID', receiptNumber: 'RCP-0912', period: 'April 2024' },
      { id: 'p3', date: '2024-03-05', amount: 15000, status: 'PAID', receiptNumber: 'RCP-0855', period: 'March 2024' },
    ]
  },
  {
    id: 'u2',
    estateId: 'e2',
    name: 'Himalayan Steel Industries',
    proprietorName: 'Rahul Sharma',
    lineOfActivity: 'Steel Fabrication',
    constitution: 'Private Limited',
    employeeCount: 45,
    contactEmail: 'rahul@himalayansteel.com',
    contactPhone: '+91 9876543210',
    leaseDeedDate: '2015-06-15',
    leaseDurationYears: 20,
    rentAgreementDate: '2015-06-15',
    monthlyRent: 25000,
    rentStatus: 'OVERDUE',
    lastRentPaymentDate: '2024-02-28',
    history: [],
    rentHistory: [
      { id: 'p4', date: '2024-02-28', amount: 25000, status: 'PAID', receiptNumber: 'RCP-0789', period: 'February 2024' },
      { id: 'p5', date: '2024-01-15', amount: 25000, status: 'PAID', receiptNumber: 'RCP-0655', period: 'January 2024' },
    ]
  },
  {
    id: 'u3',
    estateId: 'e2',
    name: 'Kashmir Tex Looms',
    proprietorName: 'Sarah Khan',
    lineOfActivity: 'Textile Weaving',
    constitution: 'Partnership',
    employeeCount: 120,
    contactEmail: 'sarah@kashmirtex.com',
    contactPhone: '+91 7006005004',
    leaseDeedDate: '2018-09-01',
    leaseDurationYears: 15,
    rentAgreementDate: '2018-09-01',
    monthlyRent: 40000,
    rentStatus: 'PAID',
    lastRentPaymentDate: '2024-05-10',
    history: [
       { id: 'h2', date: '2020-01-01', type: 'CONSTITUTION_CHANGE', description: 'Converted from Proprietorship to Partnership' }
    ],
    rentHistory: [
      { id: 'p6', date: '2024-05-10', amount: 40000, status: 'PAID', receiptNumber: 'RCP-1044', period: 'May 2024' },
      { id: 'p7', date: '2024-04-12', amount: 40000, status: 'PAID', receiptNumber: 'RCP-0922', period: 'April 2024' },
    ]
  },
  {
    id: 'u4',
    estateId: 'e3',
    name: 'Green Valley Agro',
    proprietorName: 'Mohammad Yusuf',
    lineOfActivity: 'Food Processing',
    constitution: 'Proprietorship',
    employeeCount: 25,
    contactEmail: 'yusuf@greenvalley.com',
    contactPhone: '+91 8899776655',
    leaseDeedDate: '2021-11-20',
    leaseDurationYears: 10,
    rentAgreementDate: '2021-11-20',
    monthlyRent: 18000,
    rentStatus: 'PENDING',
    lastRentPaymentDate: '2024-04-15',
    history: [],
    rentHistory: []
  },
    {
    id: 'u5',
    estateId: 'e1',
    name: 'Northern Plastics',
    proprietorName: 'Amit Verma',
    lineOfActivity: 'Plastic Molding',
    constitution: 'Proprietorship',
    employeeCount: 8,
    contactEmail: 'amit@nplastics.com',
    contactPhone: '+91 9988776655',
    leaseDeedDate: '2019-05-10',
    leaseDurationYears: 10,
    rentAgreementDate: '2022-05-10',
    monthlyRent: 12000,
    rentStatus: 'PAID',
    lastRentPaymentDate: '2024-05-02',
    history: [],
    rentHistory: [
      { id: 'p8', date: '2024-05-02', amount: 12000, status: 'PAID', receiptNumber: 'RCP-1011', period: 'May 2024' }
    ]
  }
];

export const MOCK_USERS: User[] = [
  {
    id: 'admin1',
    username: 'admin',
    password: 'password',
    name: 'System Admin',
    role: UserRole.ADMIN
  },
  {
    id: 'manager1',
    username: 'manager_bamk',
    password: 'password',
    name: 'Manager BAMK',
    role: UserRole.MANAGER,
    assignedEstateIds: ['e1']
  },
  {
    id: 'manager2',
    username: 'manager_hmt',
    password: 'password',
    name: 'Manager HMT',
    role: UserRole.MANAGER,
    assignedEstateIds: ['e2']
  },
  {
    id: 'user_u1',
    username: 'alpine',
    password: 'password',
    name: 'Bashir Ahmed',
    role: UserRole.UNIT_HOLDER,
    assignedUnitId: 'u1'
  }
];

export const MOCK_REQUESTS: ServiceRequest[] = [
  {
    id: 'req1',
    targetId: 'u1',
    targetName: 'Alpine Woodworks',
    estateId: 'e1',
    type: 'NAME_CHANGE',
    status: 'SUBMITTED_TO_MANAGER',
    description: 'Requesting to change unit name to "Alpine Global Exports"',
    requestDate: '2024-05-20',
    requesterRole: UserRole.UNIT_HOLDER,
    payload: { name: "Alpine Global Exports" },
    documentName: 'name_change_affidavit.pdf'
  },
  {
    id: 'req2',
    targetId: 'u3',
    targetName: 'Kashmir Tex Looms',
    estateId: 'e2',
    type: 'LEASE_RENEWAL',
    status: 'APPROVED',
    description: 'Renewal of lease for another 10 years.',
    requestDate: '2024-01-15',
    comments: 'Approved by board meeting Jan 2024.',
    requesterRole: UserRole.UNIT_HOLDER,
    documentName: 'renewal_application.pdf'
  },
  {
    id: 'req3',
    targetId: 'temp_new_1',
    targetName: 'New Horizon Foods',
    estateId: 'e3',
    type: 'NEW_UNIT',
    status: 'FORWARDED_TO_ADMIN',
    description: 'Registration of new food processing unit in Sanat Nagar.',
    requestDate: '2024-05-22',
    requesterRole: UserRole.MANAGER,
    payload: {
      estateId: 'e3',
      name: 'New Horizon Foods',
      proprietorName: 'Abdul Rashid',
      lineOfActivity: 'Spices',
      employeeCount: 10,
      monthlyRent: 10000,
      contactPhone: '9999999999',
      contactEmail: 'contact@horizon.com',
      rentStatus: 'PENDING',
      leaseDurationYears: 5
    },
    managerRemarks: 'Verified all initial documents. Recommended for allotment.'
  }
];