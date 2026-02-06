# Page snapshot

```yaml
- generic [ref=e4]:
  - heading "SplitBill" [level=1] [ref=e5]
  - heading "Create Account" [level=2] [ref=e6]
  - generic [ref=e7]:
    - generic [ref=e8]:
      - generic [ref=e9]: Name
      - textbox "Your name" [ref=e10]: Alice Test User
    - generic [ref=e11]:
      - generic [ref=e12]: Email
      - textbox "you@example.com" [ref=e13]: alice-1770348499048@test.com
    - generic [ref=e14]:
      - generic [ref=e15]: Password
      - textbox "••••••••" [active] [ref=e16]: Test@123456
    - button "Create Account" [ref=e17] [cursor=pointer]
  - paragraph [ref=e18]:
    - text: Already have an account?
    - link "Login here" [ref=e19] [cursor=pointer]:
      - /url: /login
```