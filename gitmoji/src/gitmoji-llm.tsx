import { getPreferenceValues, getSelectedText, Clipboard, AI, showToast, Toast } from "@raycast/api";
import { Gitmoji, PreferenceValues, gitmojis } from "./lib/types";

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

  try {
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
  } catch (error) {
    await showToast({
      style: Toast.Style.Failure,
      title: "Failed to generate commit message",
    });
  }
}
