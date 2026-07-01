import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

// llms.txt — a curated map of this site for AI agents.
// Spec: https://llmstxt.org/
export const GET: APIRoute = async ({ site }) => {
  const base = (site ?? new URL('https://zainmhaq.com')).href.replace(/\/$/, '');
  const samples = (await getCollection('samples')).sort((a, b) => a.data.order - b.data.order);

  const lines = [
    '# Zain Haq — Technical Writer',
    '',
    '> Portfolio of Zain Haq, a technical writer at Amazon Supply Chain Services with 7+ years',
    '> of experience documenting APIs, developer tools, and cloud platforms. He also builds AI',
    '> tooling for documentation quality, including a VS Code extension and CLI that score docs',
    '> drafts for editorial and technical accuracy. Previously led the docs platform migration',
    '> to Docusaurus at H2O.ai. Based in Seattle, WA. Contact: zain.m.haq@gmail.com.',
    '',
    'Writing samples use fictional company and product names; the technical content is',
    'representative of published documentation. Each sample is available as raw Markdown.',
    '',
    '## Writing samples',
    '',
    ...samples.map(
      (s) => `- [${s.data.title}](${base}/work/${s.id}.md): ${s.data.docType} for ${s.data.audience.toLowerCase()}. ${s.data.summary}`
    ),
    '',
    '## Optional',
    '',
    `- [Full portfolio content](${base}/llms-full.txt): all writing samples concatenated as one file`,
    `- [Home page](${base}/): work, approach, background, and contact details`,
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
