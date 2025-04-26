import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface Flashcard {
  question: string;
  answer: string;
}

export interface GenerateFlashcardsDto {
  topic: string;
  count: number;
}

const GEMINI_MODEL = 'gemini-1.5-flash';

@Injectable()
export class LlmService {
  private readonly googleAi: GoogleGenerativeAI;
  private readonly model: GenerativeModel;
  private readonly logger = new Logger(LlmService.name);

  constructor(configService: ConfigService) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const geminiApiKey = configService.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }
    this.googleAi = new GoogleGenerativeAI(geminiApiKey);
    this.model = this.googleAi.getGenerativeModel({
      model: GEMINI_MODEL,
    });
  }

  async generateFlashcards(data: GenerateFlashcardsDto): Promise<Flashcard[]> {
    try {
      const prompt = this.createPrompt(data.topic, data.count);
      const result = await this.model.generateContent(prompt);
      const response = await result.response.text();

      return this.parseResponse(response);
    } catch (error) {
      this.logger.error('Error generating flashcards:', error);
      throw new Error('Failed to generate flashcards: ' + error.message);
    }
  }

  private createPrompt(topic: string, count: number): string {
    return `
    You are a helpful assistant tasked with creating flashcards for studying. 
    Generate exactly ${count} flashcards on the topic "${topic}". 
    
    Requirements:
    - Each flashcard must have a short question and a concise answer
    - Answers should be factual and accurate
    - Return ONLY a valid JSON array in this exact format:
    
    [
      {"question": "What is the capital of France?", "answer": "Paris"},
      {"question": "What is the main language in France?", "answer": "French"}
    ]
    
    Important rules:
    1. Questions must be unique and relevant to "${topic}"
    2. Answers should be brief (1 sentence max)
    3. Do NOT include any additional text or explanations
    4. Do NOT repeat the question in the answer
    5. Ensure the output is valid JSON that can be parsed directly
    `;
  }

  private parseResponse(response: string): Flashcard[] {
    try {
      // Clean the response to extract just the JSON
      const jsonStart = response.indexOf('[');
      const jsonEnd = response.lastIndexOf(']') + 1;
      const jsonString = response.slice(jsonStart, jsonEnd);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return JSON.parse(jsonString);
    } catch (error) {
      this.logger.error('Error parsing LLM response:', error);
      throw new Error('Failed to parse flashcards response');
    }
  }
}
