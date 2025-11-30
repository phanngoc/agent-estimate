use rusqlite::{Connection, Result as SqliteResult};
use std::path::PathBuf;
use chrono::Utc;

pub struct Database {
    conn: Connection,
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct Project {
    pub id: i32,
    pub name: String,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct ProjectData {
    pub id: i32,
    pub project_id: i32,
    pub requirements: String,
    pub tasks: String,
    pub architecture: String,
    pub prompt_template: String,
    pub updated_at: String,
}

impl Database {
    pub fn new(db_path: PathBuf) -> SqliteResult<Self> {
        let conn = Connection::open(db_path)?;
        Ok(Database { conn })
    }

    pub fn init_database(&self) -> SqliteResult<()> {
        // Create projects table
        self.conn.execute(
            "CREATE TABLE IF NOT EXISTS projects (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )",
            [],
        )?;

        // Create project_data table
        self.conn.execute(
            "CREATE TABLE IF NOT EXISTS project_data (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                project_id INTEGER NOT NULL,
                requirements TEXT DEFAULT '',
                tasks TEXT DEFAULT '',
                architecture TEXT DEFAULT '',
                prompt_template TEXT DEFAULT '',
                updated_at TEXT NOT NULL,
                FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
            )",
            [],
        )?;

        // Create settings table
        self.conn.execute(
            "CREATE TABLE IF NOT EXISTS settings (
                key TEXT PRIMARY KEY,
                value TEXT DEFAULT '',
                updated_at TEXT NOT NULL
            )",
            [],
        )?;

        // Create index for project_id
        self.conn.execute(
            "CREATE INDEX IF NOT EXISTS idx_project_data_project_id ON project_data(project_id)",
            [],
        )?;

        Ok(())
    }

    pub fn get_openai_key(&self) -> SqliteResult<Option<String>> {
        let mut stmt = self.conn.prepare("SELECT value FROM settings WHERE key = 'openai_api_key'")?;
        let mut rows = stmt.query_map([], |row| {
            Ok(row.get::<_, String>(0)?)
        })?;

        if let Some(row) = rows.next() {
            Ok(Some(row?))
        } else {
            Ok(None)
        }
    }

    pub fn save_openai_key(&self, key: String) -> SqliteResult<()> {
        let now = Utc::now().to_rfc3339();
        self.conn.execute(
            "INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?1, ?2, ?3)",
            [&"openai_api_key", key.as_str(), &now],
        )?;
        Ok(())
    }

    pub fn get_default_prompt_template(&self) -> SqliteResult<Option<String>> {
        let mut stmt = self.conn.prepare("SELECT value FROM settings WHERE key = 'default_prompt_template'")?;
        let mut rows = stmt.query_map([], |row| {
            Ok(row.get::<_, String>(0)?)
        })?;

        if let Some(row) = rows.next() {
            Ok(Some(row?))
        } else {
            Ok(None)
        }
    }

    pub fn save_default_prompt_template(&self, template: String) -> SqliteResult<()> {
        let now = Utc::now().to_rfc3339();
        self.conn.execute(
            "INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?1, ?2, ?3)",
            [&"default_prompt_template", template.as_str(), &now],
        )?;
        Ok(())
    }

    pub fn get_current_project_id(&self) -> SqliteResult<Option<i32>> {
        let mut stmt = self.conn.prepare("SELECT value FROM settings WHERE key = 'current_project_id'")?;
        let mut rows = stmt.query_map([], |row| {
            let value: String = row.get(0)?;
            Ok(value.parse::<i32>().unwrap_or(0))
        })?;

        if let Some(row) = rows.next() {
            let id = row?;
            if id > 0 {
                Ok(Some(id))
            } else {
                Ok(None)
            }
        } else {
            Ok(None)
        }
    }

    pub fn set_current_project_id(&self, project_id: Option<i32>) -> SqliteResult<()> {
        let now = Utc::now().to_rfc3339();
        let value = project_id.map(|id| id.to_string()).unwrap_or_default();
        self.conn.execute(
            "INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?1, ?2, ?3)",
            [&"current_project_id", value.as_str(), &now],
        )?;
        Ok(())
    }

