// parseConfluenceComment.ts
// Confluence����n����	���ƣ�ƣ

export interface ConfluenceCommentTag {
  key: string;
  value: string;
}

export const CONFLUENCE_TAG_PATTERN = /\[\[\s*([^:]+)\s*:\s*([^\]]+)\s*\]\]/gi;

export function extractTagsFromCommentBody(body: unknown): ConfluenceCommentTag[] {
  if (typeof body !== 'string') return [];
  
  const tags: ConfluenceCommentTag[] = [];
  let match;
  
  // �����c�h�n_�lastIndex����
  CONFLUENCE_TAG_PATTERN.lastIndex = 0;
  
  while ((match = CONFLUENCE_TAG_PATTERN.exec(body)) !== null) {
    tags.push({
      key: match[1].trim(),
      value: match[2].trim(),
    });
  }
  
  return tags;
}

export function getTagValue(tags: ConfluenceCommentTag[], key: string): string | undefined {
  const tag = tags.find(t => t.key.toLowerCase() === key.toLowerCase());
  return tag?.value;
}