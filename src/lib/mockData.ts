import { User, Organization, Profile, Tag, ContactRequest, Experience } from '@/types/app.types'

// Mock Organizations
export const mockOrganizations: Organization[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'InoPeak Technologies',
    type: 'owner',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'TechPartner A',
    type: 'partner',
    created_at: '2024-01-15T00:00:00Z'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    name: 'ConsultCorp B',
    type: 'partner',
    created_at: '2024-02-01T00:00:00Z'
  }
]

// Mock Users
export const mockUsers: User[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440011',
    email: 'admin@inopeak.com',
    name: 'System Admin',
    role: 'owner',
    organization_id: '550e8400-e29b-41d4-a716-446655440001',
    organization: mockOrganizations[0],
    created_at: '2024-01-01T00:00:00Z',
    last_login_at: '2024-01-20T10:30:00Z'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440012',
    email: 'manager@techpartner.com',
    name: 'Partner Manager',
    role: 'partner_admin',
    organization_id: '550e8400-e29b-41d4-a716-446655440002',
    organization: mockOrganizations[1],
    created_at: '2024-01-15T00:00:00Z',
    last_login_at: '2024-01-20T09:15:00Z'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440013',
    email: 'lead@consultcorp.com',
    name: 'Consultant Lead',
    role: 'partner_admin',
    organization_id: '550e8400-e29b-41d4-a716-446655440003',
    organization: mockOrganizations[2],
    created_at: '2024-02-01T00:00:00Z',
    last_login_at: '2024-01-20T08:45:00Z'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440014',
    email: 'dev@techpartner.com',
    name: 'Developer',
    role: 'partner_user',
    organization_id: '550e8400-e29b-41d4-a716-446655440002',
    organization: mockOrganizations[1],
    created_at: '2024-01-20T00:00:00Z',
    last_login_at: '2024-01-20T11:20:00Z'
  }
]

// Mock Tags
export const mockTags: Tag[] = [
  // Modules
  { id: '1', category: 'module', key: 'SAP-MM', display: 'SAP Material Management', active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: '2', category: 'module', key: 'SAP-FI', display: 'SAP Financial Accounting', active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: '3', category: 'module', key: 'SAP-SD', display: 'SAP Sales & Distribution', active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: '4', category: 'module', key: 'SAP-QM', display: 'SAP Quality Management', active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: '5', category: 'module', key: 'SAP-PP', display: 'SAP Production Planning', active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: '6', category: 'module', key: 'SAP-CO', display: 'SAP Controlling', active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: '7', category: 'module', key: 'SAP-BW', display: 'SAP Business Warehouse', active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: '8', category: 'module', key: 'SAP-HCM', display: 'SAP Human Capital Management', active: true, created_at: '2024-01-01T00:00:00Z' },
  
  // Technologies
  { id: '11', category: 'tech', key: 'ABAP-OO', display: 'ABAP Object Oriented', active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: '12', category: 'tech', key: 'RAP', display: 'RESTful ABAP Programming', active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: '13', category: 'tech', key: 'CDS', display: 'Core Data Services', active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: '14', category: 'tech', key: 'BTP', display: 'SAP Business Technology Platform', active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: '15', category: 'tech', key: 'Fiori', display: 'SAP Fiori', active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: '16', category: 'tech', key: 'OData', display: 'Open Data Protocol', active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: '17', category: 'tech', key: 'SmartForms', display: 'SAP Smart Forms', active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: '18', category: 'tech', key: 'AdobeForms', display: 'Adobe Forms', active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: '19', category: 'tech', key: 'IDoc', display: 'Intermediate Document', active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: '20', category: 'tech', key: 'SolMan', display: 'Solution Manager', active: true, created_at: '2024-01-01T00:00:00Z' },
  
  // Roles
  { id: '21', category: 'role', key: 'Lead', display: 'Team Lead', active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: '22', category: 'role', key: 'Senior', display: 'Senior Developer', active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: '23', category: 'role', key: 'Mid', display: 'Mid-level Developer', active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: '24', category: 'role', key: 'Junior', display: 'Junior Developer', active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: '25', category: 'role', key: 'Consultant', display: 'Consultant', active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: '26', category: 'role', key: 'Developer', display: 'Developer', active: true, created_at: '2024-01-01T00:00:00Z' },
  
  // Scopes
  { id: '31', category: 'scope', key: 'FullCycle', display: 'Full Cycle Development', active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: '32', category: 'scope', key: 'Support', display: 'Support & Maintenance', active: true, created_at: '2024-01-01T00:00:00Z' },
  
  // Sectors
  { id: '41', category: 'sector', key: 'Pharma', display: 'Pharmaceutical', active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: '42', category: 'sector', key: 'E-Commerce', display: 'E-Commerce', active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: '43', category: 'sector', key: 'Automotive', display: 'Automotive', active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: '44', category: 'sector', key: 'Finance', display: 'Financial Services', active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: '45', category: 'sector', key: 'Retail', display: 'Retail', active: true, created_at: '2024-01-01T00:00:00Z' },
  
  // Languages
  { id: '51', category: 'lang', key: 'TR-Native', display: 'Turkish (Native)', active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: '52', category: 'lang', key: 'EN-B1', display: 'English (B1)', active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: '53', category: 'lang', key: 'EN-B2', display: 'English (B2)', active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: '54', category: 'lang', key: 'EN-C1', display: 'English (C1)', active: true, created_at: '2024-01-01T00:00:00Z' },
  
  // Levels
  { id: '61', category: 'level', key: '1y+', display: '1+ Years Experience', active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: '62', category: 'level', key: '3y+', display: '3+ Years Experience', active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: '63', category: 'level', key: '5y+', display: '5+ Years Experience', active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: '64', category: 'level', key: '8y+', display: '8+ Years Experience', active: true, created_at: '2024-01-01T00:00:00Z' }
]

