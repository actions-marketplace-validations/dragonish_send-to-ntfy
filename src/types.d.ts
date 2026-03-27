type InputType =
  | 'topic'
  | 'message'
  | 'title'
  | 'tags'
  | 'priority'
  | 'markdown'
  | 'click'
  | 'actions'
  | 'attach'
  | 'filename'
  | 'icon'
  | 'delay'
  | 'email'
  | 'call'
  | 'sequenceId'
  | 'noCache'
  | 'noFirebase'
  | 'unifiedPush'
  | 'pollId'
  | 'template'
  | 'baseUrl'
  | 'accessToken'
  | 'basicAuth'
  | 'username'
  | 'password';

type Inputs = Record<InputType, string>;

interface SendInputs extends Partial<Omit<Inputs, 'topic' | 'baseUrl'>> {
  apiUrl: string;
  priority?: number;
  markdown?: boolean;
  noCache?: boolean;
  noFirebase?: boolean;
  unifiedPush?: boolean;
  tags?: string[];
  actions?: ActionButtons | null;
}

type ActionType = 'view' | 'broadcast' | 'http' | 'copy';

interface BaseAction {
  action: ActionType;
  label: string;
  clear?: boolean;
}

interface ViewAction extends BaseAction {
  action: 'view';
  url: string;
}

interface BroadcastAction extends BaseAction {
  action: 'broadcast';
  intent?: string;
  extras?: Record<string, string>;
}

interface HttpAction extends BaseAction {
  action: 'http';
  url: string;
  method?: string;
  headers?: Record<string, string>;
  body?: string;
}

interface CopyAction extends BaseAction {
  action: 'copy';
  value: string;
}

type ActionButtons = Array<ViewAction | BroadcastAction | HttpAction | CopyAction>;

interface AttachmentResponse {
  name: string;
  url: string;
  type?: string;
  size?: number;
  expires?: number;
}

interface MessageResponse {
  [key: string]: unknown;
  id: string;
  time: number;
  expires?: number;
  event: string;
  topic: string;
  sequence_id?: string;
  message?: string;
  title?: string;
  tags?: string[];
  priority?: number;
  click?: string;
  actions?: ActionButtons;
  attachment?: AttachmentResponse;
}

type MessageHeaderType =
  | 'X-Title'
  | 'X-Priority'
  | 'X-Tags'
  | 'X-Markdown'
  | 'X-Click'
  | 'X-Icon'
  | 'X-Attach'
  | 'X-Filename'
  | 'X-Actions'
  | 'X-Delay'
  | 'X-Sequence-ID'
  | 'X-Cache'
  | 'X-Firebase'
  | 'X-Email'
  | 'X-Call'
  | 'X-UnifiedPush'
  | 'X-Poll-ID'
  | 'X-Template'
  | 'X-Message'
  | 'Authorization';

type MessageHeaders = Partial<Record<MessageHeaderType, string>>;

interface BadResponse {
  error: string;
  errorCode: number;
  errorDescription: string;
}

interface Outputs extends MessageResponse {
  success: string;
  attachment: AttachmentResponse | string;
}
