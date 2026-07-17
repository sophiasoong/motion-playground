# Project: MMS Web

## Design Token Rule
- All color, size, spacing, motion, and shadow values come from `tokens.json`
- Never hardcode raw values — always resolve to a token
- When a token doesn't exist for a value, flag it instead of guessing

## UI Generation Protocol
When building any component:
1. Read `tokens.json` first
2. Declare used tokens as CSS custom properties at the top of the file
3. Reference only those variables in styles — no raw values
4. Comment each variable with its token name

## Token → CSS Variable Convention
Token key `color/brand/primary` becomes `--color-brand-primary`
Token key `size/spacing/card/inner` becomes `--size-spacing-card-inner`

## Design System
- Design language and rules: see `DESIGN.md`
- Token definitions: see `tokens.json`
- Figma source: https://www.figma.com/design/RU2sCgGMuU0PXUhKwYcpfr/Claude-x-Design-System-Revamp?node-id=217-5484&t=KELFyLNXwJjPcbsJ-1

## When generating any UI component:
1. Read DESIGN.md for layout rules, spacing principles, component anatomy
2. Read tokens.json for all color, size, typography, and motion values
3. Never hardcode values — always resolve to a token
4. Use Material Symbols Rounded for icons
5. Primary: `#5244EE` (mapped to `color/brand/primary`)