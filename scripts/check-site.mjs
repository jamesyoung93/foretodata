import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';

const dist = resolve('dist');
const base = '/foretodata/';
const failures = [];
let htmlCount = 0;
let referenceCount = 0;
const expectedRoutes = [
  'writing',
  'writing/archive',
  'posts',
  'posts/forecasting-increasing-granularity',
  'posts/pairwise-to-batch-sequence-alignment',
  'posts/pre-snap-tells-nfl',
  'posts/causal-inference-practical-guide',
  'posts/interpretable-ml-business',
  'posts/llm-production-lessons',
  'posts/predicting-dna-properties-bioinformatics',
  'posts/predicting-drug-toxicity-cheminformatics',
  'posts/reproducible-r-workflows-drake',
];

function walk(directory) {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

function targetFor(url) {
  const withoutQuery = url.split(/[?#]/)[0];
  if (!withoutQuery.startsWith(base)) return null;
  const relative = withoutQuery.slice(base.length);
  if (!relative) return join(dist, 'index.html');
  if (extname(relative)) return join(dist, relative);
  return join(dist, relative, 'index.html');
}

if (!existsSync(dist)) {
  console.error('dist/ is missing. Run the production build first.');
  process.exit(1);
}

for (const file of walk(dist).filter((path) => path.endsWith('.html'))) {
  htmlCount += 1;
  const html = readFileSync(file, 'utf8');
  const attributes = html.matchAll(/(?:href|src)=["']([^"']+)["']/g);

  for (const [, url] of attributes) {
    if (/^(?:https?:|mailto:|tel:|data:|#)/.test(url)) continue;
    referenceCount += 1;

    if (url.startsWith('/') && !url.startsWith(base)) {
      failures.push(`${file}: root-relative reference escapes base path: ${url}`);
      continue;
    }

    const target = targetFor(url);
    if (target && !existsSync(target)) {
      failures.push(`${file}: missing target for ${url}`);
    }
  }
}

for (const route of expectedRoutes) {
  const target = join(dist, ...route.split('/'), 'index.html');
  if (!existsSync(target)) {
    failures.push(`expected preserved route is missing: /${route}`);
  }
}

if (failures.length) {
  console.error(`Route check failed with ${failures.length} issue(s):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Route check passed: ${htmlCount} HTML pages, ${referenceCount} internal references, base ${base}`);
