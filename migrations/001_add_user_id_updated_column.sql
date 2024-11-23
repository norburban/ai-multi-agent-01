-- Alter column type if it exists
DO $$ 
BEGIN 
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name='conversations' 
        AND column_name='user_id_updated'
        AND data_type='integer'
    ) THEN
        ALTER TABLE conversations ALTER COLUMN user_id_updated TYPE UUID USING NULL;
    END IF;
END $$;

-- Check if column exists and add it if it doesn't
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 
                  FROM information_schema.columns 
                  WHERE table_name='conversations' 
                  AND column_name='user_id_updated') 
    THEN
        ALTER TABLE conversations ADD COLUMN user_id_updated UUID;
    END IF;
END $$;

-- Update existing rows to set user_id_updated to user_id
UPDATE conversations 
SET user_id_updated = user_id
WHERE user_id_updated IS NULL;

-- Enable Row Level Security (if not already enabled)
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Drop existing trigger and function if they exist
DROP TRIGGER IF EXISTS conversations_update_user_id ON conversations;
DROP FUNCTION IF EXISTS update_user_id_updated();

-- Create trigger to update user_id_updated when updated_at changes
CREATE OR REPLACE FUNCTION update_user_id_updated()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.updated_at != OLD.updated_at AND NEW.user_id_updated IS NULL THEN
        NEW.user_id_updated = NEW.user_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER conversations_update_user_id
    BEFORE UPDATE ON conversations
    FOR EACH ROW
    EXECUTE FUNCTION update_user_id_updated();
