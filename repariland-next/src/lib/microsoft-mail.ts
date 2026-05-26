import type { FormEmailPayload } from '@/lib/form-email';
import { getOutlookAccessToken, getOutlookMailbox } from '@/lib/outlook-oauth';
import { getFormToEmail } from '@/lib/resend';

export async function sendMicrosoftGraphEmail(options: FormEmailPayload): Promise<void> {
  const accessToken = await getOutlookAccessToken();
  const to = options.to ?? getFormToEmail();
  const fromMailbox = getOutlookMailbox();

  const message: Record<string, unknown> = {
    subject: options.subject,
    body: {
      contentType: 'HTML',
      content: options.html,
    },
    toRecipients: [{ emailAddress: { address: to } }],
  };

  if (options.replyTo) {
    message.replyTo = [{ emailAddress: { address: options.replyTo } }];
  }

  if (fromMailbox) {
    message.from = { emailAddress: { address: fromMailbox } };
  }

  if (options.attachments?.length) {
    message.attachments = options.attachments.map((file) => ({
      '@odata.type': '#microsoft.graph.fileAttachment',
      name: file.filename,
      contentType: 'application/octet-stream',
      contentBytes: file.content,
    }));
  }

  const response = await fetch('https://graph.microsoft.com/v1.0/me/sendMail', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message, saveToSentItems: true }),
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error('[microsoft-mail]', response.status, detail);
    throw new Error(`OUTLOOK_GRAPH_ERROR:${response.status}`);
  }
}
