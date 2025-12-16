# 🧩 Puzzle Solutions – User Management API

This document describes how the hidden puzzles included in the assessment were discovered and solved.  
The goal of these puzzles was to encourage exploration of headers, hidden routes, and encoded data.

---

## 🧩 Puzzle 1: Secret Header

### Discovery
While inspecting HTTP responses for standard API requests (e.g. `/api/users`), a custom response header was observed in the network tab.

### Header Found

```X-Secret-Challenge: find_me_if_you_can_2024```


### Conclusion
The presence of this header indicated that the application contained hidden challenges and hinted at further puzzles.

---

## 🧩 Puzzle 2: Hidden Endpoint

### Discovery
The response headers of the `GET /api/users` endpoint included an additional hint:

```X-Secret-Endpoint: /api/users/secret-stats```


This endpoint was not documented in the public API.

### Access Attempt
Directly accessing the endpoint initially resulted in an access denied response, confirming that special conditions were required.

### Hidden Endpoint

```GET /api/users/secret-stats```dotnetcli


---

## 🧩 Puzzle 3: Encoded Message

### Discovery
Once the secret endpoint was accessed successfully, the response contained a Base64-encoded message.

### Encoded Value

```Q29uZ3JhdHVsYXRpb25zISBZb3UgZm91bmQgdGhlIHNlY3JldCBlbmRwb2ludC4gVGhlIGZpbmFsIGNsdWUgaXM6IFNIQ19IZWFkZXJfUHV6emxlXzIwMjQ=```


### Decoded Message

```dotnetcli
Congratulations! You found the secret endpoint.
The final clue is: SHC_Header_Puzzle_2024
```


---

## 🧩 Puzzle 4: Multiple Access Methods

### Discovery
Error responses and hints suggested that the secret endpoint could be accessed using more than one method.

### Valid Access Methods

#### Method 1: Custom Request Header

```X-Secret-Challenge: find_me_if_you_can_2024```


#### Method 2: Query Parameter Override

```/api/users/secret-stats?secret=admin_override```


Both methods allow access when combined with valid authentication and admin privileges.

---

## ✅ Puzzle Completion Summary

- ✔ Secret header identified via response headers
- ✔ Hidden endpoint discovered via API hints
- ✔ Encoded message decoded successfully
- ✔ Multiple access methods validated

---

## 🏁 Final Notes

These puzzles required:
- Careful inspection of response headers
- Exploration beyond documented endpoints
- Understanding of encoded data formats
- Testing alternate access mechanisms

The puzzles were designed to test curiosity, attention to detail, and understanding of backend systems rather than brute-force discovery.