import 'dotenv/config';
import 'mocha';
import { expect } from 'chai';
import { send } from '../src/notify.js';

describe('notify', function () {
  describe('self-hosted service test:', function () {
    let apiUrl = '',
      accessToken: string | undefined,
      basicAuth: string | undefined,
      email: string | undefined,
      enableAttachTest = false,
      enableUnifiedPushTest = false;

    before(function () {
      apiUrl = process.env.SELF_HOSTED_API_URL || '';
      if (!apiUrl) {
        console.info('Skipping: To test self-hosted service, please set the SELF_HOSTED_API_URL environment variable in .env file.');
        this.skip();
      }

      accessToken = process.env.SELF_HOSTED_ACCESS_TOKEN;
      basicAuth = process.env.SELF_HOSTED_BASIC_AUTH;
      email = process.env.SELF_HOSTED_EMAIL;
      enableAttachTest = process.env.SELF_HOSTED_TEST_ATTACH === 'true';
      enableUnifiedPushTest = process.env.SELF_HOSTED_TEST_UNIFIED_PUSH === 'true';
    });

    it('send an empty message', async function () {
      const res = await send({
        apiUrl,
        accessToken,
        basicAuth,
      });
      expect(res).to.have.own.property('id');
      expect(res).to.have.own.property('time');
      expect(res).to.have.own.property('expires');
      expect(res).to.have.own.property('topic');
      expect(res).to.have.deep.property('event', 'message');
      expect(res).to.have.deep.property('message', 'triggered');
    });

    it('send a message', async function () {
      const res = await send({
        apiUrl,
        accessToken,
        basicAuth,
        message: 'This is a test message.',
      });
      expect(res).to.have.own.property('id');
      expect(res).to.have.own.property('time');
      expect(res).to.have.own.property('expires');
      expect(res).to.have.own.property('topic');
      expect(res).to.have.deep.property('event', 'message');
      expect(res).to.have.deep.property('message', 'This is a test message.');
    });

    it('send a message with title', async function () {
      const res = await send({
        apiUrl,
        accessToken,
        basicAuth,
        title: 'Test title',
        message: 'This is a test message with title.',
      });
      expect(res).to.have.own.property('id');
      expect(res).to.have.own.property('time');
      expect(res).to.have.own.property('expires');
      expect(res).to.have.own.property('topic');
      expect(res).to.have.deep.property('event', 'message');
      expect(res).to.have.deep.property('message', 'This is a test message with title.');
      expect(res).to.have.deep.property('title', 'Test title');
    });

    it('send a message with priority', async function () {
      const res = await send({
        apiUrl,
        accessToken,
        basicAuth,
        message: 'This is a test message with priority.',
        priority: 1,
      });
      expect(res).to.have.own.property('id');
      expect(res).to.have.own.property('time');
      expect(res).to.have.own.property('expires');
      expect(res).to.have.own.property('topic');
      expect(res).to.have.deep.property('event', 'message');
      expect(res).to.have.deep.property('message', 'This is a test message with priority.');
      expect(res).to.have.deep.property('priority', 1);
    });

    it('send a message with tags', async function () {
      const res = await send({
        apiUrl,
        accessToken,
        basicAuth,
        message: 'This is a test message with tags.',
        tags: ['test', 'shamrock'],
      });
      expect(res).to.have.own.property('id');
      expect(res).to.have.own.property('time');
      expect(res).to.have.own.property('expires');
      expect(res).to.have.own.property('topic');
      expect(res).to.have.deep.property('event', 'message');
      expect(res).to.have.deep.property('message', 'This is a test message with tags.');
      expect(res).to.have.deep.property('tags', ['test', 'shamrock']);
    });

    it('send a message with markdown', async function () {
      const res = await send({
        apiUrl,
        accessToken,
        basicAuth,
        message: 'This is a test message with **markdown**.',
        markdown: true,
      });
      expect(res).to.have.own.property('id');
      expect(res).to.have.own.property('time');
      expect(res).to.have.own.property('expires');
      expect(res).to.have.own.property('topic');
      expect(res).to.have.deep.property('event', 'message');
      expect(res).to.have.deep.property('message', 'This is a test message with **markdown**.');
      expect(res).to.have.deep.property('content_type', 'text/markdown');
    });

    it('send a message with click', async function () {
      const res = await send({
        apiUrl,
        accessToken,
        basicAuth,
        message: 'This is a test message with click.',
        click: 'https://ntfy.sh',
      });
      expect(res).to.have.own.property('id');
      expect(res).to.have.own.property('time');
      expect(res).to.have.own.property('expires');
      expect(res).to.have.own.property('topic');
      expect(res).to.have.deep.property('event', 'message');
      expect(res).to.have.deep.property('message', 'This is a test message with click.');
      expect(res).to.have.deep.property('click', 'https://ntfy.sh');
    });

    it('send a message with actions', async function () {
      const res = await send({
        apiUrl,
        accessToken,
        basicAuth,
        message: 'This is a test message with actions.',
        actions: [
          {
            action: 'view',
            label: 'View',
            url: 'https://ntfy.sh',
          },
          {
            action: 'copy',
            label: 'Copy',
            value: 'Test value',
            clear: true,
          },
        ],
      });
      expect(res).to.have.own.property('id');
      expect(res).to.have.own.property('time');
      expect(res).to.have.own.property('expires');
      expect(res).to.have.own.property('topic');
      expect(res).to.have.deep.property('event', 'message');
      expect(res).to.have.deep.property('message', 'This is a test message with actions.');
      expect(res).to.have.own.property('actions');
    });

    it('send a message with attach', async function () {
      if (!enableAttachTest) {
        console.log('Skipping: SELF_HOSTED_TEST_ATTACH environment variable is not set to true.');
        this.skip();
      }

      const res = await send({
        apiUrl,
        accessToken,
        basicAuth,
        message: 'This is a test message with attach.',
        attach: 'https://docs.ntfy.sh/static/img/ntfy.png',
      });
      expect(res).to.have.own.property('id');
      expect(res).to.have.own.property('time');
      expect(res).to.have.own.property('expires');
      expect(res).to.have.own.property('topic');
      expect(res).to.have.deep.property('event', 'message');
      expect(res).to.have.deep.property('message', 'This is a test message with attach.');
      expect(res).to.have.deep.property('attachment', { name: 'ntfy.png', url: 'https://docs.ntfy.sh/static/img/ntfy.png' });
    });

    it('send a message with attach and filename', async function () {
      if (!enableAttachTest) {
        console.log('Skipping: SELF_HOSTED_TEST_ATTACH environment variable is not set to true.');
        this.skip();
      }

      const res = await send({
        apiUrl,
        accessToken,
        basicAuth,
        message: 'This is a test message with attach and filename.',
        attach: 'https://docs.ntfy.sh/static/img/ntfy.png',
        filename: 'test.png',
      });
      expect(res).to.have.own.property('id');
      expect(res).to.have.own.property('time');
      expect(res).to.have.own.property('expires');
      expect(res).to.have.own.property('topic');
      expect(res).to.have.deep.property('event', 'message');
      expect(res).to.have.deep.property('message', 'This is a test message with attach and filename.');
      expect(res).to.have.deep.property('attachment', { name: 'test.png', url: 'https://docs.ntfy.sh/static/img/ntfy.png' });
    });

    it('send a message with local attach', async function () {
      if (!enableAttachTest) {
        console.log('Skipping: SELF_HOSTED_TEST_ATTACH environment variable is not set to true.');
        this.skip();
      }

      const res = await send({
        apiUrl,
        accessToken,
        basicAuth,
        message: 'This is a test message with local attach.',
        attach: 'test/ntfy.png',
      });
      expect(res).to.have.own.property('id');
      expect(res).to.have.own.property('time');
      expect(res).to.have.own.property('expires');
      expect(res).to.have.own.property('topic');
      expect(res).to.have.deep.property('event', 'message');
      expect(res).to.have.deep.property('message', 'This is a test message with local attach.');
      expect(res).to.have.own.property('attachment');
      expect(res.attachment).to.have.own.property('name');
      expect(res.attachment).to.have.own.property('url');
      expect(res.attachment).to.have.own.property('type');
      expect(res.attachment).to.have.own.property('size');
      expect(res.attachment).to.have.own.property('expires');
    });

    it('send a message with local attach and filename', async function () {
      if (!enableAttachTest) {
        console.log('Skipping: SELF_HOSTED_TEST_ATTACH environment variable is not set to true.');
        this.skip();
      }

      const res = await send({
        apiUrl,
        accessToken,
        basicAuth,
        message: 'This is a test message with local attach and filename.',
        attach: 'test/ntfy.png',
        filename: 'test.png',
      });
      expect(res).to.have.own.property('id');
      expect(res).to.have.own.property('time');
      expect(res).to.have.own.property('expires');
      expect(res).to.have.own.property('topic');
      expect(res).to.have.deep.property('event', 'message');
      expect(res).to.have.deep.property('message', 'This is a test message with local attach and filename.');
      expect(res).to.have.own.property('attachment');
      expect(res.attachment).to.have.deep.property('name', 'test.png');
      expect(res.attachment).to.have.own.property('url');
      expect(res.attachment).to.have.own.property('type');
      expect(res.attachment).to.have.own.property('size');
      expect(res.attachment).to.have.own.property('expires');
    });

    it('send a message with icon', async function () {
      const res = await send({
        apiUrl,
        accessToken,
        basicAuth,
        message: 'This is a test message with icon.',
        icon: 'https://docs.ntfy.sh/static/img/ntfy.png',
      });
      expect(res).to.have.own.property('id');
      expect(res).to.have.own.property('time');
      expect(res).to.have.own.property('expires');
      expect(res).to.have.own.property('topic');
      expect(res).to.have.deep.property('event', 'message');
      expect(res).to.have.deep.property('message', 'This is a test message with icon.');
      expect(res).to.have.deep.property('icon', 'https://docs.ntfy.sh/static/img/ntfy.png');
    });

    it('send a message with delay', async function () {
      const res = await send({
        apiUrl,
        accessToken,
        basicAuth,
        message: 'This is a test message with delay.',
        delay: '10s',
      });
      expect(res).to.have.own.property('id');
      expect(res).to.have.own.property('time');
      expect(res).to.have.own.property('expires');
      expect(res).to.have.own.property('topic');
      expect(res).to.have.deep.property('event', 'message');
      expect(res).to.have.deep.property('message', 'This is a test message with delay.');
    });

    it('send a message with email', async function () {
      if (!email) {
        console.log('Skipping: SELF_HOSTED_EMAIL environment variable is not set.');
        this.skip();
      }

      const res = await send({
        apiUrl,
        accessToken,
        basicAuth,
        message: 'This is a test message with email.',
        email,
      });
      expect(res).to.have.own.property('id');
      expect(res).to.have.own.property('time');
      expect(res).to.have.own.property('expires');
      expect(res).to.have.own.property('topic');
      expect(res).to.have.deep.property('event', 'message');
      expect(res).to.have.deep.property('message', 'This is a test message with email.');
    });

    it('send a message with sequenceId', async function () {
      const res = await send({
        apiUrl,
        accessToken,
        basicAuth,
        message: 'This is a test message with sequenceId.',
        sequenceId: 'testWithSequenceId',
      });
      expect(res).to.have.own.property('id');
      expect(res).to.have.own.property('time');
      expect(res).to.have.own.property('expires');
      expect(res).to.have.own.property('topic');
      expect(res).to.have.deep.property('event', 'message');
      expect(res).to.have.deep.property('message', 'This is a test message with sequenceId.');
      expect(res).to.have.deep.property('sequence_id', 'testWithSequenceId');
    });

    it('send a message with noCache', async function () {
      const res = await send({
        apiUrl,
        accessToken,
        basicAuth,
        message: 'This is a test message with noCache.',
        noCache: true,
      });
      expect(res).to.have.own.property('id');
      expect(res).to.have.own.property('time');
      expect(res).to.have.own.property('topic');
      expect(res).to.have.deep.property('event', 'message');
      expect(res).to.have.deep.property('message', 'This is a test message with noCache.');
      expect(res).to.not.have.own.property('expires');
    });

    it('send a message with noFirebase', async function () {
      const res = await send({
        apiUrl,
        accessToken,
        basicAuth,
        message: 'This is a test message with noFirebase.',
        noFirebase: true,
      });
      expect(res).to.have.own.property('id');
      expect(res).to.have.own.property('time');
      expect(res).to.have.own.property('expires');
      expect(res).to.have.own.property('topic');
      expect(res).to.have.deep.property('event', 'message');
      expect(res).to.have.deep.property('message', 'This is a test message with noFirebase.');
    });

    it('send a message with unifiedPush', async function () {
      if (!enableUnifiedPushTest) {
        console.log('Skipping: SELF_HOSTED_TEST_UNIFIED_PUSH environment variable is not set to true.');
        this.skip();
      }

      const res = await send({
        apiUrl,
        accessToken,
        basicAuth,
        message: 'This is a test message with unifiedPush.',
        unifiedPush: true,
      });
      expect(res).to.have.own.property('id');
      expect(res).to.have.own.property('time');
      expect(res).to.have.own.property('expires');
      expect(res).to.have.own.property('topic');
      expect(res).to.have.deep.property('event', 'message');
      expect(res).to.have.deep.property('message', 'This is a test message with unifiedPush.');
    });

    it('send a message with pollId', async function () {
      const res = await send({
        apiUrl,
        accessToken,
        basicAuth,
        message: 'This is a test message with pollId.',
        pollId: 'testWithPollId',
      });
      expect(res).to.have.own.property('id');
      expect(res).to.have.own.property('time');
      expect(res).to.have.own.property('topic');
      expect(res).to.have.deep.property('event', 'poll_request');
      expect(res).to.have.deep.property('message', 'New message');
    });

    it('send a message with template', async function () {
      const res = await send({
        apiUrl,
        accessToken,
        basicAuth,
        message: '{"status": "resolved", "title": "Test title", "message": "This is a test message with template."}',
        template: 'grafana',
      });
      expect(res).to.have.own.property('id');
      expect(res).to.have.own.property('time');
      expect(res).to.have.own.property('expires');
      expect(res).to.have.own.property('topic');
      expect(res).to.have.deep.property('event', 'message');
      expect(res).to.have.deep.property('title', '✅ Test title');
      expect(res).to.have.deep.property('message', 'This is a test message with template.');
    });
  });

  describe('ntfy.sh test:', function () {
    let apiUrl = '',
      accessToken: string | undefined,
      basicAuth: string | undefined,
      email: string | undefined,
      call: string | undefined,
      enableUnifiedPushTest = false;

    before(function () {
      const ntfyTopic = process.env.NTFY_SH_TOPIC;
      if (ntfyTopic) {
        apiUrl = `https://ntfy.sh/${ntfyTopic}`;
      }

      if (!apiUrl) {
        console.info('Skipping: To test ntfy.sh service, please set the NTFY_SH_TOPIC environment variable in .env file.');
        this.skip();
      }

      accessToken = process.env.NTFY_ACCESS_TOKEN;
      basicAuth = process.env.NTFY_BASIC_AUTH;
      email = process.env.NTFY_EMAIL;
      call = process.env.NTFY_CALL;
      enableUnifiedPushTest = process.env.NTFY_TEST_UNIFIED_PUSH === 'true';
    });

    it('send an empty message', async function () {
      const res = await send({
        apiUrl,
        accessToken,
        basicAuth,
      });
      expect(res).to.have.own.property('id');
      expect(res).to.have.own.property('time');
      expect(res).to.have.own.property('expires');
      expect(res).to.have.own.property('topic');
      expect(res).to.have.deep.property('event', 'message');
      expect(res).to.have.deep.property('message', 'triggered');
    });

    it('send a message', async function () {
      const res = await send({
        apiUrl,
        accessToken,
        basicAuth,
        message: 'This is a test message.',
      });
      expect(res).to.have.own.property('id');
      expect(res).to.have.own.property('time');
      expect(res).to.have.own.property('expires');
      expect(res).to.have.own.property('topic');
      expect(res).to.have.deep.property('event', 'message');
      expect(res).to.have.deep.property('message', 'This is a test message.');
    });

    it('send a message with title', async function () {
      const res = await send({
        apiUrl,
        accessToken,
        basicAuth,
        title: 'Test title',
        message: 'This is a test message with title.',
      });
      expect(res).to.have.own.property('id');
      expect(res).to.have.own.property('time');
      expect(res).to.have.own.property('expires');
      expect(res).to.have.own.property('topic');
      expect(res).to.have.deep.property('event', 'message');
      expect(res).to.have.deep.property('message', 'This is a test message with title.');
      expect(res).to.have.deep.property('title', 'Test title');
    });

    it('send a message with priority', async function () {
      const res = await send({
        apiUrl,
        accessToken,
        basicAuth,
        message: 'This is a test message with priority.',
        priority: 1,
      });
      expect(res).to.have.own.property('id');
      expect(res).to.have.own.property('time');
      expect(res).to.have.own.property('expires');
      expect(res).to.have.own.property('topic');
      expect(res).to.have.deep.property('event', 'message');
      expect(res).to.have.deep.property('message', 'This is a test message with priority.');
      expect(res).to.have.deep.property('priority', 1);
    });

    it('send a message with tags', async function () {
      const res = await send({
        apiUrl,
        accessToken,
        basicAuth,
        message: 'This is a test message with tags.',
        tags: ['test', 'shamrock'],
      });
      expect(res).to.have.own.property('id');
      expect(res).to.have.own.property('time');
      expect(res).to.have.own.property('expires');
      expect(res).to.have.own.property('topic');
      expect(res).to.have.deep.property('event', 'message');
      expect(res).to.have.deep.property('message', 'This is a test message with tags.');
      expect(res).to.have.deep.property('tags', ['test', 'shamrock']);
    });

    it('send a message with markdown', async function () {
      const res = await send({
        apiUrl,
        accessToken,
        basicAuth,
        message: 'This is a test message with **markdown**.',
        markdown: true,
      });
      expect(res).to.have.own.property('id');
      expect(res).to.have.own.property('time');
      expect(res).to.have.own.property('expires');
      expect(res).to.have.own.property('topic');
      expect(res).to.have.deep.property('event', 'message');
      expect(res).to.have.deep.property('message', 'This is a test message with **markdown**.');
      expect(res).to.have.deep.property('content_type', 'text/markdown');
    });

    it('send a message with click', async function () {
      const res = await send({
        apiUrl,
        accessToken,
        basicAuth,
        message: 'This is a test message with click.',
        click: 'https://ntfy.sh',
      });
      expect(res).to.have.own.property('id');
      expect(res).to.have.own.property('time');
      expect(res).to.have.own.property('expires');
      expect(res).to.have.own.property('topic');
      expect(res).to.have.deep.property('event', 'message');
      expect(res).to.have.deep.property('message', 'This is a test message with click.');
      expect(res).to.have.deep.property('click', 'https://ntfy.sh');
    });

    it('send a message with actions', async function () {
      const res = await send({
        apiUrl,
        accessToken,
        basicAuth,
        message: 'This is a test message with actions.',
        actions: [
          {
            action: 'view',
            label: 'View',
            url: 'https://ntfy.sh',
          },
          {
            action: 'copy',
            label: 'Copy',
            value: 'Test value',
            clear: true,
          },
        ],
      });
      expect(res).to.have.own.property('id');
      expect(res).to.have.own.property('time');
      expect(res).to.have.own.property('expires');
      expect(res).to.have.own.property('topic');
      expect(res).to.have.deep.property('event', 'message');
      expect(res).to.have.deep.property('message', 'This is a test message with actions.');
      expect(res).to.have.own.property('actions');
    });

    it('send a message with attach', async function () {
      const res = await send({
        apiUrl,
        accessToken,
        basicAuth,
        message: 'This is a test message with attach.',
        attach: 'https://docs.ntfy.sh/static/img/ntfy.png',
      });
      expect(res).to.have.own.property('id');
      expect(res).to.have.own.property('time');
      expect(res).to.have.own.property('expires');
      expect(res).to.have.own.property('topic');
      expect(res).to.have.deep.property('event', 'message');
      expect(res).to.have.deep.property('message', 'This is a test message with attach.');
      expect(res).to.have.deep.property('attachment', { name: 'ntfy.png', url: 'https://docs.ntfy.sh/static/img/ntfy.png' });
    });

    it('send a message with attach and filename', async function () {
      const res = await send({
        apiUrl,
        accessToken,
        basicAuth,
        message: 'This is a test message with attach and filename.',
        attach: 'https://docs.ntfy.sh/static/img/ntfy.png',
        filename: 'test.png',
      });
      expect(res).to.have.own.property('id');
      expect(res).to.have.own.property('time');
      expect(res).to.have.own.property('expires');
      expect(res).to.have.own.property('topic');
      expect(res).to.have.deep.property('event', 'message');
      expect(res).to.have.deep.property('message', 'This is a test message with attach and filename.');
      expect(res).to.have.deep.property('attachment', { name: 'test.png', url: 'https://docs.ntfy.sh/static/img/ntfy.png' });
    });

    it('send a message with local attach', async function () {
      const res = await send({
        apiUrl,
        accessToken,
        basicAuth,
        message: 'This is a test message with local attach.',
        attach: 'test/ntfy.png',
      });
      expect(res).to.have.own.property('id');
      expect(res).to.have.own.property('time');
      expect(res).to.have.own.property('expires');
      expect(res).to.have.own.property('topic');
      expect(res).to.have.deep.property('event', 'message');
      expect(res).to.have.deep.property('message', 'This is a test message with local attach.');
      expect(res).to.have.own.property('attachment');
      expect(res.attachment).to.have.own.property('name');
      expect(res.attachment).to.have.own.property('url');
      expect(res.attachment).to.have.own.property('type');
      expect(res.attachment).to.have.own.property('size');
      expect(res.attachment).to.have.own.property('expires');
    });

    it('send a message with local attach and filename', async function () {
      const res = await send({
        apiUrl,
        accessToken,
        basicAuth,
        message: 'This is a test message with local attach and filename.',
        attach: 'test/ntfy.png',
        filename: 'test.png',
      });
      expect(res).to.have.own.property('id');
      expect(res).to.have.own.property('time');
      expect(res).to.have.own.property('expires');
      expect(res).to.have.own.property('topic');
      expect(res).to.have.deep.property('event', 'message');
      expect(res).to.have.deep.property('message', 'This is a test message with local attach and filename.');
      expect(res).to.have.own.property('attachment');
      expect(res.attachment).to.have.deep.property('name', 'test.png');
      expect(res.attachment).to.have.own.property('url');
      expect(res.attachment).to.have.own.property('type');
      expect(res.attachment).to.have.own.property('size');
      expect(res.attachment).to.have.own.property('expires');
    });

    it('send a message with icon', async function () {
      const res = await send({
        apiUrl,
        accessToken,
        basicAuth,
        message: 'This is a test message with icon.',
        icon: 'https://docs.ntfy.sh/static/img/ntfy.png',
      });
      expect(res).to.have.own.property('id');
      expect(res).to.have.own.property('time');
      expect(res).to.have.own.property('expires');
      expect(res).to.have.own.property('topic');
      expect(res).to.have.deep.property('event', 'message');
      expect(res).to.have.deep.property('message', 'This is a test message with icon.');
      expect(res).to.have.deep.property('icon', 'https://docs.ntfy.sh/static/img/ntfy.png');
    });

    it('send a message with delay', async function () {
      const res = await send({
        apiUrl,
        accessToken,
        basicAuth,
        message: 'This is a test message with delay.',
        delay: '10s',
      });
      expect(res).to.have.own.property('id');
      expect(res).to.have.own.property('time');
      expect(res).to.have.own.property('expires');
      expect(res).to.have.own.property('topic');
      expect(res).to.have.deep.property('event', 'message');
      expect(res).to.have.deep.property('message', 'This is a test message with delay.');
    });

    it('send a message with email', async function () {
      if (!email) {
        console.log('Skipping: NTFY_EMAIL environment variable is not set.');
        this.skip();
      }

      const res = await send({
        apiUrl,
        accessToken,
        basicAuth,
        message: 'This is a test message with email.',
        email,
      });
      expect(res).to.have.own.property('id');
      expect(res).to.have.own.property('time');
      expect(res).to.have.own.property('expires');
      expect(res).to.have.own.property('topic');
      expect(res).to.have.deep.property('event', 'message');
      expect(res).to.have.deep.property('message', 'This is a test message with email.');
    });

    it('send a message with call', async function () {
      if (!call) {
        console.log('Skipping: NTFY_CALL environment variable is not set.');
        this.skip();
      }

      const res = await send({
        apiUrl,
        accessToken,
        basicAuth,
        message: 'This is a test message with call.',
        call,
      });
      expect(res).to.have.own.property('id');
      expect(res).to.have.own.property('time');
      expect(res).to.have.own.property('topic');
      expect(res).to.have.own.property('event');
    });

    it('send a message with sequenceId', async function () {
      const res = await send({
        apiUrl,
        accessToken,
        basicAuth,
        message: 'This is a test message with sequenceId.',
        sequenceId: 'testWithSequenceId',
      });
      expect(res).to.have.own.property('id');
      expect(res).to.have.own.property('time');
      expect(res).to.have.own.property('expires');
      expect(res).to.have.own.property('topic');
      expect(res).to.have.deep.property('event', 'message');
      expect(res).to.have.deep.property('message', 'This is a test message with sequenceId.');
      expect(res).to.have.deep.property('sequence_id', 'testWithSequenceId');
    });

    it('send a message with noCache', async function () {
      const res = await send({
        apiUrl,
        accessToken,
        basicAuth,
        message: 'This is a test message with noCache.',
        noCache: true,
      });
      expect(res).to.have.own.property('id');
      expect(res).to.have.own.property('time');
      expect(res).to.have.own.property('topic');
      expect(res).to.have.deep.property('event', 'message');
      expect(res).to.have.deep.property('message', 'This is a test message with noCache.');
      expect(res).to.not.have.own.property('expires');
    });

    it('send a message with noFirebase', async function () {
      const res = await send({
        apiUrl,
        accessToken,
        basicAuth,
        message: 'This is a test message with noFirebase.',
        noFirebase: true,
      });
      expect(res).to.have.own.property('id');
      expect(res).to.have.own.property('time');
      expect(res).to.have.own.property('expires');
      expect(res).to.have.own.property('topic');
      expect(res).to.have.deep.property('event', 'message');
      expect(res).to.have.deep.property('message', 'This is a test message with noFirebase.');
    });

    it('send a message with unifiedPush', async function () {
      if (!enableUnifiedPushTest) {
        console.log('Skipping: NTFY_TEST_UNIFIED_PUSH environment variable is not set to true.');
        this.skip();
      }

      const res = await send({
        apiUrl,
        accessToken,
        basicAuth,
        message: 'This is a test message with unifiedPush.',
        unifiedPush: true,
      });
      expect(res).to.have.own.property('id');
      expect(res).to.have.own.property('time');
      expect(res).to.have.own.property('expires');
      expect(res).to.have.own.property('topic');
      expect(res).to.have.deep.property('event', 'message');
      expect(res).to.have.deep.property('message', 'This is a test message with unifiedPush.');
    });

    it('send a message with pollId', async function () {
      const res = await send({
        apiUrl,
        accessToken,
        basicAuth,
        message: 'This is a test message with pollId.',
        pollId: 'testWithPollId',
      });
      expect(res).to.have.own.property('id');
      expect(res).to.have.own.property('time');
      expect(res).to.have.own.property('topic');
      expect(res).to.have.deep.property('event', 'poll_request');
      expect(res).to.have.deep.property('message', 'New message');
    });

    it('send a message with template', async function () {
      const res = await send({
        apiUrl,
        accessToken,
        basicAuth,
        message: '{"status": "resolved", "title": "Test title", "message": "This is a test message with template."}',
        template: 'grafana',
      });
      expect(res).to.have.own.property('id');
      expect(res).to.have.own.property('time');
      expect(res).to.have.own.property('expires');
      expect(res).to.have.own.property('topic');
      expect(res).to.have.deep.property('event', 'message');
      expect(res).to.have.deep.property('title', '✅ Test title');
      expect(res).to.have.deep.property('message', 'This is a test message with template.');
    });
  });
});
