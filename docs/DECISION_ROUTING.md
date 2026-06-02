# Decision Routing

promptPACK classifies decisions by confidence, reversibility, risk, and consequence.

## Internal

Low-risk, reversible, advisory decisions.

Examples:

- count estimated tokens
- infer likely objective
- recommend no-op
- generate a candidate output
- run preset tests

## Internal candidate / human insert

The system can choose the candidate internally, but the user confirms insertion.

Example:

- compression passes and all must-facts are preserved

## Human-in-the-loop

High-consequence, ambiguous, irreversible, or user-facing actions.

Examples:

- coding handoff
- research handoff
- local-model handoff
- audit/high-stakes material
- aggressive compression
- insertion into active field
- publishing, sending, deleting, or deploying

## Rule

The extension may advise. The user decides consequential action.
