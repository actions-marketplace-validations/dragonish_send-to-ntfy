# send-to-ntfy

A GitHub Action.

## Feature

Send a message to [ntfy](https://ntfy.sh/).

## Example workflow

Using the official [ntfy.sh](https://ntfy.sh/app) server:

```yaml
name: Send Message
on: [push]

jobs:
  send-message:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v6
      - name: Send to ntfy
        uses: dragonish/send-to-ntfy@v1
        with:
          topic: ${{ secrets.NTFY_TOPIC }}
          message: "${{ github.repository }}\n\n${{ job.status }}"
```

Using a self-hosted ntfy server, while configuring more options:

```yaml
name: Send Message
on: [push]

jobs:
  send-message:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v6
      - name: Send to ntfy
        uses: dragonish/send-to-ntfy@v1
        with:
          base-url: ${{ secrets.NTFY_URL }}
          topic: ${{ secrets.NTFY_TOPIC }}
          access-token: ${{ secrets.NTFY_TOKEN }}
          title: ${{ github.repository }}
          message: "This is a message from [dragonish/send-to-ntfy](https://github.com/dragonish/send-to-ntfy)."
          markdown: true
          tags: "github,${{ job.status }}"
          priority: 2
          attach: release/build.zip
```

## Inputs

| ID | Type | Default | Example | Description | Supported |
| -- | ---- | ------- | ------- | ----------- | --------- |
| `topic` | string | **required** | `"mytopic"` | Target topic name. | |
| `message` | string | `""` | `"Some message"` | Message body; send to `"triggered"` if empty. | *Android, iOS, Web* |
| `title` | string | `""` | `"Some title"` | Message title. | *Android, iOS, Web* |
| `tags` | string | `""` | `"tag1,tag2,tag3"` | List of tags that may or not map to emojis. Specify multiple tags by separating them with a comma. Use [the emoji short code list](https://docs.ntfy.sh/emojis/) to figure out what tags can be converted to emojis. | *Android, iOS, Web* |
| `priority` | `1`, `2`, `3`, `4`, or `5` | `3` | `4` | Message priority with `1`=min, `2`=low, `3`=default, `4`=high and `5`=max. | *Android, iOS, Web* |
| `markdown` | boolean | `false` | `true` | Set to `true` if the message is Markdown-formatted. | *Android, Web* |
| `click` | string | `""` | `"https://example.com"` | You can define which URL to open when a notification is clicked. | *Android, iOS, Web* |
| `actions` | string | `""` | `'[{"action": "view", "label": "Open", "url": "https://example.com"}, {"action": "copy", "label": "Copy", "value": "123456"}]'` | Custom user action buttons for notifications. Using a JSON array, the fields of the array elements can refer to: [Action buttons](#action-buttons). | *Android, iOS, Web* |
| `attach` | string | `""` | `"release/build.zip"` or `"https://example.com/file"` | A local file or an external URL as an attachment. *For self-hosted services, you need to allow users to upload and attach files to notifications.* | *Android, Web* |
| `filename` | string | `""` | `"flower.jpg"` | File name of the attachment. *To send a smaller (usually less than 4,096 bytes) text-only file as attachment, you must pass a `filename`.* | *Android, Web* |
| `icon` | string | `""` | `"https://example.com/icon.png"` | URL to use as notification icon. **Only JPEG and PNG images are supported at this time.** | *Android* |
| `delay` | integer or string | `""` | `1639194738`, `"30m"` or `"tomorrow, 3pm"` | A Unix timestamp, a duration or a [natural language time string](https://github.com/olebedev/when) for delayed delivery. *The minimum delay you can set is 10 seconds and the maximum delay is 3 days.* | *Android, iOS, Web* |
| `email` | string | `""` | `"ntfy@example.com"` | Forward messages to e-mail. *For self-hosted services, you need configure an SMTP server for outgoing messages.* | *Android, iOS, Web* |
| `call` | string | `""` | `"+12223334444"` or `"yes"` | Phone number to use for voice call. On ntfy.sh, this feature is only supported to [ntfy Pro](https://ntfy.sh/app) plans. | *Android, iOS, Web* |
| `sequence-id` | string | `""` | `"the_sequence_id"` | Sequence ID for updating/deleting notifications. | *Android, Web* |
| `no-cache` | boolean | `false` | `true` | Make sure the message is not cached on the server. | *Android, iOS, Web* |
| `no-firebase` | boolean | `false` | `true` | Instruct the server not to forward messages to Firebase. | *Android* |
| `unified-push` | boolean | `false` | `true` | Apps using ntfy as a UnifiedPush distributor. *It requires the topic to have previously active subscribers.* | *Android* |
| `poll-id` | string | `""` | `"the_poll_id"` | Used for iOS push notifications. | *iOS* |
| `template` | string | `""` | `"grafana"` | Enable [message templating](https://docs.ntfy.sh/publish/#message-templating). | *Android, iOS, Web* |
| `base-url` | string | `"https://ntfy.sh"` | `"https://example.com"` | ntfy service address. | |
| `access-token` | string | `""` | `"tk_xxxxxxxxxx"` | Authenticate against the ntfy server using access token. | |
| `basic-auth` | string | `""` | `"xxxxxxxxxxxxxxx"` | Authenticate using base64-encoded `<username>:<password>`. | |
| `username` | string | `""` | `"myuser"` | Username for authentication. | |
| `password` | string | `""` | `"mypassword"` | Password for authentication. | |

> [!NOTE]
> If authentication is required, choose one of: `access-token`, `basic-auth`, or `username` + `password`.

### Action buttons

The following actions are supported:

- [`view`](#view-action): Opens a website or app when the action button is tapped.
- [`broadcast`](#broadcast-action): Sends an Android broadcast intent when the action button is tapped (*only supported on Android*).
- [`http`](#http-action): Sends HTTP POST/GET/PUT request when the action button is tapped.
- [`copy`](#copy-action): Copies a given value to the clipboard when the action button is tapped.

#### `view` action

*Supported on: Android, iOS, Web.*

| Field | Type | Default | Example | Description |
| ----- | ---- | ------- | ------- | ----------- |
| `action` | string | **required** | `"view"` | Action type (must be `"view"`) |
| `label` | string | **required** | `"Turn on light"` | Label of the action button in the notification |
| `url` | string | **required** | `"https://example.com"` | URL to open when action is tapped |
| `clear` | boolean | `false` | `true` | Clear notification after action button is tapped |

#### `broadcast` action

*Supported on: Android.*

| Field | Type | Default | Example | Description |
| ----- | ---- | ------- | ------- | ----------- |
| `action` | string | **required** | `"broadcast"` | Action type (must be `"broadcast"`) |
| `label` | string | **required** | `"Turn on light"` | Label of the action button in the notification |
| `intent` | string | `"io.heckel.ntfy.USER_ACTION"` | `"com.example.AN_INTENT"` | Android intent name |
| `extras` | string | `""` | `'{"cmd": "pic", "camera": "front"}'` | Android intent extras. Currently, only string extras are supported |
| `clear` | boolean | `false` | `true` | Clear notification after action button is tapped |

#### `http` action

*Supported on: Android, iOS, Web.*

| Field | Type | Default | Example | Description |
| ----- | ---- | ------- | ------- | ----------- |
| `action` | string | **required** | `"http"` | Action type (must be `"http"`) |
| `label` | string | **required** | `"Turn on light"` | Label of the action button in the notification |
| `url` | string | **required** | `"https://example.com"` | URL to which the HTTP request will be sent |
| `method` | string | `"POST"` | `"PUT"` | HTTP method to use for request |
| `headers` | string | `""` | `'{"Content-Type": "application/json"}'` | HTTP headers to pass in request |
| `body` | string | `""` | `"Some body"` | HTTP body |
| `clear` | boolean | `false` | `true` | Clear notification after action button is tapped |

#### `copy` action

*Supported on: Android, Web.*

| Field | Type | Default | Example | Description |
| ----- | ---- | ------- | ------- | ----------- |
| `action` | string | **required** | `"copy"` | Action type (must be `"copy"`) |
| `label` | string | **required** | `"Copy code"` | Label of the action button in the notification |
| `value` | string | **required** | `"example value"` | Value to copy to the clipboard |
| `clear` | boolean | `false` | `true` | Clear notification after action button is tapped |

## Outputs

| ID | Example | Description |
| -- | ------- | ----------- |
| `success` | `"true"` or `"false"` | Informs whether sending was successful. |
| `id` | `"the_message_id"` | Randomly chosen message identifier. |
| `time` | `"1774422769"` | Message date time, as Unix time stamp. |
| `expires` | `"1774509169"` | Unix time stamp indicating when the message will be deleted. *`0` if set `no-cache: true`.* |
| `topic` | `"mytopic"` | The topic associated with the message. |
| `sequence_id` | `"the_sequence_id"` | Sequence ID for updating/deleting notifications. *Value exists only when `sequence-id` is set.* |
| `message` | `"Some message"` | Message body. |
| `title` | `"Some title"` | Message title. *Value exists only when `title` is set.* |
| `tags` | `'["tag1", "tag2", "tag3"]'` | List of tags that may or not map to emojis. |
| `priority` | `"3"` | Message priority with 1=min, 3=default and 5=max. |
| `click` | `"https://examlep.com"` | Website opened when notification is clicked. *Value exists only when `click` is set.* |
| `actions` | `'[{"action": "view", "label": "Open", "url": "https://ntfy.sh", "clear": false}, {"action": "copy", "label": "Copy", "value": "123456", "clear": false}]'` | Action buttons that can be displayed in the notification. |
| `attachment` | `'{"name": "attachment.png", "url": "https://example.com/attachment.png"}'` or `'{"name": "attachment.png", "url": "https://ntfy.sh/file/random_string.png", "type": "image/png", "size": 33848, "expires": 1774681969}'` | Details about an attachment (name, URL, size, ...). *Value exists only when `attach` is set.* |

## Credits

- [binwiederhier/ntfy](https://github.com/binwiederhier/ntfy)

## License

[Apache 2.0](./LICENSE)
