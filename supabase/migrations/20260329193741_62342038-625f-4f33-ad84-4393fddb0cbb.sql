-- Fix 1: Restrict profiles SELECT to authenticated users only
DROP POLICY IF EXISTS "Profiles viewable by everyone" ON profiles;
CREATE POLICY "Profiles viewable by authenticated users"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

-- Fix 2: Add DELETE policies for ongs, freelancers, volunteers
CREATE POLICY "Users can delete own ong"
  ON ongs FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own freelancer profile"
  ON freelancers FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own volunteer profile"
  ON volunteers FOR DELETE
  USING (auth.uid() = user_id);