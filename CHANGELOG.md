# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.0] - 2024-03-17

### Added
- Procedurally generated 3D plants with different types (succulent, cactus, fern, flower)
- Simple 3D room environment with shelves and window
- Selection message when no plant is selected
- Improved mobile responsiveness for all components

### Changed
- Replaced external 3D model dependencies with procedurally generated geometry
- Enhanced plant controls visibility and positioning
- Improved garden view layout with proper sizing and shadows
- Optimized mobile layout for better usability on small screens

### Fixed
- Fixed missing 3D scene rendering
- Fixed plant controls not being visible
- Fixed layout issues on mobile devices
- Improved error handling for 3D model loading

## [1.3.0] - 2023-07-10

### Added
- New garden view with 3D living room scene
- Speech bubble component to show plant emotions
- Improved plant visibility and positioning in the garden scene

### Changed
- Repositioned plant controls to the bottom right to avoid overlapping with the scene
- Adjusted camera position and lighting for better plant visibility
- Enhanced plant selection feedback with visual highlights
- Improved plant mood responses in speech bubbles

### Fixed
- Fixed missing plant controls in garden view
- Added missing getColorValue export in potModels.ts
- Fixed plant positioning to ensure all plants are visible
- Improved layout to prevent UI elements from overlapping

## [1.2.0] - 2023-06-15

### Added
- Weather integration to affect plant growth
- New plant personalities with unique responses
- Achievements system for plant care milestones

### Changed
- Improved UI for plant management
- Enhanced plant growth visualization
- Updated notification system

## [1.1.0] - 2023-05-01

### Added
- Multiple pot colors and styles
- Plant happiness tracking
- Daily care reminders

### Changed
- Improved plant growth algorithm
- Enhanced mobile responsiveness

### Fixed
- Water tracking calculation bug
- Plant selection in garden view

## [1.0.0] - 2023-04-01

### Added
- Initial release
- Basic plant creation and management
- Plant watering and care mechanics
- Simple garden view 