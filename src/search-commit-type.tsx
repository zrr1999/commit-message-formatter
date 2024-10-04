import { Action, ActionPanel, Clipboard, Color, getPreferenceValues, List, LaunchProps } from "@raycast/api";
import { GitmojiListItemProps, PreferenceValues, gitmojis } from "./lib/types";
import { useState } from "react";
import { usePromise } from "@raycast/utils";
import { getCommitMessage } from "./lib/utils";

interface SearchCommitTypeArgs {
  commitMessage: string;
}

function getMultiCommitMessage(input: string) {
  const { candidateCount } = getPreferenceValues<PreferenceValues>();
  const count = candidateCount ? parseInt(candidateCount) : 1;
  return Promise.all(Array.from({ length: count }, () => getCommitMessage(input)));
}

export default function SearchCommitType(props: LaunchProps<{ arguments: SearchCommitTypeArgs }>) {
  const [input, setInput] = useState(props.arguments.commitMessage);

  const { isLoading, data: commitMessages } = usePromise(getMultiCommitMessage, [input]);
  return (
    <List
      searchBarPlaceholder={input || "Search your gitmoji..."}
      isLoading={isLoading}
      searchText={input}
      onSearchTextChange={setInput}
    >
      <List.Section title="Commit Message">
        {isLoading || !commitMessages ? (
          <List.Item title="Generating commit message..." />
        ) : (
          commitMessages
            .filter((commitMessage) => commitMessage !== undefined)
            .map((commitMessage) => (
              <List.Item
                key={commitMessage}
                title={commitMessage}
                detail={<List.Item.Detail markdown={commitMessage} />}
                actions={
                  <ActionPanel>
                    <PrimaryAction content={commitMessage} />
                    <ActionPanel.Section>
                      <Action.CopyToClipboard
                        content={commitMessage}
                        title="Copy Commit Type"
                        shortcut={{ modifiers: ["cmd", "shift"], key: "c" }}
                      />
                    </ActionPanel.Section>

                    <ActionPanel.Section>
                      <Action.Paste
                        content={commitMessage}
                        title="Paste Commit Type"
                        shortcut={{ modifiers: ["cmd", "shift"], key: "p" }}
                      />
                    </ActionPanel.Section>
                  </ActionPanel>
                }
              />
            ))
        )}
      </List.Section>
      <List.Section title="Gitmojis">
        {gitmojis.map((gitmoji) => (
          <GitmojiListItem key={gitmoji.name} gitmoji={gitmoji} />
        ))}
      </List.Section>
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
