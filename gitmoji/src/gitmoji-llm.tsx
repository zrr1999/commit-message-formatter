import { getPreferenceValues, getSelectedText, Clipboard, AI } from "@raycast/api";

interface PreferenceValues {
  emojiFormat: "emoji" | "code";
  copyFormat: "emoji" | "emoji-type";
  terminator: string;
  action: "paste" | "copy";
}

type Gitmoji = {
  emoji: string;
  code: string;
  desc: string;
  name: string;
  type: string;
};

const gitmojis: Gitmoji[] = [
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
    code: ":tada:",
    desc: "Begin a project.",
    emoji: "🎉",
    name: "tada",
    type: "init",
  },
];

export default async function GitmojiLLM() {
  const { emojiFormat, copyFormat, terminator, action } = getPreferenceValues<PreferenceValues>();

  function getEmojiText(gitmoji: Gitmoji) {
    const { emoji, code, type } = gitmoji;
    let emojiText = emojiFormat === "emoji" ? emoji : code;

    if (copyFormat === "emoji-type") {
      emojiText = `${emojiText} ${type}${terminator}`;
    }
    return emojiText;
  }

  const gitmojiPrompt = gitmojis.map((gitmoji) => `${getEmojiText(gitmoji)}short commit message`).join("\n");
  const prompt = `
    You are a helpful assistant that generates commit messages based on the selected text.
    The commit message should be a short summary of the changes made.
    Your generated commit message should be a imperative mood.
    Your generated commit message should use lower case english.
    Your generated commit message should be one of the following:
    ${gitmojiPrompt}
    
    Gitmojis' descriptions are as follows:
    ${gitmojis.map((gitmoji) => `${gitmoji.code} - ${gitmoji.desc}`).join("\n")}
  `;

  const selectedText = await getSelectedText();
  const answer = AI.ask(`${prompt}\n\nSelected text: ${selectedText}`);

  let allData = "";
  if (action === "paste") {
    answer.on("data", async (data) => {
      allData += data;
      await Clipboard.paste(allData);
    });
    await answer;
  } else {
    await Clipboard.copy(await answer);
  }
}
