# Tauri + ReactJS Development Rules

## Kiến trúc dự án
- Dự án sử dụng Tauri v2 với ReactJS (TypeScript) và Rust backend
- Frontend: React 19 + TypeScript + Vite + Tailwind CSS
- Backend: Rust (src-tauri/) với Tauri v2
- State management: Zustand
- UI Components: Radix UI + shadcn/ui pattern

## Quy tắc phát triển

### Frontend (ReactJS)
- Sử dụng TypeScript cho tất cả các file
- Component structure: Functional components với hooks
- State management: Sử dụng Zustand store (app/src/store/)
- UI Components: Sử dụng components từ app/src/components/ui/ (theo pattern shadcn/ui)
- Styling: Tailwind CSS với utility classes
- Import paths: Sử dụng path alias `@/` cho imports từ src/
- File naming: PascalCase cho components, camelCase cho utilities

### Backend (Rust/Tauri)
- Rust code nằm trong app/src-tauri/src/
- Sử dụng Tauri commands để expose functions cho frontend
- Database: SQLite với rusqlite
- Async operations: Sử dụng tokio runtime
- Error handling: Proper error propagation với Result types

### Communication giữa Frontend và Backend
- Sử dụng `invoke()` từ `@tauri-apps/api/core` để gọi Rust commands
- Tất cả Tauri commands phải được define trong Rust với `#[tauri::command]`
- Commands nên return proper types (String, number, object, etc.)
- Error handling: Catch errors từ invoke() và hiển thị user-friendly messages

### Code Style
- TypeScript: Strict mode enabled, sử dụng type annotations rõ ràng
- React: Sử dụng hooks (useState, useEffect, etc.) thay vì class components
- Rust: Follow Rust conventions, sử dụng clippy lints
- Formatting: Consistent indentation (2 spaces cho TS/TSX, 4 spaces cho Rust)

### Best Practices
- Tách logic phức tạp ra custom hooks hoặc utility functions
- Component composition: Tạo reusable components trong app/src/components/
- Error boundaries: Xử lý errors gracefully với try-catch và user feedback
- Performance: Sử dụng React.memo, useMemo, useCallback khi cần thiết
- Security: Không hardcode API keys, sử dụng secure storage từ Tauri
- Database: Tất cả database operations nên được handle trong Rust backend

### File Structure
```
app/
  src/              # React frontend
    components/     # React components
    store/          # Zustand stores
    lib/            # Utilities
  src-tauri/        # Rust backend
    src/            # Rust source code
    capabilities/   # Tauri capabilities
```

### Testing & Development
- Development: `npm run dev` (chạy Vite dev server)
- Tauri dev: `npm run tauri dev` (chạy Tauri app)
- Build: `npm run build` (build frontend) + `npm run tauri build` (build app)

### Dependencies
- Frontend: React 19, TypeScript, Vite, Tailwind CSS, Zustand, Radix UI
- Backend: Tauri v2, tokio, rusqlite, serde, reqwest
- Luôn cập nhật dependencies khi cần thiết và test kỹ sau khi update

