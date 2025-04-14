import Database from "../dbConfig"

export async function ensureTablesExist() {
    const db = await Database.getInstance()

    // 0. Role table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS roles (
      id INT PRIMARY KEY,
      name VARCHAR(50) UNIQUE NOT NULL,
      description TEXT
    )
  `)

    // 1. Users Table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nano_id VARCHAR(21) NOT NULL UNIQUE,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password VARCHAR(255),
        role_id INT DEFAULT 1001,
        google_auth_secret VARCHAR(255),
        google_auth_enabled BOOLEAN DEFAULT FALSE,
        email_verified BOOLEAN DEFAULT FALSE,
        otp_code VARCHAR(10),
        otp_expires_at DATETIME,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
      `)

    // 2. Resumes Table
    await db.execute(`
    CREATE TABLE IF NOT EXISTS resumes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      title VARCHAR(150) NOT NULL,
      summary TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `)

    // 3. Experiences Table
    await db.execute(`
    CREATE TABLE IF NOT EXISTS experiences (
      id INT AUTO_INCREMENT PRIMARY KEY,
      resume_id INT NOT NULL,
      position VARCHAR(100) NOT NULL,
      company VARCHAR(100) NOT NULL,
      location VARCHAR(100),
      start_date DATE,
      end_date DATE,
      is_current BOOLEAN DEFAULT FALSE,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE
    )
  `)

    // 4. Education Table
    await db.execute(`
    CREATE TABLE IF NOT EXISTS education (
      id INT AUTO_INCREMENT PRIMARY KEY,
      resume_id INT NOT NULL,
      institution VARCHAR(150) NOT NULL,
      degree VARCHAR(100),
      field_of_study VARCHAR(100),
      start_date DATE,
      end_date DATE,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE
    )
  `)

    // 5. Skills Table
    await db.execute(`
    CREATE TABLE IF NOT EXISTS skills (
      id INT AUTO_INCREMENT PRIMARY KEY,
      resume_id INT NOT NULL,
      name VARCHAR(100) NOT NULL,
      level VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE
    )
  `)

    // 6. Projects Table
    await db.execute(`
    CREATE TABLE IF NOT EXISTS projects (
      id INT AUTO_INCREMENT PRIMARY KEY,
      resume_id INT NOT NULL,
      name VARCHAR(150) NOT NULL,
      description TEXT,
      link VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE
    )
  `)

    // 7. Optional: Categories Table
    await db.execute(`
    CREATE TABLE IF NOT EXISTS categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `)

    // 8. Run default role table
    await db.execute(`
    INSERT INTO roles (id, name, description) VALUES
    (1001, 'user', 'Regular registered user'),
    (1009, 'superadmin', 'Has all privileges'),
    (1005, 'admin', 'Can manage content & users')
    `)

    console.log("✅ All tables checked/created with OTP + Google Auth")
}
