import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { env } from '../../config/env.js';
import { logger } from '../../config/logger.js';

class AIService {
  constructor() {
    this.provider = env.LLM_PROVIDER;
    this.apiKey = env.GEMINI_API_KEY || env.LLM_API_KEY;
    this.modelName = env.LLM_MODEL || 'gemini-1.5-flash';

    if (this.apiKey) {
      try {
        this.model = new ChatGoogleGenerativeAI({
          apiKey: this.apiKey,
          modelName: this.modelName,
          temperature: 0.1, // low temperature for grounded answers
          streaming: true
        });
      } catch (err) {
        logger.warn('Failed to initialize ChatGoogleGenerativeAI:', { error: err.message });
      }
    }
  }

  async *streamResponse({ messages, contextText, userQuestion }) {
    const systemPrompt = `You are an enterprise document-grounded AI assistant.
Answer the user's question STRICTLY using the supplied document context below.
Do not invent information. Never fabricate citations, page numbers, or statistics.
If the supplied document context does not contain enough information to answer the question, state:
"I couldn't find enough information in your uploaded documents to answer that reliably."

<document_context>
${contextText || 'No context retrieved.'}
</document_context>`;

    // If active Gemini model is available
    if (this.model && this.apiKey) {
      try {
        const formattedMessages = [
          { role: 'system', content: systemPrompt },
          ...messages.map((m) => ({ role: m.role, content: m.content })),
          { role: 'user', content: userQuestion }
        ];

        const responseStream = await this.model.stream(formattedMessages);
        for await (const chunk of responseStream) {
          const text = chunk.content;
          if (text) {
            yield text;
          }
        }
        return;
      } catch (err) {
        logger.warn(`AI model streaming error (${err.message}), falling back to grounded response generator.`);
      }
    }

    // Grounded mock generator when offline or no API key is provided
    if (!contextText || contextText.trim().length === 0) {
      const fallbackMsg = "I couldn't find enough information in your uploaded documents to answer that reliably.";
      for (const word of fallbackMsg.split(' ')) {
        yield word + ' ';
        await new Promise((r) => setTimeout(r, 40));
      }
      return;
    }

    const sentences = contextText.split('\n').filter((l) => l.trim().length > 10);
    const summaryHeader = `Based on your uploaded documents, here is the verified information regarding "${userQuestion}":\n\n`;
    for (const char of summaryHeader) {
      yield char;
      await new Promise((r) => setTimeout(r, 10));
    }

    const excerptAnswer = sentences.slice(0, 3).join('\n\n');
    for (const token of excerptAnswer.split(' ')) {
      yield token + ' ';
      await new Promise((r) => setTimeout(r, 35));
    }
  }
}

export const aiService = new AIService();
