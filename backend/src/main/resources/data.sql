-- Insert dummy users
INSERT INTO users (email, name, role, bio, password_hash, location, created_at, updated_at)
VALUES
    ('alice@example.com', 'Alice', 'STUDENT', 'CS student passionate about blockchain', 'hashed_pw_1', ST_GeomFromText('POINT(77.5946 12.9716)', 4326), NOW(), NOW()),
    ('bob@example.com', 'Bob', 'FACULTY', 'Faculty in AI/ML', 'hashed_pw_2', ST_GeomFromText('POINT(72.8777 19.0760)', 4326), NOW(), NOW());

-- Insert dummy projects
INSERT INTO projects (id, title, description, repo_url, owner_id, status, location, created_at, updated_at)
VALUES
    (1, 'AI Resume Builder', 'A resume builder powered by GPT.', 'https://github.com/alice/ai-resume', 1, 'PENDING', ST_GeomFromText('POINT(77.5946 12.9716)', 4326), NOW(), NOW()),
    (2, 'Blockchain Voting', 'Secure voting system using smart contracts.', 'https://github.com/bob/blockchain-voting', 2, 'ENDORSED', ST_GeomFromText('POINT(72.8777 19.0760)', 4326), NOW(), NOW());
