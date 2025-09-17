-- Seed data for SkillMap application
-- This file contains initial data for development and testing

-- Insert Organizations
INSERT INTO organizations (id, name, type) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'InoPeak Technologies', 'owner'),
  ('550e8400-e29b-41d4-a716-446655440002', 'TechPartner A', 'partner'),
  ('550e8400-e29b-41d4-a716-446655440003', 'ConsultCorp B', 'partner');

-- Insert Users
INSERT INTO users (id, email, name, role, organization_id) VALUES
  ('550e8400-e29b-41d4-a716-446655440011', 'admin@inopeak.com', 'System Admin', 'owner', '550e8400-e29b-41d4-a716-446655440001'),
  ('550e8400-e29b-41d4-a716-446655440012', 'manager@techpartner.com', 'Partner Manager', 'partner_admin', '550e8400-e29b-41d4-a716-446655440002'),
  ('550e8400-e29b-41d4-a716-446655440013', 'lead@consultcorp.com', 'Consultant Lead', 'partner_admin', '550e8400-e29b-41d4-a716-446655440003'),
  ('550e8400-e29b-41d4-a716-446655440014', 'dev@techpartner.com', 'Developer', 'partner_user', '550e8400-e29b-41d4-a716-446655440002'),
  ('550e8400-e29b-41d4-a716-446655440015', 'consultant@consultcorp.com', 'Senior Consultant', 'partner_user', '550e8400-e29b-41d4-a716-446655440003');

-- Insert Tags
INSERT INTO tags (id, category, key, display) VALUES
  -- Modules
  ('550e8400-e29b-41d4-a716-446655440021', 'module', 'SAP-MM', 'SAP Material Management'),
  ('550e8400-e29b-41d4-a716-446655440022', 'module', 'SAP-FI', 'SAP Financial Accounting'),
  ('550e8400-e29b-41d4-a716-446655440023', 'module', 'SAP-SD', 'SAP Sales & Distribution'),
  ('550e8400-e29b-41d4-a716-446655440024', 'module', 'SAP-QM', 'SAP Quality Management'),
  ('550e8400-e29b-41d4-a716-446655440025', 'module', 'SAP-PP', 'SAP Production Planning'),
  ('550e8400-e29b-41d4-a716-446655440026', 'module', 'SAP-CO', 'SAP Controlling'),
  ('550e8400-e29b-41d4-a716-446655440027', 'module', 'SAP-BW', 'SAP Business Warehouse'),
  ('550e8400-e29b-41d4-a716-446655440028', 'module', 'SAP-HCM', 'SAP Human Capital Management'),
  
  -- Technologies
  ('550e8400-e29b-41d4-a716-446655440031', 'tech', 'ABAP-OO', 'ABAP Object Oriented'),
  ('550e8400-e29b-41d4-a716-446655440032', 'tech', 'RAP', 'RESTful ABAP Programming'),
  ('550e8400-e29b-41d4-a716-446655440033', 'tech', 'CDS', 'Core Data Services'),
  ('550e8400-e29b-41d4-a716-446655440034', 'tech', 'BTP', 'SAP Business Technology Platform'),
  ('550e8400-e29b-41d4-a716-446655440035', 'tech', 'Fiori', 'SAP Fiori'),
  ('550e8400-e29b-41d4-a716-446655440036', 'tech', 'OData', 'Open Data Protocol'),
  ('550e8400-e29b-41d4-a716-446655440037', 'tech', 'SmartForms', 'SAP Smart Forms'),
  ('550e8400-e29b-41d4-a716-446655440038', 'tech', 'AdobeForms', 'Adobe Forms'),
  ('550e8400-e29b-41d4-a716-446655440039', 'tech', 'IDoc', 'Intermediate Document'),
  ('550e8400-e29b-41d4-a716-446655440040', 'tech', 'SolMan', 'Solution Manager'),
  
  -- Roles
  ('550e8400-e29b-41d4-a716-446655440041', 'role', 'Lead', 'Team Lead'),
  ('550e8400-e29b-41d4-a716-446655440042', 'role', 'Senior', 'Senior Developer'),
  ('550e8400-e29b-41d4-a716-446655440043', 'role', 'Mid', 'Mid-level Developer'),
  ('550e8400-e29b-41d4-a716-446655440044', 'role', 'Junior', 'Junior Developer'),
  ('550e8400-e29b-41d4-a716-446655440045', 'role', 'Consultant', 'Consultant'),
  ('550e8400-e29b-41d4-a716-446655440046', 'role', 'Developer', 'Developer'),
  
  -- Scopes
  ('550e8400-e29b-41d4-a716-446655440051', 'scope', 'FullCycle', 'Full Cycle Development'),
  ('550e8400-e29b-41d4-a716-446655440052', 'scope', 'Support', 'Support & Maintenance'),
  
  -- Sectors
  ('550e8400-e29b-41d4-a716-446655440061', 'sector', 'Pharma', 'Pharmaceutical'),
  ('550e8400-e29b-41d4-a716-446655440062', 'sector', 'E-Commerce', 'E-Commerce'),
  ('550e8400-e29b-41d4-a716-446655440063', 'sector', 'Automotive', 'Automotive'),
  ('550e8400-e29b-41d4-a716-446655440064', 'sector', 'Finance', 'Financial Services'),
  ('550e8400-e29b-41d4-a716-446655440065', 'sector', 'Retail', 'Retail'),
  
  -- Languages
  ('550e8400-e29b-41d4-a716-446655440071', 'lang', 'TR-Native', 'Turkish (Native)'),
  ('550e8400-e29b-41d4-a716-446655440072', 'lang', 'EN-B1', 'English (B1)'),
  ('550e8400-e29b-41d4-a716-446655440073', 'lang', 'EN-B2', 'English (B2)'),
  ('550e8400-e29b-41d4-a716-446655440074', 'lang', 'EN-C1', 'English (C1)'),
  
  -- Levels
  ('550e8400-e29b-41d4-a716-446655440081', 'level', '1y+', '1+ Years Experience'),
  ('550e8400-e29b-41d4-a716-446655440082', 'level', '3y+', '3+ Years Experience'),
  ('550e8400-e29b-41d4-a716-446655440083', 'level', '5y+', '5+ Years Experience'),
  ('550e8400-e29b-41d4-a716-446655440084', 'level', '8y+', '8+ Years Experience');

