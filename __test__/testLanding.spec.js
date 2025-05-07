const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");

describe("Landing Page Test", function () {
    let driver;

    // เริ่มต้นเมื่อเริ่มการทดสอบ
    before(async function () {
        this.timeout(5000);  // เพิ่มเวลาให้พอสำหรับการสร้าง driver
        try {
            driver = await new Builder().forBrowser("chrome").build();
        } catch (err) {
            console.error("Error in creating driver: ", err);
            throw err;  // ถ้ามีข้อผิดพลาดในการสร้าง driver จะหยุดการทดสอบ
        }
    });

    // ปิดการทดสอบ
    after(async function () {
        if (driver) {
            try {
                await driver.quit();  // ทำการปิด driver
            } catch (err) {
                console.error("Error in quitting driver: ", err);
            }
        }
    });

    it("should display Login and Register buttons", async function () {
        await driver.get("http://localhost:3000");  // ตรวจสอบว่า driver สามารถเปิด URL ได้
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

        // รอจนกว่า URL จะเปลี่ยนไปหน้า Login
        await driver.wait(until.urlContains("login"), 5000);

        let currentUrl = await driver.getCurrentUrl();
        assert.ok(currentUrl.includes("login"));
    });

    it("should navigate to Register page when Register button is clicked", async function () {
        let registerButton = await driver.findElement(By.linkText("Register"));
        await registerButton.click();

        // รอจนกว่า URL จะเปลี่ยนไปหน้า Register
        await driver.wait(until.urlContains("register"), 5000);

        let currentUrl = await driver.getCurrentUrl();
        assert.ok(currentUrl.includes("register"));
    });
});
