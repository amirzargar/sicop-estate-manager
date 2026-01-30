
import { GeminiAdapter } from '../../../infrastructure/ai/GeminiAdapter';
import { GetEstateSummaryUseCase } from '../estate/GetEstateSummaryUseCase';
import { RentUseCases } from '../rent/RentUseCases';
import { UnitUseCases } from '../unit/UnitUseCases';
import { JsonStorage } from '../../../infrastructure/storage/JsonStorage';

export class AIUseCases {
  private static adapter = new GeminiAdapter();

  static async queryAssistant(userInput: string): Promise<string> {
    const estateSummary = GetEstateSummaryUseCase.execute();
    const defaulters = RentUseCases.getDefaulters();
    const units = UnitUseCases.getAll();
    const auditLogs = JsonStorage.get().auditLogs.slice(0, 5);

    const systemInstruction = `
      You are the SICOP Executive AI Liaison.
      
      CORE SYSTEM DATA (FACTUAL):
      - Estate Summaries: ${JSON.stringify(estateSummary)}
      - Unit Count: ${units.length}
      - Top Defaulters: ${JSON.stringify(defaulters)}
      - Recent System Activity: ${JSON.stringify(auditLogs.map(l => l.description))}
      
      BEHAVIORAL GUIDELINES:
      - Use provided summaries to answer queries about occupancy and performance.
      - Refer to recent activity if asked about payments or system changes.
      - Never guess; if the use case data is empty, mention "No current records found".
      - Format with Markdown for clarity.
    `;

    return this.adapter.generate(userInput, systemInstruction);
  }
}
