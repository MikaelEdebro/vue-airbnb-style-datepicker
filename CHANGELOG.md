# Changelog

All notable changes to this project will be documented in this file.

## [2.8.0] - 2026-04-23

### Added
- Pluggable selection strategy system with `selectionStrategy`:
  - `single`
  - `range`
  - `reservation-aware-range`
- New unified interaction events:
  - `selection-changed`
  - `hover-range-changed`
  - `blocked-date-clicked`
- New extracted logic modules for maintainability and testability:
  - `colorUtils`
  - `reservationUtils`
  - `selectionUtils`
  - `selectionState`
  - `selectionStrategies`
  - `badgeLayout`
  - `calendarModel`
- New unit/integration coverage for:
  - selection strategy behavior
  - selection state transitions
  - badge layout math
  - calendar model generation

### Changed
- Refactored `AirbnbStyleDatepicker.vue` to delegate business logic to focused modules while preserving current behavior.
- Improved month-transition badge rendering flow to avoid visual teleport/flicker during calendar transitions.
- Updated demo (`dev/App.vue`) and static docs examples to showcase `selectionStrategy` and unified events.
- Updated docs with migration guidance from legacy date events to unified events.

### Compatibility
- `date-one-selected` and `date-two-selected` are still emitted for backward compatibility.
- Existing reservations behavior remains default:
  - reservation interior dates are non-selectable
  - reservation start/end remain selectable
