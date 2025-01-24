import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.action_chains import ActionChains
from webdriver_manager.chrome import ChromeDriverManager

class TestKreiranjekorisnika():
    def setup_method(self, method):
        self.driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
        self.driver.maximize_window()
        self.vars = {}

    def teardown_method(self, method):
        self.driver.quit()

    def test_kreiranjekorisnika(self):
        driver = self.driver
        wait = WebDriverWait(driver, 10)

        driver.get("https://ezgrada-2.onrender.com/login")

        wait.until(EC.presence_of_element_located((By.ID, ":R2alafnnb:"))).send_keys("ana@gmail.com")
        wait.until(EC.presence_of_element_located((By.ID, ":R2elafnnb:"))).send_keys("lozinka123")
        driver.find_element(By.CSS_SELECTOR, ".css-beuub8").click()

        wait.until(EC.presence_of_element_located((By.ID, ":r0:"))).send_keys("bozo")
        driver.find_element(By.ID, ":r1:").send_keys("bozo@gmail.com")
        driver.find_element(By.ID, ":r2:").send_keys("lozinka")
        driver.find_element(By.ID, ":r3:").send_keys("lozinka")

        wait.until(EC.element_to_be_clickable((By.ID, "menu::r5::trigger"))).click()
        wait.until(EC.element_to_be_clickable((By.ID, "Ulica Ivana Meštrovića 15"))).click()

        driver.find_element(By.CSS_SELECTOR, ".css-1jbtqe1").click()
