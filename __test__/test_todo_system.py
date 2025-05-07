from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import time
import uuid

def test_todo_operations():
    print("\n🔍 Testing Add, Edit, Delete, and Mark as Done Todo Operations")

    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
    wait = WebDriverWait(driver, 10)

    try:
        
        # Login
        driver.get("http://localhost:3000/login")
        driver.find_element(By.NAME, "email").send_keys("testuser@example.com")
        driver.find_element(By.NAME, "password").send_keys("password123")
        driver.find_element(By.XPATH, "//button[contains(text(), 'Submit')]").click()
        time.sleep(3)

        # Add Todo
        description_input = wait.until(EC.presence_of_element_located((By.NAME, "description_input")))
        description = f"Test Todo {uuid.uuid4().hex[:6]}"
        description_input.send_keys(description)
        time.sleep(10)
        """
        # Set Due Date
        due_date_input = wait.until(EC.presence_of_element_located((By.NAME, "due_date_input")))

        due_date = "2025-04-15T10:00"

        # Format MUI ที่มักใช้กับ locale EN: MM/DD/YYYY hh:mm AM/PM
        mui_date_string = "04/15/2025 10:00 AM"

        # รอจนเจอ input
        due_date_input = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, 'input')))


        # Verify the entered values for description and due date
        description_value = driver.execute_script("return document.getElementsByName('description_input')[0].value;")
        due_date_value = driver.execute_script("return document.getElementsByName('due_date_input')[0].value;")
        print(f"Description: {description_value}, Due Date: {due_date_value}")

        # Add Todo
        
        time.sleep(30)
        
        add_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Add')]")))
        add_button.click()
        # wait.until(EC.presence_of_element_located((By.XPATH, f"//td[contains(text(), '{description}')]")))
        print("✅ Add Todo test passed!")
        """
        # 2. Mark Todo as Done
        try:
            mark_done_button = wait.until(
                EC.presence_of_element_located(
                    (By.XPATH, f"//td[contains(text(), '{description}')]/following-sibling::td/button[@name='done_button']")
                )
            )
            mark_done_button.click()
            done_todos_button = wait.until(EC.element_to_be_clickable((By.NAME, "open_done_button")))
            done_todos_button.click()
            wait.until(EC.presence_of_element_located((By.XPATH, f"//td[contains(text(), '{description}')]")))
            print("✅ Mark as Done test passed!")
            time.sleep(3)
        except Exception as e:
            print(f"❌ Error: {str(e)}")
        
        # 3. Delete Todo
        delete_button = driver.find_element(By.XPATH, f"//td[contains(text(), '{description}')]/following-sibling::td/button[contains(text(), 'Delete')]")
        delete_button.click()
        
        # Wait for the confirmation and then verify deletion
        driver.get("http://localhost:3000/dashboard")
        wait.until(EC.invisibility_of_element_located((By.XPATH, f"//td[contains(text(), '{description}')]")))
        print("✅ Delete Todo test passed!")
        
    except Exception as e:
        print(f"❌ Test failed: {str(e)}")
    finally:
        driver.quit()

# Run the test case
test_todo_operations()
