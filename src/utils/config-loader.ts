import { load } from 'js-yaml';
import { readFileSync, existsSync } from 'fs';
import path from 'path';

/**
 * Loads site configuration from either config.yaml (if it exists) or default-config.yaml
 * @param baseDir Base directory for resolving paths (defaults to process.cwd())
 * @returns The loaded configuration object
 */
export function loadSiteConfig<T = Record<string, any>>(baseDir: string = process.cwd()): T {
  const customConfigPath = path.resolve(baseDir, 'config.yaml');
  const defaultConfigPath = path.resolve(baseDir, 'default-config.yaml');
  
  console.log('Current working directory:', baseDir);
  console.log('Looking for custom config at:', customConfigPath);
  console.log('Custom config exists:', existsSync(customConfigPath));
  
  // Check if custom config exists, otherwise use default
  const configPath = existsSync(customConfigPath) 
    ? customConfigPath 
    : defaultConfigPath;
  
  console.log('Using config from:', configPath);
  
  try {
    // Load YAML config file
    return load(readFileSync(configPath, 'utf8')) as T;
  } catch (error) {
    console.error(`Error loading config from ${configPath}:`, error);
    throw new Error(`Failed to load configuration: ${(error as Error).message}`);
  }
}