    pub fn create_project(&self, name: String) -> SqliteResult<i32> {
        let now = Utc::now().to_rfc3339();
        self.conn.execute(
            "INSERT INTO projects (name, created_at, updated_at) VALUES (?1, ?2, ?3)",
            [&name, &now, &now],
        )?;
        let project_id = self.conn.last_insert_rowid() as i32;

        // Create empty project_data entry
        self.conn.execute(
            "INSERT INTO project_data (project_id, requirements, tasks, architecture, prompt_template, updated_at) VALUES (?1, '', '', '', '', ?2)",
            [&project_id.to_string(), &now],
        )?;

        Ok(project_id)
    }

    pub fn get_projects(&self) -> SqliteResult<Vec<Project>> {
        let mut stmt = self.conn.prepare(
            "SELECT id, name, created_at, updated_at FROM projects ORDER BY updated_at DESC"
        )?;
        let rows = stmt.query_map([], |row| {
            Ok(Project {
                id: row.get(0)?,
                name: row.get(1)?,
                created_at: row.get(2)?,
                updated_at: row.get(3)?,
            })
        })?;

        let mut projects = Vec::new();
        for project in rows {
            projects.push(project?);
        }
        Ok(projects)
    }

    pub fn get_project_data(&self, project_id: i32) -> SqliteResult<Option<ProjectData>> {
        let mut stmt = self.conn.prepare(
            "SELECT id, project_id, requirements, tasks, architecture, prompt_template, updated_at 
             FROM project_data WHERE project_id = ?1"
        )?;
        let mut rows = stmt.query_map([project_id], |row| {
            Ok(ProjectData {
                id: row.get(0)?,
                project_id: row.get(1)?,
                requirements: row.get(2)?,
                tasks: row.get(3)?,
                architecture: row.get(4)?,
                prompt_template: row.get(5)?,
                updated_at: row.get(6)?,
            })
        })?;

        if let Some(row) = rows.next() {
            Ok(Some(row?))
        } else {
            Ok(None)
        }
    }

    pub fn save_project_data(
        &self,
        project_id: i32,
        requirements: String,
        tasks: String,
        architecture: String,
        prompt_template: String,
    ) -> SqliteResult<()> {
        let now = Utc::now().to_rfc3339();
        
        // Check if project_data exists
        let exists = self.conn.query_row(
            "SELECT COUNT(*) FROM project_data WHERE project_id = ?1",
            [project_id],
            |row| row.get::<_, i32>(0),
        )? > 0;

        if exists {
            self.conn.execute(
                "UPDATE project_data SET requirements = ?1, tasks = ?2, architecture = ?3, prompt_template = ?4, updated_at = ?5 WHERE project_id = ?6",
                [&requirements, &tasks, &architecture, &prompt_template, &now, &project_id.to_string()],
            )?;
        } else {
            self.conn.execute(
                "INSERT INTO project_data (project_id, requirements, tasks, architecture, prompt_template, updated_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
                [&project_id.to_string(), &requirements, &tasks, &architecture, &prompt_template, &now],
            )?;
        }

        // Update project's updated_at
        self.conn.execute(
            "UPDATE projects SET updated_at = ?1 WHERE id = ?2",
            [&now, &project_id.to_string()],
        )?;

        Ok(())
    }

    pub fn delete_project(&self, project_id: i32) -> SqliteResult<()> {
        // Delete project_data first (CASCADE should handle this, but being explicit)
        self.conn.execute(
            "DELETE FROM project_data WHERE project_id = ?1",
            [project_id],
        )?;
        
        // Delete project
        self.conn.execute(
            "DELETE FROM projects WHERE id = ?1",
            [project_id],
        )?;

        // If this was the current project, clear it
        if let Ok(Some(current_id)) = self.get_current_project_id() {
            if current_id == project_id {
                self.set_current_project_id(None)?;
            }
        }

        Ok(())
    }

    pub fn update_project_name(&self, project_id: i32, name: String) -> SqliteResult<()> {
        let now = Utc::now().to_rfc3339();
        self.conn.execute(
            "UPDATE projects SET name = ?1, updated_at = ?2 WHERE id = ?3",
            [&name, &now, &project_id.to_string()],
        )?;
        Ok(())
    }
}


