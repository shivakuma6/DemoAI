const { test, expect } = require('@playwright/test');

const APP_URL = `file:///${process.cwd().replace(/\\/g, '/')}/index.html`;

test.describe('Login Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(APP_URL);
    });

    test('Valid login with test_user and correct password shows products', async ({ page }) => {
        // Fill in valid credentials
        await page.fill('#username', 'test_user');
        await page.fill('#password', 'password123');
        
        // Click login button
        await page.click('#login-btn');
        
        // Verify products section is visible
        const productsSection = page.locator('#products-section');
        await expect(productsSection).not.toHaveClass(/hidden/);
        
        // Verify login section is hidden
        const loginSection = page.locator('#login-section');
        await expect(loginSection).toHaveClass(/hidden/);
        
        // Verify product titles are visible
        await expect(page.locator('h3')).toContainText(['Laptop', 'Smartphone']);
    });

    test('Invalid login with wrong credentials shows error message', async ({ page }) => {
        // Fill in invalid credentials
        await page.fill('#username', 'wrong_user');
        await page.fill('#password', 'wrong_password');
        
        // Click login button
        await page.click('#login-btn');
        
        // Verify error message is visible
        const errorMsg = page.locator('#login-error');
        await expect(errorMsg).toBeVisible();
        
        // Verify login section is still visible
        const loginSection = page.locator('#login-section');
        await expect(loginSection).not.toHaveClass(/hidden/);
        
        // Verify products section is hidden
        const productsSection = page.locator('#products-section');
        await expect(productsSection).toHaveClass(/hidden/);
    });

    test('Admin login with any password shows products (intentional bug)', async ({ page }) => {
        // Fill in admin username with any password
        await page.fill('#username', 'admin');
        await page.fill('#password', 'any_password_here');
        
        // Click login button
        await page.click('#login-btn');
        
        // Verify products section is visible
        const productsSection = page.locator('#products-section');
        await expect(productsSection).not.toHaveClass(/hidden/);
        
        // Verify login section is hidden
        const loginSection = page.locator('#login-section');
        await expect(loginSection).toHaveClass(/hidden/);
    });
});
