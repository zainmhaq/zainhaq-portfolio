import type { APIRoute } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';

// Serves each sample as raw Markdown at /work/<slug>.md — the machine-readable
// twin of the HTML page, for AI agents and anyone who prefers plain text.
export async function getStaticPaths() {
  const samples = await getCollection('samples');
  return samples.map((sample) => ({ params: { slug: sample.id }, props: { sample } }));
}

export const GET: APIRoute<{ sample: CollectionEntry<'samples'> }> = ({ props }) => {
  const { data } = props.sample;
  const header = [
    `# ${data.title}`,
    '',
    `> **Document type:** ${data.docType}`,
    `> **Audience:** ${data.audience}`,
    `> **Purpose:** ${data.purpose}`,
    `> **Note:** ${data.note}`,
    '',
    '---',
    '',
  ].join('\n');

  return new Response(header + (props.sample.body ?? ''), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
