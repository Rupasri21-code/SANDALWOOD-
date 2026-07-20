import cron from 'node-cron';
import { MarketDataAggregatorService } from '../services/market-scraper.service';

export const initializeCronJobs = () => {
  console.log('🔄 Initializing cron jobs...');

  // Run market data aggregation every 6 hours
  cron.schedule('0 */6 * * *', async () => {
    try {
      await MarketDataAggregatorService.runAggregation();
    } catch (error) {
      console.error('Error during scheduled market data aggregation:', error);
    }
  });

  // Run once on startup just to ensure we have the latest
  MarketDataAggregatorService.runAggregation().catch(err => console.error(err));
  
  console.log('✅ Cron jobs initialized successfully');
};
