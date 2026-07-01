import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

// llms-full.txt — the entire portfolio's writing samples in one plain-text file,
// for agents that prefer a single fetch over crawling.
export const GET: APIRoute = async () => {
  const samples = (await getCollection('samples')).sort((a, b) => a.data.order - b.data.order);

  const sections = samples.map((s) =>
    [
      `# ${s.data.title}`,
      '',
      `> **Document type:** ${s.data.docType}`,
      `> **Audience:** ${s.data.audience}`,
      `> **Purpose:** ${s.data.purpose}`,
      `> **Note:** ${s.data.note}`,
      '',
      '---',
      '',
      (s.body ?? '').trim(),
    ].join('\n')
  );

  const intro = [
    '# Zain Haq — Technical Writer: all writing samples',
    '',
    'Portfolio of Zain Haq (zainmhaq.com), technical writer at Amazon Supply Chain Services.',
    'Writing samples use fictional company and product names; the technical content is',
    'representative of published documentation.',
    '',
  ].join('\n');

  return new Response(intro + '\n' + sections.join('\n\n---\n\n') + '\n', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
