// Needed to import .json files without type errors in strict TS mode
declare module "*.json" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const value: any;
  export default value;
}

declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}
