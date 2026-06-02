-- ============================================================
-- LEO — Supabase schema migration
-- Run this in the Supabase dashboard SQL editor
-- ============================================================

-- ── analyst_profiles ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS analyst_profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name       TEXT,
  role       TEXT NOT NULL DEFAULT 'analyst',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── investigation_notes ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS investigation_notes (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  finding_id            TEXT NOT NULL,
  workflow_id           TEXT NOT NULL,
  notes                 TEXT NOT NULL DEFAULT '',
  resolution_status     TEXT NOT NULL DEFAULT 'open'
    CHECK (resolution_status IN ('open', 'in-progress', 'resolved', 'dismissed')),
  verification_steps    JSONB NOT NULL DEFAULT '[]',
  last_updated_by       UUID REFERENCES analyst_profiles(id) ON DELETE SET NULL,
  last_updated_by_name  TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (finding_id, workflow_id)
);

-- ── audit_trail ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS audit_trail (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  finding_id    TEXT NOT NULL,
  workflow_id   TEXT NOT NULL,
  analyst_id    UUID REFERENCES analyst_profiles(id) ON DELETE SET NULL,
  analyst_name  TEXT,
  action        TEXT NOT NULL,
  details       JSONB NOT NULL DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── updated_at trigger ───────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_updated_at ON investigation_notes;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON investigation_notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── auto-create analyst_profile on user signup ───────────────────────────────
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO analyst_profiles (id, name, role)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1)
    ),
    'analyst'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ── Row Level Security ───────────────────────────────────────────────────────
ALTER TABLE analyst_profiles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE investigation_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_trail         ENABLE ROW LEVEL SECURITY;

-- analyst_profiles: authenticated users can read all profiles
DROP POLICY IF EXISTS "analyst_profiles_select" ON analyst_profiles;
CREATE POLICY "analyst_profiles_select"
  ON analyst_profiles FOR SELECT
  TO authenticated
  USING (true);

-- investigation_notes: authenticated users can read all notes
DROP POLICY IF EXISTS "investigation_notes_select" ON investigation_notes;
CREATE POLICY "investigation_notes_select"
  ON investigation_notes FOR SELECT
  TO authenticated
  USING (true);

-- investigation_notes: authenticated users can insert notes
DROP POLICY IF EXISTS "investigation_notes_insert" ON investigation_notes;
CREATE POLICY "investigation_notes_insert"
  ON investigation_notes FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- investigation_notes: authenticated users can update notes
DROP POLICY IF EXISTS "investigation_notes_update" ON investigation_notes;
CREATE POLICY "investigation_notes_update"
  ON investigation_notes FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- audit_trail: authenticated users can read all rows
DROP POLICY IF EXISTS "audit_trail_select" ON audit_trail;
CREATE POLICY "audit_trail_select"
  ON audit_trail FOR SELECT
  TO authenticated
  USING (true);

-- audit_trail: authenticated users can insert rows
DROP POLICY IF EXISTS "audit_trail_insert" ON audit_trail;
CREATE POLICY "audit_trail_insert"
  ON audit_trail FOR INSERT
  TO authenticated
  WITH CHECK (true);
