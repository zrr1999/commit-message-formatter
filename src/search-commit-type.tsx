import { Action, ActionPanel, Clipboard, Color, getPreferenceValues, List, LaunchProps } from "@raycast/api";
import { GitmojiListItemProps, PreferenceValues, gitmojis } from "./lib/types";

interface SearchCommitTypeArgs {
  commitMessage: string;
}

export default function SearchCommitType(props: LaunchProps<{ arguments: SearchCommitTypeArgs }>) {
  const { commitMessage } = props.arguments;
  return (
    <List searchBarPlaceholder={commitMessage || "Search your gitmoji..."} >
      {gitmojis.map((gitmoji) => (
        <GitmojiListItem key={gitmoji.name} gitmoji={gitmoji} />
      ))}
    </List>
  );
}

function GitmojiListItem({ gitmoji }: GitmojiListItemProps) {
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
      accessories={[{ tag: { value: `${emojiText}${terminator}...`, color: Color.Yellow } }]}
      keywords={[code.replace(":", ""), name]}
      actions={
        <ActionPanel>
          <PrimaryAction content={`${emojiText}${terminator}`} />
          <ActionPanel.Section>
            <Action.CopyToClipboard
              content={`${emojiText}${terminator}`}
              title="Copy Commit Type"
              shortcut={{ modifiers: ["cmd", "shift"], key: "c" }}
            />
          </ActionPanel.Section>

          <ActionPanel.Section>
            <Action.Paste
              content={`${emojiText}${terminator}`}
              title="Paste Commit Type"
              shortcut={{ modifiers: ["cmd", "shift"], key: "p" }}
            />
          </ActionPanel.Section>
        </ActionPanel>
      }
    />
  );
}

interface PrimaryActionProps {
  content: string;
}

function PrimaryAction({ content }: PrimaryActionProps) {
  const { action } = getPreferenceValues<PreferenceValues>();

  if (action === "copy") {
    return <Action.CopyToClipboard content={content} />;
  } else if (action === "paste") {
    return <Action.Paste content={content} />;
  } else {
    Clipboard.copy(content);
    return <Action.Paste content={content} />;
  }
}
