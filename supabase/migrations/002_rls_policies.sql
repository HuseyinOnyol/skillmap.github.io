-- Enable Row Level Security
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user's role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
BEGIN
  RETURN (
    SELECT role 
    FROM users 
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to get current user's organization
CREATE OR REPLACE FUNCTION get_user_organization()
RETURNS UUID AS $$
BEGIN
  RETURN (
    SELECT organization_id 
    FROM users 
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Organizations policies
CREATE POLICY "owners_can_view_all_organizations" ON organizations
  FOR SELECT USING (get_user_role() = 'owner');

CREATE POLICY "partners_can_view_own_organization" ON organizations
  FOR SELECT USING (
    get_user_role() IN ('partner_admin', 'partner_user') AND
    id = get_user_organization()
  );

CREATE POLICY "owners_can_manage_organizations" ON organizations
  FOR ALL USING (get_user_role() = 'owner');

-- Users policies
CREATE POLICY "users_can_view_own_profile" ON users
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "owners_can_view_all_users" ON users
  FOR SELECT USING (get_user_role() = 'owner');

CREATE POLICY "partner_admins_can_view_org_users" ON users
  FOR SELECT USING (
    get_user_role() = 'partner_admin' AND
    organization_id = get_user_organization()
  );

CREATE POLICY "owners_can_manage_all_users" ON users
  FOR ALL USING (get_user_role() = 'owner');

CREATE POLICY "partner_admins_can_manage_org_users" ON users
  FOR ALL USING (
    get_user_role() = 'partner_admin' AND
    organization_id = get_user_organization() AND
    role IN ('partner_admin', 'partner_user')
  );

-- Profiles policies
CREATE POLICY "owners_can_view_all_profiles" ON profiles
  FOR SELECT USING (get_user_role() = 'owner');

CREATE POLICY "partners_can_view_own_org_profiles_full" ON profiles
  FOR SELECT USING (
    get_user_role() IN ('partner_admin', 'partner_user') AND
    organization_id = get_user_organization()
  );

CREATE POLICY "partners_can_view_other_profiles_published" ON profiles
  FOR SELECT USING (
    get_user_role() IN ('partner_admin', 'partner_user') AND
    organization_id != get_user_organization() AND
    status = 'published'
  );

CREATE POLICY "public_can_view_published_profiles" ON profiles
  FOR SELECT USING (
    auth.uid() IS NULL AND
    status = 'published'
  );

CREATE POLICY "owners_can_manage_all_profiles" ON profiles
  FOR ALL USING (get_user_role() = 'owner');

CREATE POLICY "partner_admins_can_manage_org_profiles" ON profiles
  FOR ALL USING (
    get_user_role() = 'partner_admin' AND
    organization_id = get_user_organization()
  );

-- Experiences policies
CREATE POLICY "experiences_follow_profile_access" ON experiences
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = experiences.profile_id
    )
  );

CREATE POLICY "owners_can_manage_all_experiences" ON experiences
  FOR ALL USING (get_user_role() = 'owner');

CREATE POLICY "partner_admins_can_manage_org_experiences" ON experiences
  FOR ALL USING (
    get_user_role() = 'partner_admin' AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = experiences.profile_id 
      AND profiles.organization_id = get_user_organization()
    )
  );

-- Tags policies
CREATE POLICY "everyone_can_view_active_tags" ON tags
  FOR SELECT USING (active = true);

CREATE POLICY "owners_can_manage_tags" ON tags
  FOR ALL USING (get_user_role() = 'owner');

-- Profile Tags policies
CREATE POLICY "profile_tags_follow_profile_access" ON profile_tags
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = profile_tags.profile_id
    )
  );

CREATE POLICY "owners_can_manage_all_profile_tags" ON profile_tags
  FOR ALL USING (get_user_role() = 'owner');

CREATE POLICY "partner_admins_can_manage_org_profile_tags" ON profile_tags
  FOR ALL USING (
    get_user_role() = 'partner_admin' AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = profile_tags.profile_id 
      AND profiles.organization_id = get_user_organization()
    )
  );

-- Contact Requests policies
CREATE POLICY "anyone_can_create_contact_requests" ON contact_requests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "owners_can_view_all_contact_requests" ON contact_requests
  FOR SELECT USING (get_user_role() = 'owner');

CREATE POLICY "owners_can_manage_contact_requests" ON contact_requests
  FOR ALL USING (get_user_role() = 'owner');

-- Audit Logs policies
CREATE POLICY "owners_can_view_all_audit_logs" ON audit_logs
  FOR SELECT USING (get_user_role() = 'owner');

CREATE POLICY "users_can_view_own_audit_logs" ON audit_logs
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "authenticated_users_can_create_audit_logs" ON audit_logs
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Function to create audit log entry
CREATE OR REPLACE FUNCTION create_audit_log(
  p_action TEXT,
  p_entity TEXT,
  p_entity_id UUID,
  p_metadata JSONB DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  INSERT INTO audit_logs (user_id, action, entity, entity_id, metadata)
  VALUES (auth.uid(), p_action, p_entity, p_entity_id, p_metadata);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Audit triggers
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
DECLARE
  old_data JSONB;
  new_data JSONB;
  action_type TEXT;
BEGIN
  -- Determine action type
  IF TG_OP = 'DELETE' THEN
    action_type := 'DELETE';
    old_data := to_jsonb(OLD);
    PERFORM create_audit_log(action_type, TG_TABLE_NAME, OLD.id, old_data);
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    action_type := 'UPDATE';
    old_data := to_jsonb(OLD);
    new_data := to_jsonb(NEW);
    PERFORM create_audit_log(action_type, TG_TABLE_NAME, NEW.id, 
      jsonb_build_object('old', old_data, 'new', new_data));
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    action_type := 'INSERT';
    new_data := to_jsonb(NEW);
    PERFORM create_audit_log(action_type, TG_TABLE_NAME, NEW.id, new_data);
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add audit triggers to important tables
CREATE TRIGGER profiles_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON profiles
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER users_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON users
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER organizations_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON organizations
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
