import { Action, ActionPanel, Color, getPreferenceValues, List, showToast, Toast } from "@raycast/api";
import { useFetch } from "@raycast/utils";
import Style = Toast.Style;

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

interface GitmojiListItemProps {
  gitmoji: Gitmoji;
}

const GitmojiList = () => {
  return (
    <List searchBarPlaceholder="Search your gitmoji...">
      {gitmojis.map((gitmoji) => (
        <GitmojiListItem key={gitmoji.name} gitmoji={gitmoji} />
      ))}
    </List>
  );
};

const GitmojiListItem = ({ gitmoji }: GitmojiListItemProps) => {
  const { name, desc, emoji, code, type } = gitmoji;
  const { emojiFormat, copyFormat, terminator } = getPreferenceValues<PreferenceValues>();

  let emojiText = emojiFormat === "emoji" ? emoji : code;

  if (copyFormat === "emoji-type") {
    emojiText = `${emojiText} ${type}`;
  }

  return (
    <List.Item
      id={name}
      key={name}
      title={desc}
      icon={emoji}
      accessories={[{ tag: { value: code, color: Color.Yellow } }]}
      keywords={[code.replace(":", ""), name]}
      actions={
        <ActionPanel>
          <PrimaryAction content={`${emojiText}${terminator}`} />
          <ActionPanel.Section>
            <Action.CopyToClipboard
              content={emoji}
              title="Copy Emoji"
              shortcut={{ modifiers: ["cmd", "shift"], key: "c" }}
            />
            <Action.CopyToClipboard
              content={code}
              title="Copy Code"
              shortcut={{ modifiers: ["cmd", "opt"], key: "c" }}
            />
            <Action.CopyToClipboard
              content={`${emoji} ${terminator}`}
              title="Copy Emoji with Terminator"
              shortcut={{ modifiers: ["ctrl", "shift"], key: "c" }}
            />
            <Action.CopyToClipboard
              content={`${code} ${terminator}`}
              title="Copy Code with Terminator"
              shortcut={{ modifiers: ["ctrl", "opt"], key: "c" }}
            />
          </ActionPanel.Section>

          <ActionPanel.Section>
            <Action.Paste content={emoji} title="Paste Emoji" shortcut={{ modifiers: ["cmd", "shift"], key: "p" }} />
            <Action.Paste content={code} title="Paste Code" shortcut={{ modifiers: ["cmd", "opt"], key: "p" }} />
            <Action.Paste
              content={`${emoji} ${terminator}`}
              title="Paste Emoji with Terminator"
              shortcut={{ modifiers: ["ctrl", "shift"], key: "p" }}
            />
            <Action.Paste
              content={`${code} ${terminator}`}
              title="Paste Code with Terminator"
              shortcut={{ modifiers: ["ctrl", "opt"], key: "p" }}
            />
          </ActionPanel.Section>
        </ActionPanel>
      }
    />
  );
};

interface PrimaryActionProps {
  content: string;
}

function PrimaryAction({ content }: PrimaryActionProps) {
  const { action } = getPreferenceValues<PreferenceValues>();

  if (action === "copy") {
    return <Action.CopyToClipboard content={content} />;
  } else {
    return <Action.Paste content={content} />;
  }
}

export default GitmojiList;
