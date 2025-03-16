# Changelog

All notable changes to the Plant Palz project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.5.0] - 2023-08-20

### Added
- Pot customization feature with different pot types (basic, round, square, hexagonal, decorative)
- Pot color selection with 8 different colors
- PlantCustomization component for changing pot type and color
- Added potType property to Plant type

### Fixed
- Soil positioning in pot models for better visual appearance
- Removed unused variables in square pot generation
- Improved hexagonal pot rim implementation
- Fixed pot models to properly display in the 3D scene

### Changed
- Updated useThreeScene hook to use plant's potType property
- Enhanced GameStore with pot type and color update functions
- Improved overall visual consistency of pot models

## [0.4.1] - 2023-08-15

### Fixed
- Comprehensive dark mode implementation across all UI components
- Fixed white backgrounds in Modal and Card components
- Updated Button component to use theme colors
- Enhanced ProgressBar to properly support dark mode
- Improved toggle slider in settings to use theme colors
- Added theme-aware scrollbar styling
- Fixed form elements to properly respond to theme changes

### Changed
- Enhanced GlobalStyle with better transitions between themes
- Improved overall UI consistency in both light and dark modes
- Added color transitions for smoother theme switching

## [0.4.0] - 2023-08-10

### Added
- Dark mode theme with toggle switch in settings
- Theme persistence using localStorage
- Smooth transitions between light and dark themes

### Changed
- Updated theme system to support multiple themes
- Improved UI contrast in both light and dark modes
- Enhanced accessibility for color-sensitive users

## [0.3.1] - 2023-07-25

### Fixed
- Routing issues with GitHub Pages by switching to HashRouter
- Added 404.html page for better handling of direct URL access
- Updated index.html with proper redirects for SPA on GitHub Pages

## [0.3.0] - 2023-07-20

### Added
- GitHub Pages deployment configuration
- Deployment scripts in package.json

### Changed
- Updated dependencies to latest versions
- Improved performance for plant rendering
- Enhanced responsive design for better cross-device compatibility

### Fixed
- Various type errors and warnings
- Compilation issues for production build
- UI rendering issues on smaller screens

## [0.2.0] - 2023-06-15

### Added
- Sharing feature that allows users to share plants via unique URLs
- Social media sharing integration (Twitter, Facebook)
- Screenshot functionality to capture and download plant images
- ShareModal component for the sharing interface
- SharePage to view shared plants
- Utility functions for generating and handling share links

### Changed
- Updated App.tsx to include routing and the SharePage
- Added getPlantById function to the game store
- Improved UI with consistent styling across components
- Enhanced responsive design for better mobile experience

### Fixed
- Various styling issues in mobile view
- Plant response handling edge cases

## [0.1.0] - 2023-05-01

### Added
- Initial release of Plant Palz
- Basic plant care functionality (watering, fertilizing, sunlight adjustment, pruning)
- Plant growth simulation with time scaling
- Different plant types with unique care requirements
- Plant personalities affecting responses
- Basic UI components (buttons, cards, progress bars)
- Game state management with Zustand
- Persistent storage using localStorage 