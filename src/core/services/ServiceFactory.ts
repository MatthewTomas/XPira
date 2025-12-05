/**
 * Service Factory
 * 
 * Creates appropriate service implementations based on user tier.
 * This is the single point of configuration for swapping between
 * free and premium implementations.
 * 
 * USAGE:
 *   const factory = getServiceFactory('free');
 *   const evaluator = factory.createResponseEvaluator();
 *   const result = await evaluator.evaluate(transcript, expected, context);
 * 
 * ADDING PREMIUM SUPPORT:
 * 1. Create PremiumResponseEvaluator, AIDialogueProvider, AIFeedbackGenerator
 * 2. Import them in this file
 * 3. Add cases for 'premium' tier in each create method
 * 4. Configure AI API keys in environment
 */

import type { UserTier } from '../types';
import type { 
  IServiceFactory, 
  IResponseEvaluator, 
  IDialogueContentProvider,
  ISpeechFeedbackGenerator,
} from './interfaces';

// Free tier implementations
import { FreeResponseEvaluator } from './FreeResponseEvaluator';
import { StaticDialogueProvider } from './StaticDialogueProvider';
import { SimpleFeedbackGenerator } from './SimpleFeedbackGenerator';

// PREMIUM: Import premium implementations when created
// import { PremiumResponseEvaluator } from './PremiumResponseEvaluator';
// import { AIDialogueProvider } from './AIDialogueProvider';
// import { AIFeedbackGenerator } from './AIFeedbackGenerator';

class ServiceFactory implements IServiceFactory {
  private readonly tier: UserTier;
  
  // Cache instances for reuse
  private evaluator: IResponseEvaluator | null = null;
  private dialogueProvider: IDialogueContentProvider | null = null;
  private feedbackGenerator: ISpeechFeedbackGenerator | null = null;

  constructor(tier: UserTier) {
    this.tier = tier;
    console.log(`ServiceFactory initialized with tier: ${tier}`);
  }

  createResponseEvaluator(): IResponseEvaluator {
    if (this.evaluator) return this.evaluator;

    switch (this.tier) {
      case 'premium':
        // PREMIUM: Return AI-powered evaluator
        // this.evaluator = new PremiumResponseEvaluator(AI_CONFIG);
        console.log('Premium evaluator not yet implemented, falling back to free');
        this.evaluator = new FreeResponseEvaluator();
        break;
      
      case 'free':
      default:
        this.evaluator = new FreeResponseEvaluator();
        break;
    }

    return this.evaluator;
  }

  createDialogueProvider(): IDialogueContentProvider {
    if (this.dialogueProvider) return this.dialogueProvider;

    switch (this.tier) {
      case 'premium':
        // PREMIUM: Return AI-powered dialogue provider
        // this.dialogueProvider = new AIDialogueProvider(AI_CONFIG);
        console.log('Premium dialogue provider not yet implemented, falling back to free');
        this.dialogueProvider = new StaticDialogueProvider();
        break;
      
      case 'free':
      default:
        this.dialogueProvider = new StaticDialogueProvider();
        break;
    }

    return this.dialogueProvider;
  }

  createFeedbackGenerator(): ISpeechFeedbackGenerator {
    if (this.feedbackGenerator) return this.feedbackGenerator;

    switch (this.tier) {
      case 'premium':
        // PREMIUM: Return AI-powered feedback generator
        // this.feedbackGenerator = new AIFeedbackGenerator(AI_CONFIG);
        console.log('Premium feedback generator not yet implemented, falling back to free');
        this.feedbackGenerator = new SimpleFeedbackGenerator();
        break;
      
      case 'free':
      default:
        this.feedbackGenerator = new SimpleFeedbackGenerator();
        break;
    }

    return this.feedbackGenerator;
  }
}

// Singleton factory instances
let freeFactory: ServiceFactory | null = null;
let premiumFactory: ServiceFactory | null = null;

/**
 * Get the service factory for a given user tier
 * Factories are cached for reuse
 */
export function getServiceFactory(tier: UserTier): IServiceFactory {
  switch (tier) {
    case 'premium':
      if (!premiumFactory) {
        premiumFactory = new ServiceFactory('premium');
      }
      return premiumFactory;
    
    case 'free':
    default:
      if (!freeFactory) {
        freeFactory = new ServiceFactory('free');
      }
      return freeFactory;
  }
}

/**
 * Reset factories (useful for testing or when user tier changes)
 */
export function resetServiceFactories(): void {
  freeFactory = null;
  premiumFactory = null;
}
