import replace from 'replace-in-file';

const options = {
  files: 'src/**/*.{ts,tsx,css}',
  from: /bg-gradient-to-[a-z]+\s+(from-[a-zA-Z0-9-\/\[\]#]+\s+)?(via-[a-zA-Z0-9-\/\[\]#]+\s+)?(to-[a-zA-Z0-9-\/\[\]#]+\s+)?/g,
  to: 'bg-bet-primary ',
};

const optionsGeneric = {
  files: 'src/**/*.{ts,tsx,css}',
  from: /linear-gradient\([^)]+\)/g,
  to: 'var(--color-primary)',
};

const optionsText = {
  files: 'src/**/*.{ts,tsx,css}',
  from: /bg-clip-text text-transparent bg-gradient-to-[a-z]+\s+(from-[a-zA-Z0-9-\/\[\]#]+\s+)?(via-[a-zA-Z0-9-\/\[\]#]+\s+)?(to-[a-zA-Z0-9-\/\[\]#]+\s+)?/g,
  to: 'text-bet-primary ',
};

try {
  const r1 = replace.sync(optionsText);
  const r2 = replace.sync(optionsGeneric);
  console.log('Results text:', r1.filter(r => r.hasChanged).map(r => r.file));
  console.log('Results generic:', r2.filter(r => r.hasChanged).map(r => r.file));
} catch(e) {
  console.error(e);
}
