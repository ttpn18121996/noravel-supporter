import path from 'node:path';
import fs from 'node:fs';

// Declare `__webpack_require__` so that TypeScript does not flag it as an error.
declare const __webpack_require__:
  | {
      (id: string): any;
      resolve(id: string): string;
      cache: Record<string, any>;
      [key: string]: any;
    }
  | undefined;

/**
 * Safe `require` for Bundler (Next.js/Webpack)
 */
function safeRequire(modulePath: string) {
  // Safely check for the existence of `__webpack_require__` at runtime
  const isWebpack = typeof __webpack_require__ !== 'undefined';
  const nativeRequire = isWebpack ? eval('require') : require;
  return nativeRequire(modulePath);
}

function loadNativeAddon() {
  const platform = process.platform;
  const arch = process.arch;

  const possibleNames = ['supporter_addon.node', 'node.napi.node', `@noravel+supporter.node`];

  const baseDirs = [
    path.join(process.cwd(), 'node_modules', '@noravel', 'supporter'),
    path.resolve(__dirname, '..'),
    path.resolve(__dirname, '.'),
  ];

  for (const baseDir of baseDirs) {
    for (const fileName of possibleNames) {
      const prebuildPath = path.join(baseDir, 'prebuilds', `${platform}-${arch}`, fileName);
      if (fs.existsSync(prebuildPath)) {
        return safeRequire(prebuildPath);
      }

      const localBuildPath = path.join(baseDir, 'build', 'Release', fileName);
      if (fs.existsSync(localBuildPath)) {
        return safeRequire(localBuildPath);
      }
    }
  }

  try {
    const loadBinding = safeRequire('node-gyp-build');
    return loadBinding(path.resolve(__dirname, '..'));
  } catch (err) {
    throw new Error(
      `[noravel-supporter] No native build found for platform=${platform} arch=${arch}. ` +
        `Please ensure prebuilds are correctly installed.`,
    );
  }
}

const addon = loadNativeAddon();
export default addon;
