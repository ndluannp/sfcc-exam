import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    // Đổi 'sfcc-exam' thành tên repo GitHub của bạn
    base: process.env.GITHUB_PAGES ? '/sfcc-exam/' : '/',
    server: {
        host: '0.0.0.0',
        port: 5173,
    },
})
