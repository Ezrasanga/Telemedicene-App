ALTER TABLE doctors
    ADD COLUMN password_hash VARCHAR(255) NULL AFTER email;

CREATE UNIQUE INDEX idx_doctors_email ON doctors(email);