-- Insert Profiles
INSERT INTO profiles (id, organization_id, first_name, last_name, email, phone, city, country, title, seniority_years, work_scope, summary, status) VALUES
  ('550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440001', 'Ahmet', 'Yılmaz', 'ahmet.yilmaz@inopeak.com', '+90 532 123 4567', 'İstanbul', 'Turkey', 'Senior SAP ABAP Developer', 5, 'FullCycle', 'Experienced SAP ABAP developer with expertise in Fiori and BTP development. Strong background in MM and FI modules.', 'published'),
  ('550e8400-e29b-41d4-a716-446655440102', '550e8400-e29b-41d4-a716-446655440001', 'Zeynep', 'Kaya', 'zeynep.kaya@inopeak.com', '+90 532 234 5678', 'Ankara', 'Turkey', 'SAP Functional Consultant', 3, 'Support', 'Functional consultant specializing in SAP SD and MM modules with strong business process knowledge.', 'published'),
  ('550e8400-e29b-41d4-a716-446655440103', '550e8400-e29b-41d4-a716-446655440002', 'Mehmet', 'Demir', 'mehmet.demir@techpartner.com', '+90 532 345 6789', 'İzmir', 'Turkey', 'SAP Technical Lead', 8, 'FullCycle', 'Technical lead with extensive experience in SAP development and team management. Expert in ABAP OO and RAP.', 'published'),
  ('550e8400-e29b-41d4-a716-446655440104', '550e8400-e29b-41d4-a716-446655440002', 'Ayşe', 'Özkan', 'ayse.ozkan@techpartner.com', '+90 532 456 7890', 'Bursa', 'Turkey', 'SAP BW Analyst', 4, 'Support', 'Business Warehouse specialist with strong analytical skills and experience in data modeling.', 'published'),
  ('550e8400-e29b-41d4-a716-446655440105', '550e8400-e29b-41d4-a716-446655440003', 'Can', 'Şen', 'can.sen@consultcorp.com', '+90 532 567 8901', 'Antalya', 'Turkey', 'SAP Fiori Developer', 6, 'FullCycle', 'Frontend developer specializing in SAP Fiori applications with strong UX/UI skills and BTP knowledge.', 'published'),
  ('550e8400-e29b-41d4-a716-446655440106', '550e8400-e29b-41d4-a716-446655440003', 'Elif', 'Aydın', 'elif.aydin@consultcorp.com', '+90 532 678 9012', 'Adana', 'Turkey', 'Junior SAP Developer', 2, 'Support', 'Junior developer with foundation in ABAP programming and eager to learn new technologies.', 'published');

