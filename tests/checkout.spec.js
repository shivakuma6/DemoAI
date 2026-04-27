const { test, expect } = require('@playwright/test');

const APP_URL = `file:///${process.cwd().replace(/\\/g, '/')}/index.html`;

test.describe('Checkout Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(APP_URL);
        
        // Login with valid credentials
        await page.fill('#username', 'test_user');
        await page.fill('#password', 'password123');
        await page.click('#login-btn');
        
        // Verify we're on products page
        const productsSection = page.locator('#products-section');
        await expect(productsSection).not.toHaveClass(/hidden/);
    });

    test('Add Laptop and Smartphone to cart, then checkout shows success screen', async ({ page }) => {
        // Add Laptop to cart (using .add-to-cart class)
        const addToCartButtons = page.locator('.add-to-cart');
        await addToCartButtons.first().click();
        
        // Verify cart count is 1
        await expect(page.locator('#cart-count')).toHaveText('1');
        
        // Add Smartphone to cart (using .add-to-cart-typo class)
        await page.locator('.add-to-cart-typo').click();
        
        // Verify cart count is 2
        await expect(page.locator('#cart-count')).toHaveText('2');
        
        // Click View Cart
        await page.click('#view-cart-btn');
        
        // Verify cart section is visible
        const cartSection = page.locator('#cart-section');
        await expect(cartSection).not.toHaveClass(/hidden/);
        
        // Verify cart items are displayed
        const cartItems = page.locator('#cart-items li');
        await expect(cartItems).toHaveCount(2);
        await expect(page.locator('#cart-items')).toContainText('Laptop');
        await expect(page.locator('#cart-items')).toContainText('Smartphone');
        
        // Verify total is correct ($999 + $499 = $1498)
        await expect(page.locator('#cart-total')).toContainText('$1498');
        
        // Click Checkout
        await page.click('#checkout-btn');
        
        // Verify success section is visible
        const successSection = page.locator('#success-section');
        await expect(successSection).not.toHaveClass(/hidden/);
        
        // Verify success message
        await expect(page.locator('#success-section')).toContainText('Order placed successfully');
    });

    test('Attempting checkout with empty cart shows alert', async ({ page }) => {
        // Verify we're on products page
        const productsSection = page.locator('#products-section');
        await expect(productsSection).not.toHaveClass(/hidden/);
        
        // Click View Cart without adding anything
        await page.click('#view-cart-btn');
        
        // Verify cart section is visible and empty
        const cartSection = page.locator('#cart-section');
        await expect(cartSection).not.toHaveClass(/hidden/);
        await expect(page.locator('#cart-items li')).toHaveCount(0);
        
        // Setup listener for alert dialog
        page.once('dialog', async dialog => {
            expect(dialog.type()).toBe('alert');
            expect(dialog.message()).toBe('Your cart is empty!');
            await dialog.accept();
        });
        
        // Click Checkout with empty cart
        await page.click('#checkout-btn');
        
        // Verify we're still on cart section (not success section)
        await expect(cartSection).not.toHaveClass(/hidden/);
        const successSection = page.locator('#success-section');
        await expect(successSection).toHaveClass(/hidden/);
    });
});
