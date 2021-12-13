import { Plugin } from 'vite';
import MarkdownIt from 'markdown-it';
import path from 'path';
import fs from 'fs';
import hljs from 'highlight.js';

export const mdPlugin: Plugin = {
  name: 'docs-markdown-plugin',
  enforce: 'pre',
  transform(source, id) {
    if (!id.endsWith('.md')) return;
    const re = /<h\d>(.*?)<\/h\d>(.+?)<pre><code\sclass="language-demo">(.*?)<\/code><\/pre>/gs;
    const html = MarkdownIt({ html: true }).render(source);
    const imports: string[] = [];
    const list = Array.from(html.matchAll(re), (v) => {
      const url = v[3].trim().replace(/'/g, '');
      const componentName = path.basename(url, '.vue');
      const code = fs.readFileSync(path.resolve(__dirname, url), 'utf8');
      imports.push(`import ${componentName} from '${url}'`);
      return {
        code: hljs.highlightAuto(code).value,
        id: componentName,
        title: v[1].trim(),
        description: v[2].trim(),
        Component: componentName,
      };
    });
    const importCode = imports.join('\n');
    const listString = JSON.stringify(list).replace(/("Component":)"(\w+)"/g, '$1$2');

    return `${importCode}\nexport default ${listString}`;
  },
};
