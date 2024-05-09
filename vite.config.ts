// vite.config.ts
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    target: 'node16', // Set the target to Node.js
    outDir: 'dist', // Output directory
    emptyOutDir: false, // Clear the output directory before building
    minify: false, // Don't minify the output for Node.js
    rollupOptions: {
      // input: {
      //   'dist/main': resolve(__dirname, 'src/index.ts'),
      //   'bin/ars': resolve(__dirname, 'lib/ars.ts'),
      // },
      output: {
        entryFileNames: '[name].js',
        inlineDynamicImports: false,
        // Remove format option for the library build
        dir: 'bin',
        globals: {}, // Map of globals (if any)
        interop: 'auto', // Automatically detect interop for ES modules
        format: 'umd',
        manualChunks: {},
      },
      external: ['puppeteer-extra-plugin-stealth'], // Exclude all external dependencies
    },
    lib: {
      entry: [
        resolve(__dirname, 'lib/ars.ts'),
        // resolve(__dirname, 'src/index.ts'),
      ], // Entry point for your library
      name: 'ars1', // Name of your library (global variable name)
      formats: ['cjs'],
    },
  },
  optimizeDeps: {
    include: [], // Specify any dependencies you want to include in the build
  },
})
