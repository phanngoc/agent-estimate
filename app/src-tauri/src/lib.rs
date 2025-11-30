mod database;

use std::sync::{Arc, Mutex};
use serde::{Deserialize, Serialize};
use database::{Database, Project, ProjectData};

// State để quản lý database
struct AppState {
    db: Arc<Mutex<Option<Database>>>,
}

#[derive(Serialize, Deserialize)]
struct OpenAIMessage {
    role: String,
    content: String,
}

#[derive(Serialize, Deserialize)]
struct OpenAIRequest {
    model: String,
    messages: Vec<OpenAIMessage>,
}

#[derive(Deserialize)]
struct OpenAIChoice {
    message: OpenAIMessage,
}

#[derive(Deserialize)]
struct OpenAIResponse {
    choices: Vec<OpenAIChoice>,
}

// Helper function to initialize database (called from setup hook)
fn init_database_internal(app: &tauri::App, db_state: Arc<Mutex<Option<Database>>>) -> Result<(), String> {
    // Get app data directory using dirs crate
    let app_data_dir = dirs::data_dir()
        .ok_or_else(|| "Failed to get app data dir".to_string())?
        .join(&app.package_info().name);
    
    std::fs::create_dir_all(&app_data_dir)
        .map_err(|e| format!("Failed to create app data dir: {}", e))?;
    
    let db_path = app_data_dir.join("estimation.db");
    
    let database = Database::new(db_path)
        .map_err(|e| format!("Failed to create database: {}", e))?;
    
    database.init_database()
        .map_err(|e| format!("Failed to init database: {}", e))?;
    
    // Store database in app state
    let mut db = db_state.lock().map_err(|e| format!("Lock error: {}", e))?;
    *db = Some(database);
    
    // Migration will be handled by frontend
    // Frontend will check localStorage and call migrate_localstorage_data if needed
    
    Ok(())
}

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn init_database(state: tauri::State<AppState>) -> Result<(), String> {
    // This command is kept for compatibility but database should already be initialized
    let db_state = state.db.lock().map_err(|e| format!("Lock error: {}", e))?;
    if db_state.is_some() {
        Ok(())
    } else {
        Err("Database not initialized".to_string())
    }
}


#[tauri::command]
fn migrate_localstorage_data(
    state: tauri::State<AppState>,
    openai_key: Option<String>,
    requirements: Option<String>,
    generated_tasks: Option<String>,
    generated_architecture: Option<String>,
    prompt_template: Option<String>,
) -> Result<i32, String> {
    let db_state = state.db.lock().map_err(|e| format!("Lock error: {}", e))?;
    if let Some(ref db) = *db_state {
        // Create a default project for migrated data
        let project_id = db.create_project("Migrated Project".to_string())
            .map_err(|e| format!("Database error: {}", e))?;
        
        // Save OpenAI key if exists
        if let Some(key) = openai_key {
            db.save_openai_key(key).map_err(|e| format!("Database error: {}", e))?;
        }
        
        // Save default prompt template if exists
        if let Some(ref template) = prompt_template {
            db.save_default_prompt_template(template.clone()).map_err(|e| format!("Database error: {}", e))?;
        }
        
        // Save project data
        db.save_project_data(
            project_id,
            requirements.unwrap_or_default(),
            generated_tasks.unwrap_or_default(),
            generated_architecture.unwrap_or_default(),
            prompt_template.unwrap_or_default(),
        ).map_err(|e| format!("Database error: {}", e))?;
        
        // Set as current project
        db.set_current_project_id(Some(project_id)).map_err(|e| format!("Database error: {}", e))?;
        
        Ok(project_id)
    } else {
        Err("Database not initialized".to_string())
    }
}

#[tauri::command]
fn get_openai_key(state: tauri::State<AppState>) -> Result<Option<String>, String> {
    let db_state = state.db.lock().map_err(|e| format!("Lock error: {}", e))?;
    if let Some(ref db) = *db_state {
        db.get_openai_key().map_err(|e| format!("Database error: {}", e))
    } else {
        Err("Database not initialized".to_string())
    }
}

#[tauri::command]
fn save_openai_key(state: tauri::State<AppState>, key: String) -> Result<(), String> {
    let db_state = state.db.lock().map_err(|e| format!("Lock error: {}", e))?;
    if let Some(ref db) = *db_state {
        db.save_openai_key(key).map_err(|e| format!("Database error: {}", e))
    } else {
        Err("Database not initialized".to_string())
    }
}

