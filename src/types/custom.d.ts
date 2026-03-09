// Needed to import .json files without type errors in strict TS mode
declare module "*.json" {
  const value: any;
  export default value;
}
