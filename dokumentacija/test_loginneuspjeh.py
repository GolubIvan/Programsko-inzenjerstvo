import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

class TestLoginneuspjeh:
    def setup_method(self, method):
        # Initialize WebDriver with WebDriverManager
        self.driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
        self.driver.set_window_size(726, 816)
        self.vars = {}

    def teardown_method(self, method):
        self.driver.quit()

    def test_loginneuspjeh(self):
        driver = self.driver
        wait = WebDriverWait(driver, 10)

        # Step 1: Open login page
        driver.get("https://ezgrada-2.onrender.com/login")

        # Step 2: Enter email
        email_field = wait.until(EC.presence_of_element_located((By.ID, ":R2alafnnb:")))
        email_field.click()
        email_field.send_keys("ana@gmail.com")

        # Step 3: Enter password
        password_field = wait.until(EC.presence_of_element_located((By.ID, ":R2elafnnb:")))
        password_field.click()
        password_field.send_keys("lozinka")

        # Step 4: Click the login button
        login_button = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, ".css-beuub8")))
        login_button.click()

        # Step 5: Wait for the error message to appear and validate it
        error_message = wait.until(EC.presence_of_element_located((By.ID, "field:::R2elafnnb:::error-text")))
        assert error_message.is_displayed(), "Error message is not displayed."
