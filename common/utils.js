export function resolveVariables(obj, context) {
  if (typeof obj === 'string') {
    return obj.replace(
      /\{\{(.+?)\}\}/g,
      (_, path) => {
        // Simple path resolution - could be enhanced for nested objects
        return context[path.trim()] ?? `{{${path}}}`;
      }
    );
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => resolveVariables(item, context));
  }
  if (typeof obj === 'object' && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [k, resolveVariables(v, context)])
    );
  }
  return obj;
}
