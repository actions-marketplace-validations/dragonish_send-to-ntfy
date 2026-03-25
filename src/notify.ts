import got, { HTTPError } from 'got';
import { createReadStream } from 'node:fs';
import { getSafeValue } from './common.js';

function isLocalPath(path: string): boolean {
  return !/^https?:\/\//i.test(path);
}

function viewActionToHeader(action: ViewAction): string {
  const { label, url, clear } = action;
  const arr: string[] = ['view', getSafeValue(label), getSafeValue(url)];

  if (clear) {
    arr.push('clear=true');
  }

  return arr.join(', ');
}

function broadcastActionToHeader(action: BroadcastAction): string {
  const { label, intent, extras, clear } = action;
  const arr: string[] = ['broadcast', getSafeValue(label)];

  if (extras) {
    for (const key of Object.keys(extras)) {
      arr.push(`extras.${key}=${getSafeValue(extras[key])}`);
    }
  }
  if (intent) {
    arr.push('intent=' + getSafeValue(intent));
  }
  if (clear) {
    arr.push('clear=true');
  }

  return arr.join(', ');
}

function httpActionToHeader(action: HttpAction): string {
  const { label, url, method, headers, body, clear } = action;
  const arr: string[] = ['http', getSafeValue(label), getSafeValue(url)];

  if (method) {
    arr.push('method=' + getSafeValue(method));
  }
  if (headers) {
    for (const key of Object.keys(headers)) {
      arr.push(`headers.${key}=${getSafeValue(headers[key])}`);
    }
  }
  if (body) {
    arr.push('body=' + getSafeValue(body));
  }
  if (clear) {
    arr.push('clear=true');
  }

  return arr.join(', ');
}

function copyActionToHeader(action: CopyAction): string {
  const { label, value, clear } = action;
  const arr: string[] = ['copy', getSafeValue(label), getSafeValue(value)];

  if (clear) {
    arr.push('clear=true');
  }

  return arr.join(', ');
}

export async function send(inputs: SendInputs) {
  const {
    apiUrl,
    message,
    title,
    tags,
    priority,
    markdown,
    click,
    actions,
    attach,
    filename,
    icon,
    delay,
    email,
    call,
    sequenceId,
    noCache,
    noFirebase,
    unifiedPush,
    pollId,
    template,
    accessToken,
    basicAuth,
  } = inputs;

  const headers: MessageHeaders = {};

  if (priority) {
    headers['X-Priority'] = priority.toString();
  }

  if (tags && tags.length > 0) {
    headers['X-Tags'] = tags.join(',');
  }
  if (title) {
    headers['X-Title'] = title;
  }
  if (markdown) {
    headers['X-Markdown'] = 'true';
  }
  if (click) {
    headers['X-Click'] = click;
  }
  if (icon) {
    headers['X-Icon'] = icon;
  }

  if (email) {
    headers['X-Email'] = email;
  }

  if (call) {
    headers['X-Call'] = call;
  }

  if (actions && actions.length > 0) {
    const xActions: string[] = [];
    for (const actionItem of actions) {
      switch (actionItem.action) {
        case 'view':
          xActions.push(viewActionToHeader(actionItem));
          break;
        case 'broadcast':
          xActions.push(broadcastActionToHeader(actionItem));
          break;
        case 'http':
          xActions.push(httpActionToHeader(actionItem));
          break;
        case 'copy':
          xActions.push(copyActionToHeader(actionItem));
          break;
      }
    }

    headers['X-Actions'] = xActions.join('; ');
  }

  if (delay) {
    headers['X-Delay'] = delay;
  }

  if (sequenceId) {
    headers['X-Sequence-ID'] = sequenceId;
  }

  if (noCache) {
    headers['X-Cache'] = 'no';
  }

  if (noFirebase) {
    headers['X-Firebase'] = 'no';
  }

  if (unifiedPush) {
    headers['X-UnifiedPush'] = '1';
  }

  if (pollId) {
    headers['X-Poll-ID'] = pollId;
  }

  if (template) {
    headers['X-Template'] = template;
  }

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  } else if (basicAuth) {
    headers['Authorization'] = `Basic ${basicAuth}`;
  }

  try {
    if (attach && isLocalPath(attach)) {
      if (message) {
        headers['X-Message'] = message;
      }
      if (filename) {
        headers['X-Filename'] = filename;
      }

      const res = await got
        .put<MessageResponse>(apiUrl, {
          retry: {
            limit: 1,
          },
          timeout: {
            request: 60000,
          },
          headers,
          body: createReadStream(attach),
          responseType: 'json',
        })
        .json<MessageResponse>();

      return res;
    } else {
      if (attach) {
        headers['X-Attach'] = attach;

        if (filename) {
          headers['X-Filename'] = filename;
        }
      }

      const res = await got
        .post<MessageResponse>(apiUrl, {
          retry: {
            limit: 1,
          },
          timeout: {
            request: 30000,
          },
          headers,
          responseType: 'json',
          body: message,
        })
        .json<MessageResponse>();

      return res;
    }
  } catch (err) {
    if (err instanceof HTTPError && err.response.body) {
      const bad: BadResponse = err.response.body;
      throw new Error(bad.errorDescription, { cause: err });
    } else {
      throw new Error('Other types of errors (network errors, timeouts, etc.).', { cause: err });
    }
  }
}
