import prompts from 'prompts';

// prompts is badly typed so we have some more specific typed APIs
// prompts also returns an undefined value on SIGINT which we really just want to exit on

async function confirmPromptImpl(message) {
  let initial = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  const {
    value
  } = await prompts({
    name: 'value',
    type: 'confirm',
    message,
    initial
  });
  if (value === undefined) {
    process.exit(1);
  }
  return value;
}
async function textPromptImpl(message) {
  const {
    value
  } = await prompts({
    name: 'value',
    type: 'text',
    message
  });
  if (value === undefined) {
    process.exit(1);
  }
  return value;
}
let shouldPrompt = process.stdout.isTTY && !process.env.SKIP_PROMPTS;
let confirmPrompt = confirmPromptImpl;
let textPrompt = textPromptImpl;

export { confirmPrompt as c, shouldPrompt as s, textPrompt as t };
