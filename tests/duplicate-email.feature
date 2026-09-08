@ui @smoke @regression
Feature: Duplicate email registration - A3
  As a prospective customer of ZincBank
  I want to be prevented from registering a second account with an email that already belongs to a customer
  So that I am guided to sign in instead of creating a duplicate account

  Background:
    Given an account is already registered with a unique email address

  @positive @critical
  Scenario: A brand-new email registers successfully
    When the user applies for an account using a different email address
    Then the application is accepted
    And the user is signed in to the dashboard

  @negative @critical
  Scenario: Registering again with the same email is rejected
    When the user applies for an account using the already-registered email/
    Then the application is rejected
    And a duplicate-email message is shown

  @functional @critical
  Scenario: The duplicate-email message is shown exactly
    When the user applies for an account using the already-registered email
    Then a duplicate-email message is shown
    And the message reads "An account with this email already exists. Please sign in instead."

  @boundary
  Scenario Outline: Duplicate detection ignores case and surrounding whitespace
    When the user applies for an account using the email "<variant>"
    Then the application is rejected
    And a duplicate-email message is shown

    Examples:
      | variant                |
      | Test@X.com             |
      |  E2E-Case@example.com  |

  @regression @critical
  Scenario: Rejecting a duplicate does not change the existing account
    When the user applies for an account using the already-registered email
    Then the application is rejected
    And no new account is created
    And the existing account balance is unchanged

  @functional
  Scenario: Rejected form keeps the name and email and clears the password
    When the user applies for an account using the already-registered email
    Then the application is rejected
    And the name and email fields still show the entered values
    And the password field is empty
