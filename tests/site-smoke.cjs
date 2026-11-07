const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const html = fs.readFileSync('index.html', 'utf8');
assert.match(html, /<html\b[^>]*lang="en"/i);
assert.match(html, /<meta\s+name="viewport"/i);
for (const id of ['growth-calculator','calc-initial','calc-monthly','calc-rate','calc-years','calc-total','calc-paid','calc-gain','calc-error']) {
  assert.match(html, new RegExp('id="' + id + '"'), 'Missing '+id);
}
const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
  .filter(m => !/\bsrc\s*=/.test(m[1]) && !/application\/ld\+json/.test(m[1]));
assert.ok(scripts.length, 'Expected inline site script');
scripts.forEach((m, i) => new vm.Script(m[2], {filename: 'inline-' + i + '.js'}));
console.log('Finwise static checks passed (' + scripts.length + ' inline scripts).');