-- Insert Experiences
INSERT INTO experiences (id, profile_id, project_name, client_name, role, start_date, end_date, scope, tech_modules, highlights, work_model) VALUES
  ('550e8400-e29b-41d4-a716-446655440201', '550e8400-e29b-41d4-a716-446655440101', 'ERP Modernization Project', 'Global Pharma Corp', 'Senior', '2022-01-01', '2023-06-30', 'FullCycle', ARRAY['SAP-MM', 'SAP-FI', 'Fiori', 'BTP'], 'Led the development of custom Fiori apps for procurement processes', 'Hybrid'),
  ('550e8400-e29b-41d4-a716-446655440202', '550e8400-e29b-41d4-a716-446655440101', 'S/4HANA Migration', 'Tech Manufacturing Ltd', 'Senior', '2023-07-01', NULL, 'FullCycle', ARRAY['SAP-MM', 'ABAP-OO', 'CDS'], 'Currently working on S/4HANA conversion project', 'Remote'),
  ('550e8400-e29b-41d4-a716-446655440203', '550e8400-e29b-41d4-a716-446655440102', 'Sales Process Optimization', 'Retail Chain Inc', 'Consultant', '2021-03-01', '2022-08-31', 'Support', ARRAY['SAP-SD', 'SAP-MM'], 'Optimized order-to-cash processes resulting in 20% efficiency gain', 'Onsite'),
  ('550e8400-e29b-41d4-a716-446655440204', '550e8400-e29b-41d4-a716-446655440103', 'Digital Transformation Initiative', 'Banking Solutions Co', 'Lead', '2020-01-01', '2022-12-31', 'FullCycle', ARRAY['ABAP-OO', 'RAP', 'BTP', 'Fiori'], 'Led a team of 8 developers in modernizing core banking systems', 'Hybrid'),
  ('550e8400-e29b-41d4-a716-446655440205', '550e8400-e29b-41d4-a716-446655440104', 'Business Intelligence Project', 'E-commerce Platform', 'Mid', '2022-06-01', '2023-12-31', 'Support', ARRAY['SAP-BW', 'CDS'], 'Developed comprehensive reporting solutions for sales analytics', 'Remote'),
  ('550e8400-e29b-41d4-a716-446655440206', '550e8400-e29b-41d4-a716-446655440105', 'User Experience Enhancement', 'Automotive Group', 'Senior', '2021-09-01', '2023-03-31', 'FullCycle', ARRAY['Fiori', 'BTP', 'OData'], 'Redesigned user interfaces improving user satisfaction by 40%', 'Hybrid');

