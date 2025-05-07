from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options
import time
import uuid

def register_test(email, password, name, should_pass):
    print(f"\n🔍 Testing registration with email='{email}' (expected to {'pass' if should_pass else 'fail'})")

    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
    wait = WebDriverWait(driver, 10)

    try:
        # 1. Open landing page
        driver.get("http://localhost:3000")

        # 2. Click "Register" link
        register_link = wait.until(EC.element_to_be_clickable((By.LINK_TEXT, "Register")))
        register_link.click()

        # 3. Fill in the registration form
        email_input = wait.until(EC.presence_of_element_located((By.NAME, "email")))
        password_input = driver.find_element(By.NAME, "password")
        name_input = driver.find_element(By.NAME, "name")

        email_input.send_keys(email)
        password_input.send_keys(password)
        name_input.send_keys(name)

        # 4. Submit the form
        submit_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Submit')]")
        submit_button.click()

        # 5. Wait for response (toast or redirect)
        time.sleep(3)

        # 6. Check for token in localStorage
        token = driver.execute_script("return window.localStorage.getItem('token');")

        if should_pass:
            assert token is not None, "❌ Token not found, but registration was expected to succeed"
            print("✅ Passed as expected (registration successful)")
        else:
            assert token is None, "❌ Token found, but registration was expected to fail (duplicate email)"
            print("✅ Passed as expected (registration failed with duplicate email)")
    
    except AssertionError as e:
        print(str(e))
    finally:
        driver.quit()


# ======== Run both test cases ========

# ✅ Case 1: Register with a new email (should succeed)
new_email = f"testuser_{uuid.uuid4().hex[:6]}@example.com"
password = "password123"
name = "Test User"
register_test(new_email, password, name, should_pass=True)

# ❌ Case 2: Register again with the same email (should fail)
register_test(new_email, password, name, should_pass=False)
