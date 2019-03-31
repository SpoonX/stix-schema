import 'joi-extract-type';
import { Module } from './Library/Module';

export * from './Library';
/**
 * Exporting a default just to make the import path in config/modules.ts prettier.
 * This is of course entirely optional.
 */
export default Module;
