import 'mocha';
import { expect } from 'chai';
import { getSafeValue, parseString, parseApiUrl, parsePriority, parseBoolean, parseTags, parseActions } from '../src/common.js';

describe('common', function () {
  it('getSafeValue', function () {
    expect(getSafeValue('hello')).to.eq('hello');
    expect(getSafeValue('hello,world')).to.eq('"hello,world"');
    expect(getSafeValue('hello;world')).to.eq('"hello;world"');
    expect(getSafeValue('hello,world;test')).to.eq('"hello,world;test"');
    expect(getSafeValue('')).to.eq('');
  });

  it('parseString', function () {
    expect(parseString('test', '')).to.eq('test');
    expect(parseString('', 'test')).to.eq('test');
  });

  it('parseApiUrl', function () {
    expect(parseApiUrl('https://ntfy.sh', 'test')).to.eq('https://ntfy.sh/test');
    expect(parseApiUrl('https://ntfy.sh/', 'test')).to.eq('https://ntfy.sh/test');
  });

  it('parsePriority', function () {
    expect(parsePriority('0', 3)).to.eq(3);
    expect(parsePriority('6', 3)).to.eq(3);
    expect(parsePriority('1', 3)).to.eq(1);
    expect(parsePriority('-1', 3)).to.eq(3);
    expect(parsePriority('0.1', 3)).to.eq(3);
    expect(parsePriority('1.1', 3)).to.eq(1);
    expect(parsePriority('-1.1', 3)).to.eq(3);
    expect(parsePriority('', 3)).to.eq(3);
    expect(parsePriority('a', 3)).to.eq(3);
  });

  it('parseBoolean', function () {
    expect(parseBoolean('')).to.be.false;
    expect(parseBoolean('0')).to.be.false;
    expect(parseBoolean('1')).to.be.true;
    expect(parseBoolean('no')).to.be.false;
    expect(parseBoolean('yes')).to.be.true;
    expect(parseBoolean('false')).to.be.false;
    expect(parseBoolean('true')).to.be.true;
    expect(parseBoolean('off')).to.be.false;
    expect(parseBoolean('on')).to.be.true;
    expect(parseBoolean('test')).to.be.false;
  });

  it('parseTags', function () {
    expect(parseTags('')).to.be.empty;
    expect(parseTags(' ')).to.be.empty;
    expect(parseTags('warning')).to.deep.eq(['warning']);
    expect(parseTags('warning,computer')).to.deep.eq(['warning', 'computer']);
    expect(parseTags('warning, computer')).to.deep.eq(['warning', 'computer']);
    expect(parseTags('+1,-1')).to.deep.eq(['+1', '-1']);
  });

  it('parseActions', function () {
    expect(parseActions('')).to.be.undefined;
    expect(parseActions('test')).to.be.null;
    expect(parseActions('{}')).to.be.null;
    expect(parseActions('{"test": "value"}')).to.be.null;
    expect(parseActions('[]')).to.deep.eq([]);

    expect(parseActions('[{"action": "view", "label": "Open", "url": "https://ntfy.sh"}]')).to.deep.eq([
      { action: 'view', label: 'Open', url: 'https://ntfy.sh' },
    ]);
    expect(parseActions('[{"action":"view", "label": "Open"]')).to.be.null;

    expect(parseActions('[{"action": "broadcast", "label": "Take picture"}]')).to.deep.eq([{ action: 'broadcast', label: 'Take picture' }]);
    expect(parseActions('[{"action": "broadcast", "label": "Take picture", "extras":{"cmd": "pic", "camera": "front"}}]')).to.deep.eq([
      { action: 'broadcast', label: 'Take picture', extras: { cmd: 'pic', camera: 'front' } },
    ]);
    expect(parseActions('[{"action": "broadcast"}')).to.be.null;

    expect(parseActions('[{"action": "http", "label": "Close", "url": "https://ntfy.sh"}]')).to.deep.eq([
      { action: 'http', label: 'Close', url: 'https://ntfy.sh' },
    ]);
    expect(parseActions('[{"action": "http", "label": "Close", "url": "https://ntfy.sh", "body": "{\\"action\\": \\"close\\"}"}]')).to.deep.eq([
      { action: 'http', label: 'Close', url: 'https://ntfy.sh', body: '{"action": "close"}' },
    ]);
    expect(parseActions('[{"action": "http", "label": "Close"}')).to.be.null;

    expect(parseActions('[{"action": "copy", "label": "Copy", "value": "123456"}]')).to.deep.eq([{ action: 'copy', label: 'Copy', value: '123456' }]);
    expect(parseActions('[{"action":"copy", "label": "Copy"]')).to.be.null;

    expect(parseActions('[{"action": "view", "label": "Open", "url": "https://ntfy.sh"}, {"action": "copy", "label": "Copy", "value": "123456"}]')).to.deep.eq([
      { action: 'view', label: 'Open', url: 'https://ntfy.sh' },
      { action: 'copy', label: 'Copy', value: '123456' },
    ]);

    expect(parseActions('[{"action": "test", "label": "Test"}]')).to.be.null;
    expect(parseActions('[{"action": "view", "label": "Open", "url": "https://ntfy.sh"}, {"action": "test", "label": "Test"}]')).to.be.null;
  });
});
