-- SQL for Live "Interview Demo"
-- Run this after the main seed.sql script.

-- Step 1: Update student names for the demo participants
UPDATE users SET name = 'Will' WHERE id = '00000000-0000-0000-0000-000000000003';
UPDATE users SET name = 'Julian' WHERE id = '00000000-0000-0000-0000-000000000002';
UPDATE users SET name = 'Lan' WHERE id = '00000000-0000-0000-0000-000000000004';

-- Step 2: Create the new "Interview Demo" course
-- This course will be used for the live check-ins.
INSERT INTO courses (id, name, professor_id, start_time, end_time, location) VALUES
('00000000-0000-0000-0000-00000000003C', 'Interview Demo', '00000000-0000-0000-0000-00000000000A', '2025-09-25 14:00:00', '2025-09-25 15:00:00', 'Team Room 031');

-- Step 3: Enroll the three students into the new course
INSERT INTO enrollments (student_id, course_id) VALUES
('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-00000000003C'), -- Will
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-00000000003C'), -- Julian
('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-00000000003C'); -- Lan
