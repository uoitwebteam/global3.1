console.log("Load: [lib/foundation-settings.js]");
/**
 * Custom Foundation settings
 */

import Foundation from 'foundation-sites';

// Accordion
// ---------

Foundation.Accordion.defaults.slideSpeed = 400;
Foundation.Accordion.defaults.allowAllClosed = true;
Foundation.Accordion.defaults.deepLink = true;
Foundation.Accordion.defaults.deepLinkSmudge = true;

// Tabs
// ----

Foundation.Tabs.defaults.autoFocus = false;
Foundation.Tabs.defaults.deepLink = true;
Foundation.Tabs.defaults.deepLinkSmudge = true;

// Export for global usage
global.Foundation = Foundation;