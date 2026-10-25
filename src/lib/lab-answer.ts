import type { LabLink, LabParagraph, LabTopic } from "@/lib/lab-knowledge";

// The answer seam for Ask the lab (feature 007 FR-012). The dialog only knows AnswerSource;
// today it is scripted from the site's content, later it can be an AI service with the same
// shape (e.g. a server route) without changing the dialog.

export type LabAnswer = {
  topicId: string | null;
  paragraphs: readonly LabParagraph[];
  links: readonly LabLink[];
};

export interface AnswerSource {
  answer(question: string): Promise<LabAnswer>;
}

function normalise(text: string): string[] {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9+#.\s-]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => (word.length > 3 && word.endsWith("s") ? word.slice(0, -1) : word));
}

function score(words: readonly string[], terms: readonly string[]): number {
  const folded = terms.flatMap((term) => normalise(term));
  return folded.filter((term) => words.includes(term)).length;
}

export function createScriptedSource(topics: readonly LabTopic[]): AnswerSource {
  return {
    async answer(question) {
      const words = normalise(question);
      let best: LabTopic | null = null;
      let bestScore = 0;
      for (const topic of topics) {
        const value = score(words, topic.strong) * 3 + score(words, topic.keywords);
        if (value > bestScore) {
          best = topic;
          bestScore = value;
        }
      }
      if (!best) {
        return {
          topicId: null,
          paragraphs: [
            { text: "I can't answer that from this site. I can tell you about:" },
            { items: topics.map((topic) => topic.label) },
          ],
          links: [{ label: "All work", href: "/work" }],
        };
      }
      return { topicId: best.id, paragraphs: best.paragraphs, links: best.links };
    },
  };
}
