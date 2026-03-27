import * as core from '@actions/core';
import { defaultValues } from './data.js';
import { parseApiUrl, parseString, parsePriority, parseBoolean, parseTags, parseActions } from './common.js';
import { send } from './notify.js';

function panic(msg: string) {
  core.error(msg);
  core.setFailed(msg);
}

function output(obj: Outputs) {
  for (const key of Object.keys(obj)) {
    core.setOutput(key, obj[key]);
  }
}

async function main() {
  const inputs: Inputs = {
    topic: core.getInput('topic', { required: true }),
    message: core.getInput('message'),
    title: core.getInput('title'),
    tags: core.getInput('tags'),
    priority: core.getInput('priority'),
    markdown: core.getInput('markdown'),
    click: core.getInput('click'),
    actions: core.getInput('actions'),
    attach: core.getInput('attach'),
    filename: core.getInput('filename'),
    icon: core.getInput('icon'),
    delay: core.getInput('delay'),
    email: core.getInput('email'),
    call: core.getInput('call'),
    sequenceId: core.getInput('sequence-id'),
    noCache: core.getInput('no-cache'),
    noFirebase: core.getInput('no-firebase'),
    unifiedPush: core.getInput('unified-push'),
    pollId: core.getInput('poll-id'),
    template: core.getInput('template'),
    baseUrl: core.getInput('base-url'),
    accessToken: core.getInput('access-token'),
    basicAuth: core.getInput('basic-auth'),
    username: core.getInput('username'),
    password: core.getInput('password'),
  };

  if (!inputs.topic) {
    panic('Target topic name is empty!');
    return;
  }

  const apiUrl = parseApiUrl(parseString(inputs.baseUrl, defaultValues.baseUrl), inputs.topic);
  const priority = parsePriority(inputs.priority, defaultValues.priority);
  const tags = parseTags(inputs.tags);
  const actions = parseActions(inputs.actions);
  if (actions === null) {
    core.warning('Error in parsing of actions!');
  }

  core.info('Sending message...');

  try {
    const res = await send({
      apiUrl,
      priority,
      message: inputs.message,
      title: inputs.title,
      tags,
      markdown: parseBoolean(inputs.markdown),
      click: inputs.click,
      actions,
      attach: inputs.attach,
      filename: inputs.filename,
      icon: inputs.icon,
      delay: inputs.delay,
      email: inputs.email,
      call: inputs.call,
      sequenceId: inputs.sequenceId,
      noCache: parseBoolean(inputs.noCache),
      noFirebase: parseBoolean(inputs.noFirebase),
      unifiedPush: parseBoolean(inputs.unifiedPush),
      pollId: inputs.pollId,
      template: inputs.template,
      accessToken: inputs.accessToken,
      basicAuth: inputs.basicAuth,
      username: inputs.username,
      password: inputs.password,
    });

    core.info('Message sent successfully.');
    const {
      id,
      time,
      expires = 0,
      event,
      topic,
      sequence_id = '',
      message = '',
      title = '',
      tags: resTags = [],
      priority: resPriority = 0,
      click = '',
      actions: resActions = [],
      attachment,
    } = res;
    output({
      success: 'true',
      id,
      time,
      expires,
      event,
      topic,
      sequence_id,
      message,
      title,
      tags: resTags,
      priority: resPriority,
      click,
      actions: resActions,
      attachment: attachment ? JSON.stringify(attachment) : '',
    });
  } catch (err) {
    const msg = (err as unknown as Error).message;
    core.error('Failed to send message!');
    core.error(`Error: ${msg}`);
    output({
      success: 'false',
      id: '',
      time: 0,
      expires: 0,
      event: '',
      topic: inputs.topic,
      sequence_id: '',
      message: inputs.message,
      title: inputs.title,
      tags,
      priority,
      click: inputs.click,
      actions: actions || [],
      attachment: '',
    });
  }
}

main();