// Mock Experiences
export const mockExperiences: Experience[] = [
  {
    id: '1',
    profile_id: '101',
    project_name: 'ERP Modernization Project',
    client_name: 'Global Pharma Corp',
    role: 'Senior',
    start_date: '2022-01-01',
    end_date: '2023-06-30',
    duration_months: 18,
    scope: 'FullCycle',
    tech_modules: ['SAP-MM', 'SAP-FI', 'Fiori', 'BTP'],
    highlights: 'Led the development of custom Fiori apps for procurement processes',
    work_model: 'Hybrid',
    created_at: '2022-01-01T00:00:00Z'
  },
  {
    id: '2',
    profile_id: '101',
    project_name: 'S/4HANA Migration',
    client_name: 'Tech Manufacturing Ltd',
    role: 'Senior',
    start_date: '2023-07-01',
    end_date: null,
    duration_months: null,
    scope: 'FullCycle',
    tech_modules: ['SAP-MM', 'ABAP-OO', 'CDS'],
    highlights: 'Currently working on S/4HANA conversion project',
    work_model: 'Remote',
    created_at: '2023-07-01T00:00:00Z'
  },
  {
    id: '3',
    profile_id: '102',
    project_name: 'Sales Process Optimization',
    client_name: 'Retail Chain Inc',
    role: 'Consultant',
    start_date: '2021-03-01',
    end_date: '2022-08-31',
    duration_months: 18,
    scope: 'Support',
    tech_modules: ['SAP-SD', 'SAP-MM'],
    highlights: 'Optimized order-to-cash processes resulting in 20% efficiency gain',
    work_model: 'Onsite',
    created_at: '2021-03-01T00:00:00Z'
  }
]

