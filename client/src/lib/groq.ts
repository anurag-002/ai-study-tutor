// Frontend service for Groq integration (actual API calls are made from backend)
export class GroqClientService {
  async sendMessage(conversationId: string, content: string, imageUrl?: string) {
    const response = await fetch('/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        conversationId,
        content,
        isUser: true,
        imageUrl,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    return response.json();
  }

  async uploadFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload file');
    }

    const data = await response.json();
    return data.imageUrl;
  }
}

export const groqClient = new GroqClientService();
