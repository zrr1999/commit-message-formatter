export interface PreferenceValues {
  emojiFormat: "emoji" | "code";
  copyFormat: "emoji" | "emoji-type";
  terminator: string;
  action: "paste" | "copy";
  model: string;
  openAiApiKey: string;
  openAiBasePath?: string;
  language: string;
}

export interface GitmojiListItemProps {
  gitmoji: Gitmoji;
}
export type Gitmoji = {
  emoji: string;
  code: string;
  desc: string;
  name: string;
  type: string;
};
export const gitmojis: Gitmoji[] = [
  {
    code: ":sparkles:",
    desc: "Introduce new features",
    emoji: "✨",
    name: "sparkles",
    type: "feat",
  },
  {
    code: ":bug:",
    desc: "Fix a bug",
    emoji: "🐛",
    name: "bug",
    type: "fix",
  },
  {
    code: ":recycle:",
    desc: "Refactor code that neither fixes a bug nor adds a feature",
    emoji: "♻️",
    name: "recycle",
    type: "refactor",
  },
  {
    code: ":zap:",
    desc: "A code change that improves performance",
    emoji: "⚡",
    name: "zap",
    type: "perf",
  },
  {
    code: ":lipstick:",
    desc: "Add or update style files that do not affect the meaning of the code",
    emoji: "💄",
    name: "lipstick",
    type: "style",
  },
  {
    code: ":white_check_mark:",
    desc: "Adding missing tests or correcting existing tests",
    emoji: "✅",
    name: "white-check-mark",
    type: "test",
  },
  {
    code: ":memo:",
    desc: "Documentation only changes",
    emoji: "📝",
    name: "memo",
    type: "docs",
  },
  {
    code: ":construction_worker:",
    desc: "Changes to our CI configuration files and scripts",
    emoji: "👷",
    name: "construction-worker",
    type: "ci",
  },
  {
    code: ":wrench:",
    desc: "Other changes that dont modify src or test file",
    emoji: "🔧",
    name: "wrench",
    type: "chore",
  },
  {
    code: ":package:",
    desc: "Make architectural changes",
    emoji: "📦",
    name: "package",
    type: "build",
  },
  {
    code: ":arrow_up:",
    desc: "Upgrade dependencies",
    emoji: "⬆️",
    name: "arrow-up",
    type: "deps",
  },
  {
    code: ":tada:",
    desc: "Begin a project.",
    emoji: "🎉",
    name: "tada",
    type: "init",
  },
];
