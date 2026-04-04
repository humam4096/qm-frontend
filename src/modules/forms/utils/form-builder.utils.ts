// Generate temp IDs
export const generateId = () => crypto.randomUUID();

// Reorder helper
export const reorder = <T>(list: T[]): T[] =>
  list.map((item, index) => ({
    ...item,
    sequence_order: index + 1,
  }));