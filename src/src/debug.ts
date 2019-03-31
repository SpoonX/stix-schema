import { createDebugLogger as createLogger } from 'stix';

export const createDebugLogger = (namespace: string): debug.IDebugger => createLogger(namespace, 'stix-schema:');