#[tauri::command]
fn get_projects(state: tauri::State<AppState>) -> Result<Vec<Project>, String> {
    let db_state = state.db.lock().map_err(|e| format!("Lock error: {}", e))?;
    if let Some(ref db) = *db_state {
        db.get_projects().map_err(|e| format!("Database error: {}", e))
    } else {
        Err("Database not initialized".to_string())
    }
}

#[tauri::command]
fn create_project(state: tauri::State<AppState>, name: String) -> Result<i32, String> {
    let db_state = state.db.lock().map_err(|e| format!("Lock error: {}", e))?;
    if let Some(ref db) = *db_state {
        db.create_project(name).map_err(|e| format!("Database error: {}", e))
    } else {
        Err("Database not initialized".to_string())
    }
}

#[tauri::command]
fn get_project_data(state: tauri::State<AppState>, project_id: i32) -> Result<Option<ProjectData>, String> {
    let db_state = state.db.lock().map_err(|e| format!("Lock error: {}", e))?;
    if let Some(ref db) = *db_state {
        db.get_project_data(project_id).map_err(|e| format!("Database error: {}", e))
    } else {
        Err("Database not initialized".to_string())
    }
}

#[tauri::command]
fn save_project_data(
    state: tauri::State<AppState>,
    project_id: i32,
    requirements: String,
    tasks: String,
    architecture: String,
    prompt_template: String,
) -> Result<(), String> {
    let db_state = state.db.lock().map_err(|e| format!("Lock error: {}", e))?;
    if let Some(ref db) = *db_state {
        db.save_project_data(project_id, requirements, tasks, architecture, prompt_template)
            .map_err(|e| format!("Database error: {}", e))
    } else {
        Err("Database not initialized".to_string())
    }
}

#[tauri::command]
fn delete_project(state: tauri::State<AppState>, project_id: i32) -> Result<(), String> {
    let db_state = state.db.lock().map_err(|e| format!("Lock error: {}", e))?;
    if let Some(ref db) = *db_state {
        db.delete_project(project_id).map_err(|e| format!("Database error: {}", e))
    } else {
        Err("Database not initialized".to_string())
    }
}

#[tauri::command]
fn update_project_name(state: tauri::State<AppState>, project_id: i32, name: String) -> Result<(), String> {
    let db_state = state.db.lock().map_err(|e| format!("Lock error: {}", e))?;
    if let Some(ref db) = *db_state {
        db.update_project_name(project_id, name).map_err(|e| format!("Database error: {}", e))
    } else {
        Err("Database not initialized".to_string())
    }
}

#[tauri::command]
fn get_current_project_id(state: tauri::State<AppState>) -> Result<Option<i32>, String> {
    let db_state = state.db.lock().map_err(|e| format!("Lock error: {}", e))?;
    if let Some(ref db) = *db_state {
        db.get_current_project_id().map_err(|e| format!("Database error: {}", e))
    } else {
        Err("Database not initialized".to_string())
    }
}

#[tauri::command]
fn set_current_project_id(state: tauri::State<AppState>, project_id: Option<i32>) -> Result<(), String> {
    let db_state = state.db.lock().map_err(|e| format!("Lock error: {}", e))?;
    if let Some(ref db) = *db_state {
        db.set_current_project_id(project_id).map_err(|e| format!("Database error: {}", e))
    } else {
        Err("Database not initialized".to_string())
    }
}

#[tauri::command]
fn load_all_data(state: tauri::State<AppState>) -> Result<serde_json::Value, String> {
    let db_state = state.db.lock().map_err(|e| format!("Lock error: {}", e))?;
    if let Some(ref db) = *db_state {
        let projects = db.get_projects().map_err(|e| format!("Database error: {}", e))?;
        let current_project_id = db.get_current_project_id().map_err(|e| format!("Database error: {}", e))?;
        let openai_key = db.get_openai_key().map_err(|e| format!("Database error: {}", e))?;
        let default_prompt_template = db.get_default_prompt_template().map_err(|e| format!("Database error: {}", e))?;
        
        let mut current_project_data = None;
        if let Some(project_id) = current_project_id {
            current_project_data = db.get_project_data(project_id).map_err(|e| format!("Database error: {}", e))?;
        }
        
        Ok(serde_json::json!({
            "projects": projects,
            "currentProjectId": current_project_id,
            "openaiKey": openai_key,
            "defaultPromptTemplate": default_prompt_template,
            "currentProjectData": current_project_data,
        }))
    } else {
        Err("Database not initialized".to_string())
    }
}

