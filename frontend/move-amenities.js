const fs = require('fs');
const path = './app/(public)/home/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// Find the Core Privileges array
const privStart = content.indexOf('          {/* Core Privileges (4 Cards) */}');
const privEnd = content.indexOf('.map((privilege, i) => (', privStart);

// The new items to add to the privileges array
const newPrivileges = `
              { title: "Supplementary Maintenance", desc: "Scientific plantation care and professional long-term crop upkeep.", icon: FileSignature },
              { title: "Plot Resale Assistance", desc: "Full marketing support to seamlessly liquidate your mature asset.", icon: Handshake },
              { title: "Luxury Suites", desc: "Exclusive access to premium relaxation spaces for weekend getaways.", icon: Building }`;

// We need to inject newPrivileges right before the closing bracket of the array
const arrayEndMatch = content.substring(privStart, privEnd).lastIndexOf('}');
const arrayEndIndex = privStart + arrayEndMatch + 1;

content = content.substring(0, arrayEndIndex) + ',' + newPrivileges + content.substring(arrayEndIndex);

// Also update the grid columns for the Core Privileges to handle 7 items
content = content.replace(
  'className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-24"',
  'className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-24"'
);

// Now remove them from the Amenities Grid
const amenitiesStart = content.indexOf('{/* Lifestyle Amenities Grid (9 Cards) */}');
const amenitiesEnd = content.indexOf('.map((amenity, i) => (', amenitiesStart);

let amenitiesBlock = content.substring(amenitiesStart, amenitiesEnd);
amenitiesBlock = amenitiesBlock.replace(/\s*\{\s*title:\s*"Supplementary Maintenance"[\s\S]*?\},/g, '');
amenitiesBlock = amenitiesBlock.replace(/\s*\{\s*title:\s*"Plot Resale Assistance"[\s\S]*?\},/g, '');
amenitiesBlock = amenitiesBlock.replace(/\s*\{\s*title:\s*"Luxury Suites"[\s\S]*?\},/g, '');

content = content.substring(0, amenitiesStart) + amenitiesBlock + content.substring(amenitiesEnd);

fs.writeFileSync(path, content, 'utf8');
console.log('Successfully moved 3 items from amenities to privileges.');
