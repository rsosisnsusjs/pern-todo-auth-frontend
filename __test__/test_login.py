from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import time

def login_test_case(email, password, should_pass):
    print(f"\n🔍 Testing: email='{email}', password='{password}' (expected to {'pass' if should_pass else 'fail'})")

    # Initialize Chrome WebDriver
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
    wait = WebDriverWait(driver, 10)

    try:
        # Open the landing page
        driver.get("http://localhost:3000")

        # Click on the "Login" link
        login_button = wait.until(EC.element_to_be_clickable((By.LINK_TEXT, "Login")))
        login_button.click()

        # Wait for the login form inputs to appear
        email_input = wait.until(EC.presence_of_element_located((By.NAME, "email")))
        password_input = driver.find_element(By.NAME, "password")

        # Fill in the credentials
        email_input.send_keys(email)
        password_input.send_keys(password)

        # Click the "Submit" button
        submit_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Submit')]")
        submit_button.click()

        # Wait for redirect or toast to appear (you could replace sleep with smarter waiting)
        time.sleep(3)

        # Check if token is saved in localStorage (indicates login success)
        token = driver.execute_script("return window.localStorage.getItem('token');")

        if should_pass:
            assert token is not None, "❌ Token not found, but login was expected to succeed"
            print("✅ Passed as expected (login successful)")
        else:
            assert token is None, "❌ Token found, but login was expected to fail"
            print("✅ Passed as expected (login failed)")

    except AssertionError as e:
        # Print the assertion error if test fails
        print(str(e))
    finally:
        # Always close the browser
        driver.quit()

# ======== Run both test cases ========

# ✅ Login should succeed with correct credentials
login_test_case("testuser@example.com", "password123", should_pass=True)

# ❌ Login should fail with incorrect password
login_test_case("testuser@example.com", "wrongpassword", should_pass=False)