// Mock Profiles
export const mockProfiles: Profile[] = [
  {
    id: '101',
    organization_id: '550e8400-e29b-41d4-a716-446655440001',
    organization: mockOrganizations[0],
    first_name: 'Ahmet',
    last_name: 'Yılmaz',
    email: 'ahmet.yilmaz@inopeak.com',
    phone: '+90 532 123 4567',
    city: 'İstanbul',
    country: 'Turkey',
    title: 'Senior SAP ABAP Developer',
    seniority_years: 5,
    work_scope: 'FullCycle',
    summary: 'Experienced SAP ABAP developer with expertise in Fiori and BTP development. Strong background in MM and FI modules.',
    visibility_level: 'public_masked',
    status: 'published',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-20T10:00:00Z',
    experiences: [mockExperiences[0], mockExperiences[1]],
    tags: [
      mockTags[0], // SAP-MM
      mockTags[1], // SAP-FI
      mockTags[10], // ABAP-OO
      mockTags[13], // BTP
      mockTags[14], // Fiori
      mockTags[21], // Senior
      mockTags[30], // FullCycle (index 30)
      mockTags[40], // Pharma (index 40)
      mockTags[50], // TR-Native (index 50)
      mockTags[52], // EN-B2 (index 52)
      mockTags[62]  // 5y+ (index 62)
    ]
  },
  {
    id: '102',
    organization_id: '550e8400-e29b-41d4-a716-446655440001',
    organization: mockOrganizations[0],
    first_name: 'Zeynep',
    last_name: 'Kaya',
    email: 'zeynep.kaya@inopeak.com',
    phone: '+90 532 234 5678',
    city: 'Ankara',
    country: 'Turkey',
    title: 'SAP Functional Consultant',
    seniority_years: 3,
    work_scope: 'Support',
    summary: 'Functional consultant specializing in SAP SD and MM modules with strong business process knowledge.',
    visibility_level: 'public_masked',
    status: 'published',
    created_at: '2024-01-05T00:00:00Z',
    updated_at: '2024-01-19T15:30:00Z',
    experiences: [mockExperiences[2]],
    tags: [
      mockTags[0], // SAP-MM
      mockTags[2], // SAP-SD
      mockTags[24], // Consultant
      mockTags[31], // Support
      mockTags[44], // Retail
      mockTags[50], // TR-Native
      mockTags[51], // EN-B1
      mockTags[61]  // 3y+
    ]
  },
  {
    id: '103',
    organization_id: '550e8400-e29b-41d4-a716-446655440002',
    organization: mockOrganizations[1],
    first_name: 'Mehmet',
    last_name: 'Demir',
    email: 'mehmet.demir@techpartner.com',
    phone: '+90 532 345 6789',
    city: 'İzmir',
    country: 'Turkey',
    title: 'SAP Technical Lead',
    seniority_years: 8,
    work_scope: 'FullCycle',
    summary: 'Technical lead with extensive experience in SAP development and team management. Expert in ABAP OO and RAP.',
    visibility_level: 'public_masked',
    status: 'published',
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-20T09:00:00Z',
    experiences: [],
    tags: [
      mockTags[10], // ABAP-OO
      mockTags[11], // RAP
      mockTags[13], // BTP
      mockTags[14], // Fiori
      mockTags[20], // Lead
      mockTags[30], // FullCycle
      mockTags[43], // Finance
      mockTags[50], // TR-Native
      mockTags[53], // EN-C1
      mockTags[63]  // 8y+
    ]
  },
  {
    id: '104',
    organization_id: '550e8400-e29b-41d4-a716-446655440002',
    organization: mockOrganizations[1],
    first_name: 'Ayşe',
    last_name: 'Özkan',
    email: 'ayse.ozkan@techpartner.com',
    phone: '+90 532 456 7890',
    city: 'Bursa',
    country: 'Turkey',
    title: 'SAP BW Analyst',
    seniority_years: 4,
    work_scope: 'Support',
    summary: 'Business Warehouse specialist with strong analytical skills and experience in data modeling.',
    visibility_level: 'public_masked',
    status: 'published',
    created_at: '2024-01-20T00:00:00Z',
    updated_at: '2024-01-20T11:00:00Z',
    experiences: [],
    tags: [
      mockTags[6], // SAP-BW
      mockTags[12], // CDS
      mockTags[22], // Mid
      mockTags[31], // Support
      mockTags[41], // E-Commerce
      mockTags[50], // TR-Native
      mockTags[52], // EN-B2
      mockTags[61]  // 3y+
    ]
  },
  {
    id: '105',
    organization_id: '550e8400-e29b-41d4-a716-446655440003',
    organization: mockOrganizations[2],
    first_name: 'Can',
    last_name: 'Şen',
    email: 'can.sen@consultcorp.com',
    phone: '+90 532 567 8901',
    city: 'Antalya',
    country: 'Turkey',
    title: 'SAP Fiori Developer',
    seniority_years: 6,
    work_scope: 'FullCycle',
    summary: 'Frontend developer specializing in SAP Fiori applications with strong UX/UI skills and BTP knowledge.',
    visibility_level: 'public_masked',
    status: 'published',
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2024-01-20T08:00:00Z',
    experiences: [],
    tags: [
      mockTags[13], // BTP
      mockTags[14], // Fiori
      mockTags[15], // OData
      mockTags[21], // Senior
      mockTags[30], // FullCycle
      mockTags[42], // Automotive
      mockTags[50], // TR-Native
      mockTags[53], // EN-C1
      mockTags[62]  // 5y+
    ]
  },
  {
    id: '106',
    organization_id: '550e8400-e29b-41d4-a716-446655440003',
    organization: mockOrganizations[2],
    first_name: 'Elif',
    last_name: 'Aydın',
    email: 'elif.aydin@consultcorp.com',
    phone: '+90 532 678 9012',
    city: 'Adana',
    country: 'Turkey',
    title: 'Junior SAP Developer',
    seniority_years: 2,
    work_scope: 'Support',
    summary: 'Junior developer with foundation in ABAP programming and eager to learn new technologies.',
    visibility_level: 'public_masked',
    status: 'published',
    created_at: '2024-02-05T00:00:00Z',
    updated_at: '2024-01-20T12:00:00Z',
    experiences: [],
    tags: [
      mockTags[10], // ABAP-OO
      mockTags[23], // Junior
      mockTags[31], // Support
      mockTags[50], // TR-Native
      mockTags[51], // EN-B1
      mockTags[60]  // 1y+
    ]
  }
]

