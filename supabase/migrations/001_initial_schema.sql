  -- Enable necessary extensions
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  CREATE EXTENSION IF NOT EXISTS "pg_trgm";

  -- Create custom types
  CREATE TYPE organization_type AS ENUM ('owner', 'partner');
  CREATE TYPE user_role AS ENUM ('owner', 'partner_admin', 'partner_user');
  CREATE TYPE work_scope AS ENUM ('FullCycle', 'Support', 'Hybrid');
  CREATE TYPE experience_role AS ENUM ('Lead', 'Senior', 'Mid', 'Junior', 'Consultant', 'Developer');
  CREATE TYPE work_model AS ENUM ('Onsite', 'Remote', 'Hybrid');
  CREATE TYPE visibility_level AS ENUM ('public_masked', 'partners_masked', 'internal_full');
  CREATE TYPE profile_status AS ENUM ('draft', 'published', 'archived');
  CREATE TYPE contact_request_status AS ENUM ('open', 'in_progress', 'closed');
  CREATE TYPE tag_category AS ENUM ('module', 'tech', 'role', 'scope', 'sector', 'lang', 'level');

  -- Organizations table
  CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type organization_type NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  -- Users table
  CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE
  );

  -- Profiles table
  CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    city VARCHAR(100),
    country VARCHAR(100),
    title VARCHAR(255) NOT NULL,
    seniority_years INTEGER NOT NULL CHECK (seniority_years >= 0),
    work_scope work_scope NOT NULL,
    summary TEXT,
    visibility_level visibility_level NOT NULL DEFAULT 'public_masked',
    status profile_status NOT NULL DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  -- Experiences table
  CREATE TABLE experiences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    project_name VARCHAR(255) NOT NULL,
    client_name VARCHAR(255),
    role experience_role NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    duration_months INTEGER,
    scope work_scope NOT NULL,
    tech_modules TEXT[] NOT NULL DEFAULT '{}',
    highlights TEXT,
    work_model work_model NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_duration CHECK (
      (end_date IS NOT NULL AND duration_months IS NULL) OR
      (end_date IS NULL AND duration_months IS NOT NULL) OR
      (end_date IS NOT NULL AND duration_months IS NOT NULL)
    )
  );

  -- Tags table
  CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category tag_category NOT NULL,
    key VARCHAR(100) NOT NULL,
    display VARCHAR(255) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(category, key)
  );

  -- Profile Tags junction table
  CREATE TABLE profile_tags (
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    
    PRIMARY KEY (profile_id, tag_id)
  );

  -- Contact Requests table
  CREATE TABLE contact_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    requester_email VARCHAR(255) NOT NULL,
    notes TEXT,
    filters JSONB NOT NULL,
    profile_refs UUID[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    handled_by UUID REFERENCES users(id),
    status contact_request_status NOT NULL DEFAULT 'open'
  );

  -- Audit Logs table
  CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    entity VARCHAR(100) NOT NULL,
    entity_id UUID NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  -- Create indexes for better performance
  CREATE INDEX idx_users_organization_id ON users(organization_id);
  CREATE INDEX idx_users_email ON users(email);
  CREATE INDEX idx_profiles_organization_id ON profiles(organization_id);
  CREATE INDEX idx_profiles_status ON profiles(status);
  CREATE INDEX idx_profiles_updated_at ON profiles(updated_at);
  CREATE INDEX idx_profiles_seniority ON profiles(seniority_years);
  CREATE INDEX idx_experiences_profile_id ON experiences(profile_id);
  CREATE INDEX idx_experiences_start_date ON experiences(start_date);
  CREATE INDEX idx_profile_tags_profile_id ON profile_tags(profile_id);
  CREATE INDEX idx_profile_tags_tag_id ON profile_tags(tag_id);
  CREATE INDEX idx_tags_category ON tags(category);
  CREATE INDEX idx_tags_active ON tags(active);
  CREATE INDEX idx_contact_requests_status ON contact_requests(status);
  CREATE INDEX idx_contact_requests_created_at ON contact_requests(created_at);
  CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
  CREATE INDEX idx_audit_logs_entity ON audit_logs(entity, entity_id);

  -- Full-text search via generated columns (IMMUTABLE kısıtı için)
  ALTER TABLE profiles
    ADD COLUMN search_vector tsvector GENERATED ALWAYS AS (
      to_tsvector('turkish',
        coalesce(title, '') || ' ' ||
        coalesce(summary, '') || ' ' ||
        coalesce(first_name, '') || ' ' ||
        coalesce(last_name, '')
      )
    ) STORED;

  CREATE INDEX idx_profiles_search ON profiles USING gin(search_vector);

  ALTER TABLE experiences
    ADD COLUMN search_vector tsvector GENERATED ALWAYS AS (
      to_tsvector('turkish',
        coalesce(project_name, '') || ' ' ||
        coalesce(client_name, '') || ' ' ||
        coalesce(highlights, '') || ' ' ||
        array_to_string(tech_modules, ' ')
      )
    ) STORED;

  CREATE INDEX idx_experiences_search ON experiences USING gin(search_vector);

  -- Trigram indexes for fuzzy search
  CREATE INDEX idx_profiles_name_trgm ON profiles USING gin(
    (first_name || ' ' || last_name) gin_trgm_ops
  );

  CREATE INDEX idx_profiles_title_trgm ON profiles USING gin(title gin_trgm_ops);

  -- Function to update updated_at timestamp
  CREATE OR REPLACE FUNCTION update_updated_at_column()
  RETURNS TRIGGER AS $$
  BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
  END;
  $$ language 'plpgsql';

  -- Trigger to automatically update updated_at
  CREATE TRIGGER update_profiles_updated_at 
      BEFORE UPDATE ON profiles 
      FOR EACH ROW 
      EXECUTE FUNCTION update_updated_at_column();

  -- Row Level Security (RLS) policies will be added in the next migration
  -- This allows us to set up the basic structure first
