import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY || ''
});

export class GroqService {
  async generateResponse(content: string, imageUrl?: string): Promise<string> {
    try {
      const messages: any[] = [];
      
      // System prompt for the AI tutor
      messages.push({
        role: 'system',
        content: `You are an advanced AI study tutor specializing in mathematics, science, and academic problem solving. Your responses should:

1. Provide step-by-step solutions with clear explanations
2. Use proper mathematical notation and LaTeX when appropriate
3. Break down complex problems into manageable steps
4. Explain the reasoning behind each step
5. Offer additional clarifications when asked
6. Be encouraging and educational
7. Format mathematical expressions clearly
8. Number your steps clearly

For mathematical expressions, use LaTeX format wrapped in $ for inline math or $$ for block math.
Always structure your response with numbered steps and clear explanations.`
      });

      // Add user message
      if (imageUrl) {
        messages.push({
          role: 'user',
          content: [
            {
              type: 'text',
              text: content || 'Please solve this problem from the image:'
            },
            {
              type: 'image_url',
              image_url: {
                url: imageUrl
              }
            }
          ]
        });
      } else {
        messages.push({
          role: 'user',
          content: content
        });
      }

      const completion = await groq.chat.completions.create({
        messages,
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        temperature: 0.7,
        max_tokens: 2048,
      });

      return completion.choices[0]?.message?.content || 'I apologize, but I could not generate a response. Please try again.';
    } catch (error) {
      console.error('Groq API error:', error);
      throw new Error('Failed to generate AI response');
    }
  }
}

export const groqService = new GroqService();
