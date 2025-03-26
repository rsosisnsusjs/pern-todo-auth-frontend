const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");

describe("Landing Page Test", function () {
    let driver;

    // เริ่มต้นเมื่อเริ่มการทดสอบ
    before(async function () {
        driver = await new Builder().forBrowser("chrome").build();
    });

    // ปิดการทดสอบ
    after(async function () {
        await driver.quit();
    });

    it("should display Login and Register buttons", async function () {
        await driver.get("http://localhost:3000"); // เปลี่ยน URL ตามโปรเจกต์ของเบนซ์

        // รอจนกว่าปุ่ม Login จะปรากฏ
        let loginButton = await driver.wait(
            until.elementLocated(By.linkText("Login")),
            5000
        );
        let registerButton = await driver.wait(
            until.elementLocated(By.linkText("Register")),
            5000
        );

        // ตรวจสอบว่าปุ่ม Login และ Register ปรากฏ
        assert.ok(await loginButton.isDisplayed());
        assert.ok(await registerButton.isDisplayed());
    });

    it("should navigate to Login page when Login button is clicked", async function () {
        let loginButton = await driver.findElement(By.linkText("Login"));
        await loginButton.click();
        await driver.wait(until.urlContains("login"), 5000);

        // ตรวจสอบว่า URL เปลี่ยนไปหน้า Login
        let currentUrl = await driver.getCurrentUrl();
        assert.ok(currentUrl.includes("login"));
    });

    it("should navigate to Register page when Register button is clicked", async function () {
        let registerButton = await driver.findElement(By.linkText("Register"));
        await registerButton.click();
        await driver.wait(until.urlContains("register"), 5000);

        // ตรวจสอบว่า URL เปลี่ยนไปหน้า Register
        let currentUrl = await driver.getCurrentUrl();
        assert.ok(currentUrl.includes("register"));
    });
});
