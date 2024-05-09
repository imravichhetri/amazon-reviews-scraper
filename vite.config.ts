// vite.config.ts
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    target: 'node16', // Set the target to Node.js
    outDir: 'dist', // Output directory
    emptyOutDir: true, // Clear the output directory before building
    minify: false, // Don't minify the output for Node.js
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.ts'),
        // 'bin/ars': resolve(__dirname, 'lib/ars.ts'),
      },
      output: {
        entryFileNames: '[name].js',
        inlineDynamicImports: false,
        format: 'es',
        // dir: 'bin',
      },
    },
    lib: {
      entry: 'lib/ars.ts', // Entry point for your library
      name: 'ars', // Name of your library (global variable name)
      formats: ['cjs'],
    },
  },
  optimizeDeps: {
    include: [], // Specify any dependencies you want to include in the build
  },
})
