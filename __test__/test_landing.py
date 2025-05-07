from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import time

def test_landing_navigation():
    print("\n🔍 Testing navigation from Landing page to Login and Register")

    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
    wait = WebDriverWait(driver, 10)

    try:
        # 1. Open landing page
        driver.get("http://localhost:3000")

        # 2. Test clicking the "Login" button
        login_button = wait.until(EC.element_to_be_clickable((By.LINK_TEXT, "Login")))
        login_button.click()

        # 3. Wait for the login page to load
        time.sleep(2)  # Add a small delay to make sure the page loads

        # 4. Verify that the URL has changed to the login page
        assert "login" in driver.current_url, "❌ Failed to navigate to the login page"
        print("✅ Login navigation test passed!")

        # 5. Go back to the Landing page
        driver.back()

        # 6. Test clicking the "Register" button
        register_button = wait.until(EC.element_to_be_clickable((By.LINK_TEXT, "Register")))
        register_button.click()

        # 7. Wait for the register page to load
        time.sleep(2)  # Add a small delay to make sure the page loads

        # 8. Verify that the URL has changed to the register page
        assert "register" in driver.current_url, "❌ Failed to navigate to the register page"
        print("✅ Register navigation test passed!")

    except AssertionError as e:
        print(str(e))
    finally:
        driver.quit()

# Run the test case
test_landing_navigation()