// Mock Contact Requests
export const mockContactRequests: ContactRequest[] = [
  {
    id: '1',
    requester_email: 'hr@globalcorp.com',
    notes: 'Looking for senior SAP developers with Fiori experience for a 6-month project.',
    filters: {
      modules: ['SAP-MM', 'SAP-FI'],
      techs: ['Fiori', 'BTP'],
      seniority_min: 3
    },
    profile_refs: ['101', '105'],
    created_at: '2024-01-18T14:30:00Z',
    handled_by: null,
    status: 'open'
  },
  {
    id: '2',
    requester_email: 'projects@techsolutions.com',
    notes: 'Need functional consultants for SD module implementation.',
    filters: {
      modules: ['SAP-SD'],
      roles: ['Consultant'],
      scope: ['Support']
    },
    profile_refs: ['102'],
    created_at: '2024-01-19T10:15:00Z',
    handled_by: '550e8400-e29b-41d4-a716-446655440011',
    status: 'in_progress'
  }
]

// Demo login credentials
export const demoCredentials = {
  'admin@inopeak.com': { password: 'admin123', user: mockUsers[0] },
  'manager@techpartner.com': { password: 'manager123', user: mockUsers[1] },
  'lead@consultcorp.com': { password: 'lead123', user: mockUsers[2] },
  'dev@techpartner.com': { password: 'dev123', user: mockUsers[3] }
}