-- Insert Profile Tags relationships
INSERT INTO profile_tags (profile_id, tag_id) VALUES
  -- Ahmet Yılmaz tags
  ('550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440021'), -- SAP-MM
  ('550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440022'), -- SAP-FI
  ('550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440031'), -- ABAP-OO
  ('550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440034'), -- BTP
  ('550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440035'), -- Fiori
  ('550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440042'), -- Senior
  ('550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440051'), -- FullCycle
  ('550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440061'), -- Pharma
  ('550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440071'), -- TR-Native
  ('550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440073'), -- EN-B2
  ('550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440083'), -- 5y+
  
  -- Zeynep Kaya tags
  ('550e8400-e29b-41d4-a716-446655440102', '550e8400-e29b-41d4-a716-446655440021'), -- SAP-MM
  ('550e8400-e29b-41d4-a716-446655440102', '550e8400-e29b-41d4-a716-446655440023'), -- SAP-SD
  ('550e8400-e29b-41d4-a716-446655440102', '550e8400-e29b-41d4-a716-446655440045'), -- Consultant
  ('550e8400-e29b-41d4-a716-446655440102', '550e8400-e29b-41d4-a716-446655440052'), -- Support
  ('550e8400-e29b-41d4-a716-446655440102', '550e8400-e29b-41d4-a716-446655440065'), -- Retail
  ('550e8400-e29b-41d4-a716-446655440102', '550e8400-e29b-41d4-a716-446655440071'), -- TR-Native
  ('550e8400-e29b-41d4-a716-446655440102', '550e8400-e29b-41d4-a716-446655440072'), -- EN-B1
  ('550e8400-e29b-41d4-a716-446655440102', '550e8400-e29b-41d4-a716-446655440082'), -- 3y+
  
  -- Mehmet Demir tags
  ('550e8400-e29b-41d4-a716-446655440103', '550e8400-e29b-41d4-a716-446655440031'), -- ABAP-OO
  ('550e8400-e29b-41d4-a716-446655440103', '550e8400-e29b-41d4-a716-446655440032'), -- RAP
  ('550e8400-e29b-41d4-a716-446655440103', '550e8400-e29b-41d4-a716-446655440034'), -- BTP
  ('550e8400-e29b-41d4-a716-446655440103', '550e8400-e29b-41d4-a716-446655440035'), -- Fiori
  ('550e8400-e29b-41d4-a716-446655440103', '550e8400-e29b-41d4-a716-446655440041'), -- Lead
  ('550e8400-e29b-41d4-a716-446655440103', '550e8400-e29b-41d4-a716-446655440051'), -- FullCycle
  ('550e8400-e29b-41d4-a716-446655440103', '550e8400-e29b-41d4-a716-446655440064'), -- Finance
  ('550e8400-e29b-41d4-a716-446655440103', '550e8400-e29b-41d4-a716-446655440071'), -- TR-Native
  ('550e8400-e29b-41d4-a716-446655440103', '550e8400-e29b-41d4-a716-446655440074'), -- EN-C1
  ('550e8400-e29b-41d4-a716-446655440103', '550e8400-e29b-41d4-a716-446655440084'), -- 8y+
  
  -- Ayşe Özkan tags
  ('550e8400-e29b-41d4-a716-446655440104', '550e8400-e29b-41d4-a716-446655440027'), -- SAP-BW
  ('550e8400-e29b-41d4-a716-446655440104', '550e8400-e29b-41d4-a716-446655440033'), -- CDS
  ('550e8400-e29b-41d4-a716-446655440104', '550e8400-e29b-41d4-a716-446655440043'), -- Mid
  ('550e8400-e29b-41d4-a716-446655440104', '550e8400-e29b-41d4-a716-446655440052'), -- Support
  ('550e8400-e29b-41d4-a716-446655440104', '550e8400-e29b-41d4-a716-446655440062'), -- E-Commerce
  ('550e8400-e29b-41d4-a716-446655440104', '550e8400-e29b-41d4-a716-446655440071'), -- TR-Native
  ('550e8400-e29b-41d4-a716-446655440104', '550e8400-e29b-41d4-a716-446655440073'), -- EN-B2
  ('550e8400-e29b-41d4-a716-446655440104', '550e8400-e29b-41d4-a716-446655440082'), -- 3y+
  
  -- Can Şen tags
  ('550e8400-e29b-41d4-a716-446655440105', '550e8400-e29b-41d4-a716-446655440034'), -- BTP
  ('550e8400-e29b-41d4-a716-446655440105', '550e8400-e29b-41d4-a716-446655440035'), -- Fiori
  ('550e8400-e29b-41d4-a716-446655440105', '550e8400-e29b-41d4-a716-446655440036'), -- OData
  ('550e8400-e29b-41d4-a716-446655440105', '550e8400-e29b-41d4-a716-446655440042'), -- Senior
  ('550e8400-e29b-41d4-a716-446655440105', '550e8400-e29b-41d4-a716-446655440051'), -- FullCycle
  ('550e8400-e29b-41d4-a716-446655440105', '550e8400-e29b-41d4-a716-446655440063'), -- Automotive
  ('550e8400-e29b-41d4-a716-446655440105', '550e8400-e29b-41d4-a716-446655440071'), -- TR-Native
  ('550e8400-e29b-41d4-a716-446655440105', '550e8400-e29b-41d4-a716-446655440074'), -- EN-C1
  ('550e8400-e29b-41d4-a716-446655440105', '550e8400-e29b-41d4-a716-446655440083'), -- 5y+
  
  -- Elif Aydın tags
  ('550e8400-e29b-41d4-a716-446655440106', '550e8400-e29b-41d4-a716-446655440031'), -- ABAP-OO
  ('550e8400-e29b-41d4-a716-446655440106', '550e8400-e29b-41d4-a716-446655440044'), -- Junior
  ('550e8400-e29b-41d4-a716-446655440106', '550e8400-e29b-41d4-a716-446655440052'), -- Support
  ('550e8400-e29b-41d4-a716-446655440106', '550e8400-e29b-41d4-a716-446655440071'), -- TR-Native
  ('550e8400-e29b-41d4-a716-446655440106', '550e8400-e29b-41d4-a716-446655440072'), -- EN-B1
  ('550e8400-e29b-41d4-a716-446655440106', '550e8400-e29b-41d4-a716-446655440081'); -- 1y+

-- Insert sample contact requests
INSERT INTO contact_requests (id, requester_email, notes, filters, profile_refs, status) VALUES
  ('550e8400-e29b-41d4-a716-446655440301', 'hr@globalcorp.com', 'Looking for senior SAP developers with Fiori experience for a 6-month project.', 
   '{"modules": ["SAP-MM", "SAP-FI"], "techs": ["Fiori", "BTP"], "seniority_min": 3}', 
   ARRAY['550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440105'], 'open'),
  ('550e8400-e29b-41d4-a716-446655440302', 'projects@techsolutions.com', 'Need functional consultants for SD module implementation.', 
   '{"modules": ["SAP-SD"], "roles": ["Consultant"], "scope": ["Support"]}', 
   ARRAY['550e8400-e29b-41d4-a716-446655440102'], 'in_progress');
