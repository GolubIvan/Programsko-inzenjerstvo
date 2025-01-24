import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager


class TestKreiranjesastanak:
    def setup_method(self, method):

        self.driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
        self.driver.set_window_size(726, 816)
        self.vars = {}

    def teardown_method(self, method):
        self.driver.quit()

    def test_kreiranjesastanak(self):
        driver = self.driver
        wait = WebDriverWait(driver, 10)

        driver.get("https://ezgrada-2.onrender.com/login")

        email_field = wait.until(EC.presence_of_element_located((By.ID, ":R2alafnnb:")))
        email_field.click()
        email_field.send_keys("branko@gmail.com")

        password_field = wait.until(EC.presence_of_element_located((By.ID, ":R2elafnnb:")))
        password_field.click()
        password_field.send_keys("glupalozinka")

        login_button = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, ".css-beuub8")))
        login_button.click()

        create_meeting_button = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, ".chakra-card__root:nth-child(3) .chakra-button")))
        create_meeting_button.click()

        new_meeting_button = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, ".css-vtsccc > .chakra-button:nth-child(1)")))
        new_meeting_button.click()

        naslov_field = wait.until(EC.presence_of_element_located((By.NAME, "naslov")))
        naslov_field.click()
        naslov_field.send_keys("Naslov1")

        vrijeme_field = wait.until(EC.presence_of_element_located((By.NAME, "vrijeme")))
        vrijeme_field.click()
        vrijeme_field.send_keys("2025-01-25T12:30")

        mjesto_field = wait.until(EC.presence_of_element_located((By.NAME, "mjesto")))
        mjesto_field.click()
        mjesto_field.send_keys("Zagreb")

        sazetak_field = wait.until(EC.presence_of_element_located((By.NAME, "sazetak")))
        sazetak_field.click()
        sazetak_field.send_keys("Sazetak")

        agenda_field = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, ".css-1145hk9")))
        agenda_field.click()
        agenda_field.send_keys("tocka")

        add_button = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, ".css-wuqtn7")))
        add_button.click()

        confirm_button = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, ".css-11ny6of")))
        confirm_button.click()

        driver.execute_script("window.scrollTo(0, 0)")

