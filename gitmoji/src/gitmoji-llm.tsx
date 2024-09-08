import { getPreferenceValues, getSelectedText, Clipboard, showToast, Toast } from "@raycast/api";
import { Gitmoji, PreferenceValues, gitmojis } from "./lib/types";
import { OpenAI } from "openai";

async function ask(prompt: string) {
  const { openAiApiKey, openAiBasePath } = getPreferenceValues<PreferenceValues>();

  const openai = new OpenAI({
    apiKey: openAiApiKey,
    baseURL: openAiBasePath,
  });

  const stream = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    stream: true,
  });
  return stream;
}

function getEmojiText(gitmoji: Gitmoji) {
  const { emojiFormat, copyFormat, terminator } = getPreferenceValues<PreferenceValues>();
  const { emoji, code, type } = gitmoji;
  let emojiText = emojiFormat === "emoji" ? emoji : code;

  if (copyFormat === "emoji-type") {
    emojiText = `${emojiText} ${type}${terminator}`;
  }
  return emojiText;
}

export default async function GitmojiLLM() {
  const { action } = getPreferenceValues<PreferenceValues>();

  const gitmojiPrompt = gitmojis.map((gitmoji) => `${getEmojiText(gitmoji)}short commit message`).join("\n");
  const prompt = `
You are a helpful assistant that generates commit messages based on the selected text.
The commit message must start with the specified format, such as "✨ feat:", followed by a short summary of the changes made.
Use imperative mood and write in lower case English.

**Important:** The commit message must be generated in English, even if the user provides input in another language.

Ensure the message adheres strictly to this format:
${gitmojiPrompt}

Gitmojis' descriptions are as follows:
${gitmojis.map((gitmoji) => `${gitmoji.code} - ${gitmoji.desc}`).join("\n")}

For example, use "✨ feat: add functionality for information retrieval" instead of longer descriptions.
  `;

  const selectedText = await getSelectedText();

  try {
    const stream = await ask(`${prompt}\n\nSelected text: ${selectedText}`);
    let allData = "";

    if (action === "paste") {
      for await (const chunk of stream) {
        console.log(chunk.choices[0]?.delta?.content);
        allData += chunk.choices[0]?.delta?.content || "";
        await Clipboard.paste(allData);
      }
    } else {
      for await (const chunk of stream) {
        allData += chunk.choices[0]?.delta?.content || "";
      }
      await Clipboard.copy(allData);
    }
  } catch (error) {
    await showToast({
      style: Toast.Style.Failure,
      title: "Failed to generate commit message",
    });
  }
}
