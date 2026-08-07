# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: registration.test.ts >> Fill registration form and submit
- Location: src/tests/registration.test.ts:5:5

# Error details

```
Test timeout of 30000ms exceeded.
```

# Page snapshot

```yaml
- generic [ref=e1]:
  - navigation [ref=e2]:
    - list [ref=e3]:
      - listitem [ref=e4]:
        - link "Home" [ref=e5] [cursor=pointer]:
          - /url: /
  - generic [ref=e6]:
    - generic [ref=e13]:
      - heading "Registration form" [level=2] [ref=e15]
      - generic [ref=e16]:
        - generic [ref=e17]:
          - generic [ref=e18] [cursor=pointer]: First name
          - generic [ref=e19]:
            - textbox "first name" [ref=e20]: John
            - generic [ref=e21]: 
        - generic [ref=e22]:
          - generic [ref=e23] [cursor=pointer]: Last name
          - generic [ref=e24]:
            - textbox "last name" [ref=e25]: Smith
            - generic [ref=e26]: 
        - generic [ref=e27]:
          - generic [ref=e28] [cursor=pointer]: Username
          - generic [ref=e29]:
            - textbox "username" [ref=e30]: johnsmith123
            - generic [ref=e31]: 
        - generic [ref=e32]:
          - generic [ref=e33] [cursor=pointer]: Email address
          - generic [ref=e34]:
            - textbox "email@email.com" [ref=e35]: john.smith@example.com
            - generic [ref=e36]: 
        - generic [ref=e37]:
          - generic [ref=e38] [cursor=pointer]: Password
          - generic [ref=e39]:
            - textbox [ref=e40]: SecurePass123!
            - generic [ref=e41]: 
        - generic [ref=e42]:
          - generic [ref=e43] [cursor=pointer]: Phone number
          - generic [ref=e44]:
            - textbox "571-000-0000" [ref=e45]: 202-555-0123
            - generic [ref=e46]: 
        - generic [ref=e47]:
          - generic [ref=e48] [cursor=pointer]: Gender
          - generic [ref=e49]:
            - generic [ref=e51] [cursor=pointer]:
              - radio "Male" [checked] [active] [ref=e52]
              - text: Male
            - generic [ref=e54] [cursor=pointer]:
              - radio "Female" [ref=e55]
              - text: Female
            - generic [ref=e56]:
              - generic [ref=e57] [cursor=pointer]:
                - radio "Other" [ref=e58]
                - text: Other
              - generic [ref=e59]: 
        - generic [ref=e60]:
          - generic [ref=e61] [cursor=pointer]: Date of birth
          - textbox "MM/DD/YYYY" [ref=e63]
        - generic [ref=e64]:
          - generic [ref=e65] [cursor=pointer]: Department / Office
          - combobox [ref=e67]:
            - option "Select your Department/Office" [selected]
            - option "Department of Engineering"
            - option "Department of Agriculture"
            - option "Accounting Office"
            - option "Tresurer's Office"
            - option "MPDC"
            - option "MCTC"
            - option "MCR"
            - option "Mayor's Office"
            - option "Tourism Office"
        - generic [ref=e68]:
          - generic [ref=e69] [cursor=pointer]: Job title
          - combobox [ref=e71]:
            - option "Select job type" [selected]
            - option "Designer"
            - option "Manager"
            - option "Developer"
            - option "SDET"
            - option "QA"
            - option "Scrum Master"
            - option "Product Owner"
            - option "Project Manager"
        - generic [ref=e72]:
          - generic [ref=e73] [cursor=pointer]: Select programming languages
          - generic [ref=e74]:
            - generic [ref=e75]:
              - checkbox "C++" [ref=e76]
              - generic [ref=e77] [cursor=pointer]: C++
            - generic [ref=e78]:
              - checkbox "Java" [ref=e79]
              - generic [ref=e80] [cursor=pointer]: Java
            - generic [ref=e81]:
              - checkbox "JavaScript" [ref=e82]
              - generic [ref=e83] [cursor=pointer]: JavaScript
        - button "Sign up" [ref=e86] [cursor=pointer]
    - generic [ref=e88]:
      - separator [ref=e89]
      - generic [ref=e90]:
        - text: Powered by
        - link "CYDEO" [ref=e91] [cursor=pointer]:
          - /url: https://cydeo.com/
```