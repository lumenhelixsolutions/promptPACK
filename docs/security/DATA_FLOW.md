# Data Flow

```txt
User selects text
  ↓ user clicks "Use selected text"
Content script returns selected text
  ↓
Side panel local engine
  ↓
Objective detection / preservation controls
  ↓
Output + result report
  ↓ user clicks Copy or Insert
Clipboard or active editable field
```

No server is involved in the current prototype.
