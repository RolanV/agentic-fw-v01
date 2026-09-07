@ui @smoke @regression
Feature: Open an account - A1
  As a prospective customer of ZincBank
  I want to open a checking account through the online application
  So that I can start banking with a ready-to-use account

  @positive @critical
  Scenario: A visitor opens a checking account and is signed in
    Given the user is on the ZincBank open-account page
    When the user proceeds from the accounts step
    And the user fills in their first name "E2E"
    And the user fills in their last name "Register"
    And the user fills in a unique email address
    And the user proceeds to the identity step
    And the user fills in their SSN "123-45-6789"
    And the user selects their employment status "Employed"
    And the user proceeds to the address step
    And the user fills in their street address "123 Test Ave"
    And the user fills in their city "Springfield"
    And the user selects their state "CA"
    And the user fills in their ZIP code "90210"
    And the user proceeds to the security step
    And the user sets their password to "Abcdef12!"
    And the user proceeds to the review step
    And the user accepts the simulated-bank terms
    And the user submits the application
    And the user continues to the dashboard
    Then the user should be on the dashboard
    And the dashboard should show a welcome heading
    And the dashboard should show a total deposit balance of "$0.00"
