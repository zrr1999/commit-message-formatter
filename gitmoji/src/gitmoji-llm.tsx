import { getPreferenceValues, getSelectedText, Clipboard, showToast, Toast } from "@raycast/api";
import { Gitmoji, PreferenceValues, gitmojis } from "./lib/types";
import { OpenAI } from "openai";
import { ChatCompletionTool } from "openai/resources";

async function ask(prompt: string, tools: ChatCompletionTool[]) {
  const { openAiApiKey, openAiBasePath, model } = getPreferenceValues<PreferenceValues>();

  const openai = new OpenAI({
    apiKey: openAiApiKey,
    baseURL: openAiBasePath,
  });

  const answer = await openai.chat.completions.create({
    model: model,
    messages: [{ role: "user", content: prompt }],
    tools: tools,
    tool_choice: "required",
  });
  return answer;
}

function getEmojiText(gitmoji: Gitmoji) {
  const { emojiFormat, copyFormat } = getPreferenceValues<PreferenceValues>();
  const { emoji, code, type } = gitmoji;
  let emojiText = emojiFormat === "emoji" ? emoji : code;

  if (copyFormat === "emoji-type") {
    emojiText = `${emojiText} ${type}`;
  }
  return emojiText;
}

export default async function GitmojiLLM() {
  const { action, terminator } = getPreferenceValues<PreferenceValues>();

  const prompt = `
You are a helpful assistant that generates commit messages based on the selected text.
The commit message must start with the specified format, such as "✨ feat:", followed by a short summary of the changes made.
Use imperative mood and write in lower case English.

**Important:** The commit type must be one of the following:
${gitmojis.map((gitmoji) => `${getEmojiText(gitmoji)}`).join("\n")}

**Important:** The commit message must be generated in English, even if the user provides input in another language.

Ensure the message adheres strictly to this format:
{type}{terminator}{message}
If you give a function calling, the terminator is not needed, and no blank symbol in the type andmessage.

Gitmojis' descriptions are as follows:
${gitmojis.map((gitmoji) => `${gitmoji.code} - ${gitmoji.desc}`).join("\n")}

For example, use "${getEmojiText(
    gitmojis[0]
  )}${terminator}add functionality for information retrieval" instead of longer descriptions.
`;

  const tools = [
    {
      type: "function" as const,
      function: {
        name: "generate_commit_message",
        parameters: {
          type: "object",
          properties: {
            type: { type: "string" },
            message: { type: "string" },
          },
          required: ["type", "message"],
          additionalProperties: false,
        },
      },
    },
  ];

  const selectedText = (await getSelectedText()) || (await Clipboard.readText());
  if (!selectedText) {
    await showToast({
      style: Toast.Style.Failure,
      title: "No text selected",
    });
    return;
  }
  try {
    const answer = await ask(`${prompt}\n\nSelected text: ${selectedText}`, tools);
    let commitMessage = answer.choices[0]?.message.content || "";
    if (answer.choices[0]?.message.tool_calls) {
      const toolCall = answer.choices[0]?.message.tool_calls[0];
      const toolCallFunction = toolCall.function;
      const functionArguments = JSON.parse(toolCallFunction.arguments);
      commitMessage = `${functionArguments.type}${terminator}${functionArguments.message}`;
    }
    if (action === "paste") {
      await Clipboard.paste(commitMessage);
    } else {
      await Clipboard.copy(commitMessage);
    }
  } catch (error) {
    await showToast({
      style: Toast.Style.Failure,
      title: "Failed to generate commit message",
      message: error.message,
    });
  }
}
