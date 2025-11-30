# Agentic Estimation App

Ứng dụng desktop để tạo estimation tasks và architecture diagram từ requirements sử dụng OpenAI API.

## Yêu cầu hệ thống

### Frontend (Node.js)
- Node.js >= 18.x
- npm >= 9.x

### Backend (Rust)
- Rust >= 1.70
- Cargo (đi kèm với Rust)

### IDE được khuyến nghị
- [VS Code](https://code.visualstudio.com/) 
- Extension: [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode)
- Extension: [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## Cài đặt

### 1. Cài đặt dependencies

```bash
# Cài đặt Node.js dependencies
npm install

# Cài đặt Rust dependencies (tự động khi chạy lần đầu)
# Hoặc chạy thủ công:
cd src-tauri
cargo build
cd ..
```

### 2. Cấu hình môi trường

Ứng dụng sử dụng OpenAI API key được nhập trực tiếp trong UI. Không cần file `.env`.

## Chạy dự án

### Development mode

```bash
# Chạy ứng dụng ở chế độ development
npm run dev
```

Lệnh này sẽ:
- Khởi động Vite dev server trên port 1420
- Tự động build và chạy Tauri app
- Hot reload cho cả frontend và backend

### Build production

```bash
# Build ứng dụng cho production
npm run build
```

Sau khi build, file executable sẽ nằm trong `src-tauri/target/release/`

### Preview build

```bash
# Preview build production (chỉ frontend)
npm run preview
```

### Tauri commands

```bash
# Chạy các lệnh Tauri CLI
npm run tauri [command]

# Ví dụ:
npm run tauri dev      # Development mode
npm run tauri build    # Build production
```

## Cấu trúc dự án

```
app/
├── src/                    # Frontend React code
│   ├── components/         # React components
│   │   └── ui/            # UI components (Radix UI)
│   ├── lib/               # Utility functions
│   ├── store/             # Zustand state management
│   ├── App.tsx            # Main app component
│   └── main.tsx           # React entry point
│
├── src-tauri/             # Backend Rust code
│   ├── src/
│   │   ├── main.rs        # Tauri entry point
│   │   └── lib.rs         # Rust library code
│   ├── Cargo.toml         # Rust dependencies
│   └── tauri.conf.json    # Tauri configuration
│
├── public/                # Static assets
├── package.json           # Node.js dependencies & scripts
├── vite.config.ts         # Vite configuration
└── tsconfig.json          # TypeScript configuration
```

## Scripts có sẵn

| Script | Mô tả |
|--------|-------|
| `npm run dev` | Chạy ứng dụng ở chế độ development |
| `npm run build` | Build ứng dụng cho production |
| `npm run preview` | Preview build production (chỉ frontend) |
| `npm run tauri` | Chạy Tauri CLI commands |

## Công nghệ sử dụng

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible UI components
- **Zustand** - State management
- **Lucide React** - Icons

### Backend
- **Tauri 2** - Desktop app framework
- **Rust** - Backend language
- **Tokio** - Async runtime
- **Reqwest** - HTTP client
- **Serde** - Serialization

## Hướng dẫn phát triển

### Thêm component mới

1. Tạo component trong `src/components/`:
```typescript
// src/components/MyComponent.tsx
export const MyComponent = () => {
  return <div>My Component</div>
}
```

2. Import và sử dụng trong `App.tsx` hoặc component khác

### Thêm Tauri command (Rust)

1. Định nghĩa command trong `src-tauri/src/lib.rs`:
```rust
#[tauri::command]
fn my_command(param: String) -> String {
    format!("Hello {}", param)
}
```

2. Đăng ký command trong `main.rs`:
```rust
.invoke_handler(tauri::generate_handler![my_command])
```

3. Gọi từ frontend:
```typescript
import { invoke } from '@tauri-apps/api/core'

const result = await invoke<string>('my_command', { param: 'world' })
```

### Quản lý state

Ứng dụng sử dụng Zustand cho state management. State được định nghĩa trong `src/store/useStore.ts`.

Thêm state mới:
```typescript
// src/store/useStore.ts
interface Store {
  // ... existing state
  newState: string
  setNewState: (value: string) => void
}

export const useStore = create<Store>((set) => ({
  // ... existing state
  newState: '',
  setNewState: (value) => set({ newState: value }),
}))
```

### Styling

- Sử dụng Tailwind CSS utility classes
- UI components trong `src/components/ui/` sử dụng Radix UI
- Custom styles trong `src/index.css`

### API Integration

Ứng dụng tích hợp với OpenAI API thông qua Tauri commands:
- `set_api_key` - Lưu API key
- `generate_tasks` - Tạo tasks từ requirements
- `generate_architecture` - Tạo architecture diagram

### Debugging

#### Frontend
- Mở DevTools: Right-click trong app → Inspect Element
- Console logs sẽ hiển thị trong DevTools

#### Backend (Rust)
- Logs từ Rust sẽ hiển thị trong terminal nơi chạy `npm run dev`
- Sử dụng `println!()` hoặc logging crate như `log`

### Hot Reload

- **Frontend**: Tự động reload khi thay đổi file trong `src/`
- **Backend**: Cần restart app khi thay đổi Rust code trong `src-tauri/src/`

### Port Configuration

Dev server chạy trên port 1420 (cấu hình trong `vite.config.ts`). Nếu port bị chiếm, thay đổi trong file config.

## Troubleshooting

### Lỗi khi cài đặt dependencies
```bash
# Xóa node_modules và cài lại
rm -rf node_modules package-lock.json
npm install
```

### Lỗi Rust build
```bash
# Update Rust toolchain
rustup update

# Clean và build lại
cd src-tauri
cargo clean
cargo build
```

### Port đã được sử dụng
Thay đổi port trong `vite.config.ts`:
```typescript
server: {
  port: 1421, // Thay đổi port khác
}
```

## Tài liệu tham khảo

- [Tauri Documentation](https://tauri.app/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
