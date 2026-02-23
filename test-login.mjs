import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Listen for console messages
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    console.log(`[CONSOLE ${type.toUpperCase()}] ${text}`);
    
    // Check for hydration warnings
    if (text.includes('Hydration') || text.includes('hydration') || 
        text.includes('mismatch') || text.includes('SSR')) {
      console.log('⚠️  HYDRATION WARNING DETECTED: ' + text);
    }
  });

  // Listen for page errors
  page.on('pageerror', error => {
    console.log(`[PAGE ERROR] ${error.message}`);
  });

  try {
    console.log('Navigating to login page...');
    await page.goto('http://localhost:3001/admin/auth/login', { waitUntil: 'networkidle' });
    
    console.log('\nPage loaded. Taking screenshot...');
    await page.screenshot({ path: 'login-page-initial.png' });
    
    // Wait a bit to see if any hydration warnings appear
    await page.waitForTimeout(2000);
    
    console.log('\nFilling in invalid credentials...');
    // Find and fill the phone input
    const phoneInput = await page.locator('input[type="tel"], input[placeholder*="phone" i], input[name*="phone" i]').first();
    await phoneInput.fill('1234567890');
    
    // Find and fill the password input
    const passwordInput = await page.locator('input[type="password"]').first();
    await passwordInput.fill('wrongpassword');
    
    console.log('Submitting form...');
    // Find and click the submit button
    const submitButton = await page.locator('button[type="submit"]').first();
    await submitButton.click();
    
    // Wait for toast/notification to appear
    console.log('\nWaiting for toast notification...');
    await page.waitForTimeout(2000);
    
    // Check for toast elements
    const toastSelectors = [
      '[role="alert"]',
      '.toast',
      '.notification',
      '[class*="toast"]',
      '[class*="notification"]',
      '[class*="alert"]',
      '.UNotifications'
    ];
    
    let toastFound = false;
    for (const selector of toastSelectors) {
      const toast = await page.locator(selector).first();
      if (await toast.isVisible().catch(() => false)) {
        toastFound = true;
        const toastText = await toast.textContent();
        const toastClass = await toast.getAttribute('class');
        const boundingBox = await toast.boundingBox();
        
        console.log('\n✅ TOAST FOUND!');
        console.log('Selector:', selector);
        console.log('Text:', toastText);
        console.log('Classes:', toastClass);
        console.log('Position:', boundingBox);
        break;
      }
    }
    
    if (!toastFound) {
      console.log('\n❌ NO TOAST FOUND with common selectors');
      console.log('Checking all visible elements...');
      const allText = await page.textContent('body');
      console.log('Page body text:', allText.substring(0, 500));
    }
    
    // Take screenshot after form submission
    await page.screenshot({ path: 'login-page-after-submit.png' });
    console.log('\nScreenshots saved: login-page-initial.png, login-page-after-submit.png');
    
    // Wait a bit longer to capture any delayed messages
    await page.waitForTimeout(3000);
    
  } catch (error) {
    console.error('Error during test:', error);
  } finally {
    console.log('\nClosing browser in 5 seconds...');
    await page.waitForTimeout(5000);
    await browser.close();
  }
})();
