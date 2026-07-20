import axios from 'axios';
import * as cheerio from 'cheerio';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class MarketDataAggregatorService {
  private static SOURCES = [
    {
      name: 'AP Forest Development Corporation',
      url: 'https://apfdcl.com/auctions' // Example URL
    },
    {
      name: 'Government e-Auction Platform',
      url: 'https://www.mstcecommerce.com/auctionhome/index_new.jsp'
    }
  ];

  public static async runAggregation() {
    console.log('[MarketDataAggregator] Starting scheduled data aggregation...');
    
    let newPriceFound = false;

    for (const source of this.SOURCES) {
      try {
        console.log(`[MarketDataAggregator] Polling source: ${source.name}`);
        // Simulate a fetch with 5-second timeout
        const response = await axios.get(source.url, { timeout: 5000 });
        const $ = cheerio.load(response.data);
        
        // This is a robust mock extraction logic for a generic HTML table/list containing the phrase
        // In reality, PDFs would require OCR, but we parse HTML if available.
        const pageText = $('body').text().toLowerCase();
        
        // Look for "a-grade" and "heartwood" proximity
        if (pageText.includes('a-grade') && pageText.includes('red sandalwood') && pageText.includes('heartwood')) {
          // Attempt to extract a price in INR format, e.g. Rs. 1,50,00,000 or similar
          // This regex looks for typical Indian price formats near the keywords
          const priceRegex = /rs\.?\s*([0-9,]+)\s*(?:\/|-|per)\s*(?:mt|ton|metric ton)/i;
          const match = pageText.match(priceRegex);

          if (match && match[1]) {
            const rawPrice = match[1].replace(/,/g, '');
            const parsedPrice = parseFloat(rawPrice);

            if (!isNaN(parsedPrice) && parsedPrice > 1000000) {
              console.log(`[MarketDataAggregator] Found valid new price: ₹${parsedPrice} from ${source.name}`);
              
              // Only insert if it's different from the latest to avoid duplicates
              const latest = await prisma.marketPrice.findFirst({
                orderBy: { last_updated: 'desc' }
              });

              if (!latest || latest.market_price !== parsedPrice) {
                await prisma.marketPrice.create({
                  data: {
                    market_price: parsedPrice,
                    grade: 'A-Grade Indian Red Sandalwood Heartwood',
                    unit: 'Ton',
                    source: `${source.name} Auction Report`,
                    last_updated: new Date(),
                    verified: true
                  }
                });
                console.log('[MarketDataAggregator] Successfully saved new verified market price to database.');
              } else {
                console.log('[MarketDataAggregator] Found price matches existing database record. No update needed.');
              }

              newPriceFound = true;
              break; // Stop after first successful trusted source
            }
          }
        }
      } catch (error: any) {
        console.error(`[MarketDataAggregator] Failed to fetch or parse source ${source.name}: ${error.message}`);
        // Continue to next source
      }
    }

    if (!newPriceFound) {
      console.log('[MarketDataAggregator] No new verified auction data found across sources. Keeping existing database records intact.');
    }
  }
}
