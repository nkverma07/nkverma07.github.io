/// <reference types="node" />
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

export default defineConfig(({ mode }) => {
  const root: string = process.cwd()
  const envFile: string = path.join(root, 'env.env')
  const baseEnv = loadEnv(mode, root)
  const fileEnv: Record<string, string> = fs.existsSync(envFile)
    ? Object.assign(
        {},
        baseEnv,
        Object.fromEntries(
          fs.readFileSync(envFile, 'utf-8')
            .split('\n')
            .map((l: string) => l.trim())
            .filter((l: string) => !!l && !l.startsWith('#'))
            .map((line: string) => {
              const idx = line.indexOf('=')
              if (idx === -1) return ['', '']
              const k = line.slice(0, idx).trim()
              const v = line.slice(idx + 1).trim()
              return [k, v]
            }) as [string, string][]
        )
      )
    : (baseEnv as unknown as Record<string, string>)

  const serverPort = Number(fileEnv.VITE_SERVER_PORT || 4436)

  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      port: serverPort,
      allowedHosts: [".nkverma.me"],
    },
    build: {
      target: 'ES2022',
      minify: 'terser',
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'three-vendor': ['three', '@react-three/fiber', '@react-three/drei', '@react-three/postprocessing'],
            'ui-vendor': ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
          },
        },
      },
      chunkSizeWarningLimit: 1000,
      cssCodeSplit: true,
      sourcemap: false,
      reportCompressedSize: false,
    },
  }
})

