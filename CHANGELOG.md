# Changelog

All notable changes to the Plant Palz project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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