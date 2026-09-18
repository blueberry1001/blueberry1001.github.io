import skills from "../../data/skills.json";

export type SkillTopic = {
  id: string;
  title: string;
  summary: string;
  practices: string[];
  workIds: string[];
  sources: { label: string; url: string }[];
};

export type SkillDomain = {
  id: string;
  title: string;
  english: string;
  description: string;
  topics: SkillTopic[];
};

// Relationships are explicitly maintained in JSON, never inferred from tags.
export const skillDomains: SkillDomain[] = skills;

/** Keep previously shared domain/topic URLs working. */
export function resolveSkillSelection(
  domainId: string | null,
  topicId: string | null
) {
  const legacyDomains: Record<string, string> = {
    games: "unity",
    web: "react",
    algorithms: "cpp",
    creative: "aviutl",
  };
  const requestedId = domainId ? (legacyDomains[domainId] ?? domainId) : null;
  const requestedDomain = skillDomains.find((item) => item.id === requestedId);
  const legacyTopicDomain =
    domainId && legacyDomains[domainId] && topicId
      ? skillDomains.find((item) =>
          item.topics.some((topic) => topic.id === topicId)
        )
      : undefined;
  const domain = legacyTopicDomain ?? requestedDomain ?? skillDomains[0];
  const topic = domain?.topics.find((item) => item.id === topicId);
  return { domain, topic };
}
