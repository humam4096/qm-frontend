/**
 * Synchronization Utility
 * Helper logic to compare local arrays stored in react-hook-form 
 * with the server data arrays provided by React Query, generating
 * the distinct Added, Updated, and Deleted actions needed to sync.
 */

export interface SyncResult<T> {
  added: T[];
  updated: T[];
  deleted: string[];
}

export function syncArrays<ServerType extends { id: string }, LocalType extends { id?: string }>(
  serverData: ServerType[] | undefined | null,
  localData: LocalType[],
  isModifiedFn?: (serverItem: ServerType, localItem: LocalType) => boolean
): SyncResult<LocalType> {
  const added: LocalType[] = [];
  const updated: LocalType[] = [];
  const deleted: string[] = [];

  const serverMap = new Map((serverData || []).map((item) => [item.id, item]));
  const localSet = new Set<string>();

  for (const local of localData) {
    if (!local.id || local.id.startsWith("new-")) {
      // It's a new item natively added via RHF
      added.push(local);
    } else {
      localSet.add(local.id);
      
      const serverItem = serverMap.get(local.id);
      if (serverItem) {
        // If an isModified checker is provided, only push to updated if actually changed
        if (!isModifiedFn || isModifiedFn(serverItem, local)) {
          updated.push(local);
        }
      } else {
        // Fallback: local has ID but missing from server (shouldn't realistically happen)
        added.push(local);
      }
    }
  }

  // Determine what to delete
  for (const serverItem of (serverData || [])) {
    if (!localSet.has(serverItem.id)) {
      deleted.push(serverItem.id);
    }
  }

  return { added, updated, deleted };
}
