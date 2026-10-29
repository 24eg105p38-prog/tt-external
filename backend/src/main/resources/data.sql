-- Idempotent initial seed data for events
INSERT INTO events (id, name, event_date, venue, description)
SELECT 1, 'National Hackathon 2026', '2026-11-15', 'Main Auditorium, Tech Block', '24-hour university hackathon focusing on AI, Web, and Cloud systems with cash prizes and mentorship.'
WHERE NOT EXISTS (SELECT 1 FROM events WHERE id = 1);

INSERT INTO events (id, name, event_date, venue, description)
SELECT 2, 'Autonomous Robotics Workshop', '2026-11-08', 'Robotics Lab 304', 'Hands-on hardware and microcontrollers workshop building obstacle-avoiding campus drones.'
WHERE NOT EXISTS (SELECT 1 FROM events WHERE id = 2);

INSERT INTO events (id, name, event_date, venue, description)
SELECT 3, 'Aura Cultural Fest Gala', '2026-11-20', 'Open Air Amphitheatre', 'Grand inter-department cultural evening featuring student music bands, dance performances, and theater.'
WHERE NOT EXISTS (SELECT 1 FROM events WHERE id = 3);

INSERT INTO events (id, name, event_date, venue, description)
SELECT 4, 'AI & Machine Learning Symposium', '2026-11-04', 'Newton Seminar Hall', 'Guest keynote lectures by industry AI research scientists on large language models and real-world agents.'
WHERE NOT EXISTS (SELECT 1 FROM events WHERE id = 4);

INSERT INTO events (id, name, event_date, venue, description)
SELECT 5, 'Inter-College Chess Championship', '2026-11-12', 'Sports Complex Hall B', 'Blitz and Rapid chess tournament open to all undergraduate and graduate college students.'
WHERE NOT EXISTS (SELECT 1 FROM events WHERE id = 5);

-- Idempotent initial seed data for participants (clearly linked to each event by event_id)
INSERT INTO participants (id, event_id, name, email)
SELECT 1, 1, 'Aarav Sharma', 'aarav.s@college.edu'
WHERE NOT EXISTS (SELECT 1 FROM participants WHERE id = 1);

INSERT INTO participants (id, event_id, name, email)
SELECT 2, 1, 'Sophia Chen', 'sophia.c@college.edu'
WHERE NOT EXISTS (SELECT 1 FROM participants WHERE id = 2);

INSERT INTO participants (id, event_id, name, email)
SELECT 3, 1, 'Rohan Verma', 'rohan.v@college.edu'
WHERE NOT EXISTS (SELECT 1 FROM participants WHERE id = 3);

INSERT INTO participants (id, event_id, name, email)
SELECT 4, 2, 'Emily Taylor', 'emily.t@college.edu'
WHERE NOT EXISTS (SELECT 1 FROM participants WHERE id = 4);

INSERT INTO participants (id, event_id, name, email)
SELECT 5, 2, 'Vikram Patel', 'vikram.p@college.edu'
WHERE NOT EXISTS (SELECT 1 FROM participants WHERE id = 5);

INSERT INTO participants (id, event_id, name, email)
SELECT 6, 3, 'Mia Johnson', 'mia.j@college.edu'
WHERE NOT EXISTS (SELECT 1 FROM participants WHERE id = 6);

INSERT INTO participants (id, event_id, name, email)
SELECT 7, 3, 'Karthik Rao', 'karthik.r@college.edu'
WHERE NOT EXISTS (SELECT 1 FROM participants WHERE id = 7);

INSERT INTO participants (id, event_id, name, email)
SELECT 8, 3, 'Ananya Gupta', 'ananya.g@college.edu'
WHERE NOT EXISTS (SELECT 1 FROM participants WHERE id = 8);
