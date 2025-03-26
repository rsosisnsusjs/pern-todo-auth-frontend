const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');
const { describe, it, after, before } = require('mocha');



describe('Login Page Tests', function () {
  this.timeout(100000);
  let driver;

  before(async () => {
    console.log("Opening browser...");
    try {
      driver = await new Builder().forBrowser('chrome').build();
      await driver.get('http://localhost:3000/login');
      console.log("Opened login page successfully");
    } catch (error) {
      console.error("Error during setup:", error);
      throw error;
    }
  });

  after(async () => {
    if (driver) {
      console.log("Closing browser...");
      await driver.quit();
    }
  });

  it('should allow user to enter email and password', async () => {
    console.log("Testing input fields...");
    const emailInput = await driver.findElement(By.name('email'));
    const passwordInput = await driver.findElement(By.name('password'));

    await emailInput.sendKeys('test@example.com');
    await passwordInput.sendKeys('password123');

    assert.strictEqual(await emailInput.getAttribute('value'), 'test@example.com');
    assert.strictEqual(await passwordInput.getAttribute('value'), 'password123');
  });

  it('should log in successfully and redirect to dashboard', async () => {
    console.log("Testing login functionality...");
    const submitButton = await driver.findElement(By.css('button.btn-dark'));
    await submitButton.click();
    await driver.wait(until.urlContains('dashboard'), 10000);
    
    const header = await driver.findElement(By.css('.todo-list-header strong'));
    assert.ok(await header.getText().includes("'s Todo List"), 'Failed to navigate to dashboard');
  });

  it('should show error toast on failed login', async () => {
    console.log("Testing failed login...");
    await driver.get('http://localhost:3000/login');
    const emailInput = await driver.findElement(By.name('email'));
    const passwordInput = await driver.findElement(By.name('password'));
    const submitButton = await driver.findElement(By.css('button.btn-dark'));

    await emailInput.clear();
    await passwordInput.clear();
    await emailInput.sendKeys('wrong@example.com');
    await passwordInput.sendKeys('wrongpassword');
    await submitButton.click();

    const toast = await driver.wait(until.elementLocated(By.className('Toastify__toast--error')), 10000);
    assert.ok(await toast.isDisplayed(), 'Error toast not displayed');
  });

  it('should have a Register link that navigates to register page', async () => {
    console.log("Testing register link...");
    await driver.get('http://localhost:3000/login');
    const registerLink = await driver.findElement(By.linkText('register'));
    await registerLink.click();
    await driver.wait(until.urlContains('register'), 10000);
  });
});
