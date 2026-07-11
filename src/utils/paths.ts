const configuredBase = import.meta.env.BASE_URL || '/';

export function sitePath(path = '/') {
  const base = configuredBase.endsWith('/') ? configuredBase : `${configuredBase}/`;
  const clean = path.replace(/^\/+/, '');
  return clean ? `${base}${clean}` : base;
}

