const fs = require('fs');
const path = './app/(public)/home/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const s_journey = content.indexOf('{/* 5. Our Plantation Journey Section (REDESIGNED TO EXACT REFERENCE STYLE) */}');
const e_gallery = content.indexOf('{/* 8.5 Estimate Your Red Sandalwood Wealth Section */}');
const s_testimonials = content.indexOf('{/* 8. Testimonials Section */}');

if (s_journey === -1 || e_gallery === -1 || s_testimonials === -1) {
  console.log('Could not find markers');
  process.exit(1);
}

// Extract the whole chunk from Journey to the end of Gallery
let extractedChunk = content.substring(s_journey, e_gallery);

// Remove the chunk from its original place
let newContent = content.substring(0, s_journey) + content.substring(e_gallery);

// Clean up IDs in the extracted chunk so we don't have duplicates
extractedChunk = extractedChunk.replace('id="plantation"', 'id="plantation-inner"');
extractedChunk = extractedChunk.replace('id="gallery"', 'id="gallery-inner"');

// Wrap it in a master section with id="plantation"
const masterSection = `      {/* --- MASTER PLANTATION SECTION (COMBINED JOURNEY + GALLERY) --- */}
      <div id="plantation" className="w-full flex flex-col relative z-20">
${extractedChunk}
      </div>
      {/* --- END MASTER PLANTATION SECTION --- */}
`;

// Insert it right before Testimonials
const insertIndex = newContent.indexOf('{/* 8. Testimonials Section */}');
newContent = newContent.substring(0, insertIndex) + masterSection + newContent.substring(insertIndex);

fs.writeFileSync(path, newContent, 'utf8');
console.log('Successfully relocated and combined sections.');
