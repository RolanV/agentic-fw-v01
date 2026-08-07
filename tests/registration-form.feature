@registration @smoke @regression
Feature: User Registration
  As a visitor to The Internet demo site
  I want to create a new account
  So that I can access protected resources

  Background:
    Given the user is on the registration page

  @positive @critical
  Scenario: User successfully registers with valid data
    When the user fills the registration form with valid data
    And the user clicks the "Sign up" button
    Then the registration should be successful
    And the confirmation page should display "Well done!"

  @negative @critical
  Scenario: Registration fails when required fields are missing
    When the user clears the "First name" field
    And the user fills the remaining fields with valid data
    And the user clicks the "Sign up" button
    Then a validation error for "First name" should be displayed

  @negative @critical
  Scenario: Registration fails with invalid email format
    When the user fills the registration form with an invalid email "invalid-email"
    And the user clicks the "Sign up" button
    Then a validation error for "Email" should be displayed

  @negative
  Scenario: Registration fails when password does not meet criteria
    When the user fills the registration form with a weak password "12345"
    And the user clicks the "Sign up" button
    Then a validation error for "Password" should be displayed

  @negative
  Scenario: Registration fails when username is already taken
    When the user fills the registration form with an existing username "johnsmith123"
    And the user clicks the "Sign up" button
    Then a validation error for "Username" should be displayed

  @ui
  Scenario: All registration form fields are visible
    Then all registration form fields should be visible

  @accessibility
  Scenario: Registration form has proper accessibility labels
    Then each input should have an accessible label

  @performance
  Scenario: Registration page loads within acceptable time
    Then the page should load within 3 seconds