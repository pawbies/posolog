-- Hand-written instead of drizzle-kit's table rebuild: the expo migrator runs inside a
-- transaction, where PRAGMA foreign_keys=OFF is ignored, so DROP TABLE strengths would
-- cascade-delete every strength_ingredients row. The enum is TS-only, so only the data changes.
-- The column's SQL default stays 'tablet'; createStrength always sets unitInUse explicitly.
UPDATE `strengths` SET `unitInUse` = 'derived_from_medication' WHERE `unitInUse` NOT IN ('ml', 'unit');
