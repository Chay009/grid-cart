import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'node_modules/@ricky0123/vad-web/dist/vad.worklet.bundle.min.js',
          dest: './vad.worklet.bundle.min.js'
        },
        {
          src: 'node_modules/@ricky0123/vad-web/dist/silero_vad.onnx',
          dest: './public/models/silero_vad.onnx'
        },
        {
          src: 'node_modules/onnxruntime-web/dist/*.wasm',
          dest: './public/wasm/'
        }
      ]
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          onnxruntime: ['onnxruntime-web'],
        },
      },
    },
  },
  assetsInclude: ['**/*.min.js', '**/*.onnx', '**/*.wasm'],
})