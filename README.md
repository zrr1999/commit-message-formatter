# Gitmoji Commit

[Gitmoji Commit](https://github.com/zrr1999/gitmoji-commit) is an emoji commit messages generator.

## Features

- [x] Search gitmoji by name
- [x] Generate commit message by LLM following selected text
- [ ] History of generated commit messages
- [ ] Support custom emojis
- [ ] Integrate with git diff
- [ ] Let LLM generate string type and use predefined function to generate type of commit message

## Preferences

You can customize the following preferences:

- `Emoji Format`: Choose between emoji and emoji code.
- `Copy Format`: Choose between `emoji-type` and `emoji`.
- `Terminator`: Change the terminator of the commit message.
- `Action`: Choose between `Copy to Clipboard` and `Paste into Editor`.

## Customize

You can fork this repo and change the `src/lib/types.ts` to add more gitmojis.
