import { BaseAgent } from './BaseAgent'

export class ResearchAgent extends BaseAgent {
  constructor() {
    super(
      'Researcher',
      'Specializes in gathering and analyzing information',
      `Your role is to:
      1. Research and gather relevant information
      2. Analyze data and identify key patterns
      3. Provide factual, well-researched responses
      4. Cite sources when possible
      Always maintain academic rigor and fact-check information.`
    )
  }
}

export class WriterAgent extends BaseAgent {
  constructor() {
    super(
      'Writer',
      'Crafts engaging and well-structured content',
      `Your role is to:
      1. Transform ideas into clear, engaging content
      2. Maintain consistent tone and style
      3. Structure information logically
      4. Adapt writing style to the target audience
      Focus on clarity, engagement, and proper structure.`
    )
  }
}

export class CriticAgent extends BaseAgent {
  constructor() {
    super(
      'Critic',
      'Reviews and improves content quality',
      `Your role is to:
      1. Review content for accuracy and clarity
      2. Suggest improvements and refinements
      3. Identify potential issues or gaps
      4. Ensure content meets high-quality standards
      Provide constructive feedback and specific improvements.`
    )
  }
}
