import PocketBase from 'pocketbase';
import type { PBCollections } from './pocketbase-types';

// Get PocketBase URL from environment variables
const POCKETBASE_URL = import.meta.env.VITE_POCKETBASE_URL || 'http://127.0.0.1:8090';

// Create and export a singleton PocketBase instance with typed collections
export const pb = new PocketBase(POCKETBASE_URL);

// Type the PocketBase instance for better autocomplete
export type TypedPocketBase = PocketBase & {
  collection<T extends keyof PBCollections>(
    idOrName: T
  ): PocketBase['collection'] & {
    getFullList(): Promise<PBCollections[T][]>;
    getOne(id: string): Promise<PBCollections[T]>;
  };
};

// Enable auto cancellation for duplicate requests
pb.autoCancellation(false);

// Export the URL for use in other files if needed
export const pocketbaseUrl = POCKETBASE_URL;