#[tauri::command]
async fn generate_tasks(
    state: tauri::State<'_, AppState>,
    prompt_template: String,
    requirements: String,
) -> Result<String, String> {
    let api_key = {
        let db_state = state.db.lock().map_err(|e| format!("Lock error: {}", e))?;
        if let Some(ref db) = *db_state {
            db.get_openai_key()
                .map_err(|e| format!("Database error: {}", e))?
                .ok_or_else(|| "API key not set".to_string())?
        } else {
            return Err("Database not initialized".to_string());
        }
    };

    let client = reqwest::Client::new();
    let url = "https://api.openai.com/v1/chat/completions";

    let request_body = OpenAIRequest {
        model: "gpt-4o".to_string(),
        messages: vec![
            OpenAIMessage {
                role: "system".to_string(),
                content: prompt_template,
            },
            OpenAIMessage {
                role: "user".to_string(),
                content: format!("Dựa trên requirements sau, hãy breakdown tasks và estimate:\n\n{}", requirements),
            },
        ],
    };

    let response = client
        .post(url)
        .header("Authorization", format!("Bearer {}", api_key))
        .header("Content-Type", "application/json")
        .json(&request_body)
        .send()
        .await
        .map_err(|e| format!("Request error: {}", e))?;

    if !response.status().is_success() {
        let error_text = response.text().await.unwrap_or_else(|_| "Unknown error".to_string());
        return Err(format!("OpenAI API error: {}", error_text));
    }

    let openai_response: OpenAIResponse = response
        .json()
        .await
        .map_err(|e| format!("Parse error: {}", e))?;

    Ok(openai_response
        .choices
        .first()
        .and_then(|c| Some(c.message.content.clone()))
        .unwrap_or_else(|| String::new()))
}

#[tauri::command]
async fn generate_architecture(
    state: tauri::State<'_, AppState>,
    requirements: String,
) -> Result<String, String> {
    let api_key = {
        let db_state = state.db.lock().map_err(|e| format!("Lock error: {}", e))?;
        if let Some(ref db) = *db_state {
            db.get_openai_key()
                .map_err(|e| format!("Database error: {}", e))?
                .ok_or_else(|| "API key not set".to_string())?
        } else {
            return Err("Database not initialized".to_string());
        }
    };

    let client = reqwest::Client::new();
    let url = "https://api.openai.com/v1/chat/completions";

    let system_prompt = "Bạn là một Solution Architect. Hãy tạo Mermaid diagram code cho kiến trúc tổng quan hệ thống dựa trên requirements.\n\nYêu cầu:\n- Sử dụng Mermaid flowchart hoặc C4 diagram\n- Thể hiện các components chính của hệ thống\n- Thể hiện data flow giữa các components\n- Chỉ trả về code Mermaid, không giải thích thêm\n- Bắt đầu bằng ```mermaid và kết thúc bằng ```";

    let request_body = OpenAIRequest {
        model: "gpt-4o".to_string(),
        messages: vec![
            OpenAIMessage {
                role: "system".to_string(),
                content: system_prompt.to_string(),
            },
            OpenAIMessage {
                role: "user".to_string(),
                content: requirements,
            },
        ],
    };

    let response = client
        .post(url)
        .header("Authorization", format!("Bearer {}", api_key))
        .header("Content-Type", "application/json")
        .json(&request_body)
        .send()
        .await
        .map_err(|e| format!("Request error: {}", e))?;

    if !response.status().is_success() {
        let error_text = response.text().await.unwrap_or_else(|_| "Unknown error".to_string());
        return Err(format!("OpenAI API error: {}", error_text));
    }

    let openai_response: OpenAIResponse = response
        .json()
        .await
        .map_err(|e| format!("Parse error: {}", e))?;

    Ok(openai_response
        .choices
        .first()
        .and_then(|c| Some(c.message.content.clone()))
        .unwrap_or_else(|| String::new()))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let app_state = AppState {
        db: Arc::new(Mutex::new(None)),
    };

    let db_state_clone = app_state.db.clone();
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(app_state)
        .setup(move |app| {
            // Initialize database on app start
            if let Err(e) = init_database_internal(app, db_state_clone) {
                eprintln!("Failed to initialize database: {}", e);
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            init_database,
            migrate_localstorage_data,
            get_openai_key,
            save_openai_key,
            get_projects,
            create_project,
            get_project_data,
            save_project_data,
            delete_project,
            update_project_name,
            get_current_project_id,
            set_current_project_id,
            load_all_data,
            generate_tasks,
            generate_architecture
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
