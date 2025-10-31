-- WhatsApp Messages Table
CREATE TABLE IF NOT EXISTS whatsapp_messages (
    id TEXT PRIMARY KEY,
    from_number TEXT NOT NULL,
    to_number TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('text', 'image', 'document', 'audio', 'video')),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status TEXT NOT NULL CHECK (status IN ('sent', 'delivered', 'read', 'failed')) DEFAULT 'sent',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- WhatsApp Contacts Table
CREATE TABLE IF NOT EXISTS whatsapp_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone TEXT UNIQUE NOT NULL,
    name TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    last_interaction TIMESTAMPTZ,
    status TEXT NOT NULL CHECK (status IN ('active', 'blocked', 'inactive')) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- WhatsApp Templates Table (for message templates)
CREATE TABLE IF NOT EXISTS whatsapp_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    language TEXT NOT NULL DEFAULT 'pt_BR',
    template_data JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_from ON whatsapp_messages(from_number);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_to ON whatsapp_messages(to_number);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_timestamp ON whatsapp_messages(timestamp);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_status ON whatsapp_messages(status);

CREATE INDEX IF NOT EXISTS idx_whatsapp_contacts_phone ON whatsapp_contacts(phone);
CREATE INDEX IF NOT EXISTS idx_whatsapp_contacts_user_id ON whatsapp_contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_contacts_last_interaction ON whatsapp_contacts(last_interaction);

CREATE INDEX IF NOT EXISTS idx_whatsapp_templates_name ON whatsapp_templates(name);
CREATE INDEX IF NOT EXISTS idx_whatsapp_templates_category ON whatsapp_templates(category);

-- RLS Policies
ALTER TABLE whatsapp_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_templates ENABLE ROW LEVEL SECURITY;

-- Policies for whatsapp_messages
CREATE POLICY "Admin can manage all WhatsApp messages" ON whatsapp_messages
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.user_id = auth.uid() 
            AND user_profiles.role IN ('admin', 'manager')
        )
    );

CREATE POLICY "Staff can view WhatsApp messages" ON whatsapp_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.user_id = auth.uid() 
            AND user_profiles.role IN ('admin', 'manager', 'staff')
        )
    );

-- Policies for whatsapp_contacts
CREATE POLICY "Admin can manage all WhatsApp contacts" ON whatsapp_contacts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.user_id = auth.uid() 
            AND user_profiles.role IN ('admin', 'manager')
        )
    );

CREATE POLICY "Staff can view WhatsApp contacts" ON whatsapp_contacts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.user_id = auth.uid() 
            AND user_profiles.role IN ('admin', 'manager', 'staff')
        )
    );

CREATE POLICY "Users can view their own WhatsApp contact" ON whatsapp_contacts
    FOR SELECT USING (user_id = auth.uid());

-- Policies for whatsapp_templates
CREATE POLICY "Admin can manage WhatsApp templates" ON whatsapp_templates
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.user_id = auth.uid() 
            AND user_profiles.role IN ('admin', 'manager')
        )
    );

CREATE POLICY "Staff can view WhatsApp templates" ON whatsapp_templates
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.user_id = auth.uid() 
            AND user_profiles.role IN ('admin', 'manager', 'staff')
        )
    );

-- Grant permissions
GRANT ALL PRIVILEGES ON whatsapp_messages TO authenticated;
GRANT ALL PRIVILEGES ON whatsapp_contacts TO authenticated;
GRANT ALL PRIVILEGES ON whatsapp_templates TO authenticated;

GRANT SELECT ON whatsapp_messages TO anon;
GRANT SELECT ON whatsapp_contacts TO anon;
GRANT SELECT ON whatsapp_templates TO anon;

-- Insert some default templates
INSERT INTO whatsapp_templates (name, category, template_data) VALUES
('appointment_reminder', 'appointment', '{
    "name": "appointment_reminder",
    "language": "pt_BR",
    "components": [
        {
            "type": "body",
            "parameters": [
                {"type": "text", "text": "{{customer_name}}"},
                {"type": "text", "text": "{{appointment_date}}"},
                {"type": "text", "text": "{{appointment_time}}"},
                {"type": "text", "text": "{{service_name}}"}
            ]
        }
    ]
}'),
('appointment_confirmation', 'appointment', '{
    "name": "appointment_confirmation",
    "language": "pt_BR",
    "components": [
        {
            "type": "body",
            "parameters": [
                {"type": "text", "text": "{{customer_name}}"},
                {"type": "text", "text": "{{appointment_date}}"},
                {"type": "text", "text": "{{appointment_time}}"}
            ]
        }
    ]
}'),
('promotion_announcement', 'marketing', '{
    "name": "promotion_announcement",
    "language": "pt_BR",
    "components": [
        {
            "type": "body",
            "parameters": [
                {"type": "text", "text": "{{promotion_title}}"},
                {"type": "text", "text": "{{discount_percentage}}"},
                {"type": "text", "text": "{{valid_until}}"}
            ]
        }
    ]
}')
ON CONFLICT (name) DO NOTHING;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_whatsapp_messages_updated_at BEFORE UPDATE ON whatsapp_messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_whatsapp_contacts_updated_at BEFORE UPDATE ON whatsapp_contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_whatsapp_templates_updated_at BEFORE UPDATE ON whatsapp_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();