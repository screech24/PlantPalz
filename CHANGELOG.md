# Changelog

All notable changes to the Plant Palz project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.8.5] - 2024-06-17

### Changed
- Increased living room dimensions for a more spacious environment
- Improved plant positioning logic on shelves to accommodate more plants
- Adjusted shelf dimensions and spacing for better plant display
- Enhanced camera settings to prevent clipping through walls
- Raised grow light position to make more room for plants
- Optimized plant distribution on shelves (4 plants per shelf instead of 2)

## [0.8.4] - 2024-06-10

### Fixed
- Removed @import CSS syntax from styled-components GlobalStyle and moved Google Fonts to index.html
- Fixed styled-components warnings by using transient props with $ prefix consistently
- Updated Button component to use $variant, $size, and $fullWidth props
- Updated Card component to use $padding, $clickable, $elevation, and $fullWidth props
- Updated ProgressBar component to use $width, $backgroundColor, and $color props
- Updated ViewToggleButton component to use $active prop
- Updated Modal component to use $isOpen and $maxWidth props
- Updated ConfirmationModal component to use $isVisible prop
- Updated CategoryTab component to use $active prop
- Resolved React DOM warnings about unknown props being passed to DOM elements

## [0.8.3] - 2024-05-23

### Fixed
- Fixed styled-components warnings by using transient props with $ prefix
- Updated Card component to use $padding, $clickable, $elevation, and $fullWidth props
- Updated ProgressBar component to use $backgroundColor, $color, and $height props
- Updated PlantList component to use $isActive prop
- Updated PlantCustomization component to use $isActive and $color props
- Resolved React DOM warnings about unknown props being passed to DOM elements

## [0.8.2] - 2024-05-22

### Fixed
- Removed unused imports and variables to fix ESLint warnings
- Fixed missing dependency in useEffect hook in useGardenScene.ts
- Removed unused 'Plant' import in ShareModal.tsx
- Removed unused 'environment' and 'shelfWidth' variables in useGardenScene.ts
- Removed unused 'curtainDepth' variable in environmentModels.ts

## [0.8.1] - 2024-05-20

### Fixed
- Made the `isOpen` prop optional in the NewPlantForm component to fix compatibility issues when used within Modal components
- Added default value of `true` for the `isOpen` prop to maintain backward compatibility

## [0.8.0] - 2024-05-17

### Added
- Garden view with 3D living room scene showing all plants together
- Interactive shelving unit that displays up to 8 plants
- Day/night cycle with window and curtains that can be opened/closed
- Grow light that can be turned on/off to provide artificial light
- Toggle between individual plant view and garden view
- Automatic sunlight adjustment based on time of day and light sources

### Changed
- Improved game state management to include garden-wide settings
- Enhanced UI with view toggle buttons for switching between views
- Updated plant sunlight mechanics to be affected by curtains and grow light
- Reorganized game page layout for better integration of garden view

## [0.7.0] - 2024-03-17

### Added
- Talk to Plant feature that significantly boosts plant happiness
- Achievements system with different categories (care, growth, collection, happiness, special)
- More plant personality types (grumpy, philosophical, dramatic)
- Happiness boosts for optimal care actions (watering, fertilizing, sunlight)
- Achievement progress tracking and display

### Changed
- Improved happiness system with reduced decay rate
- Added minimum happiness floor of 10% to prevent plants from reaching 0 too quickly
- Enhanced plant responses based on personality types
- Updated UI to display achievements with filtering by category

### Fixed
- Fixed issue where plant happiness would plummet to 0 when left unattended
- Improved happiness recovery mechanisms through various care actions

## [0.6.1] - 2023-08-27

### Fixed
- Mobile menu now closes properly when navigating to the Settings page
- Added ability to close the mobile menu by clicking outside of it
- Improved mobile navigation experience with better menu handling

## [0.6.0] - 2023-08-26

### Added
- Complete set of favicon files for better cross-platform support
- SVG favicon for modern browsers
- Apple Touch Icon for iOS devices
- Web app manifest icons in multiple sizes
- Proper favicon for different screen resolutions

### Changed
- Updated theme color in manifest and meta tags to match app's green theme
- Improved PWA support with proper icons and manifest settings

## [0.5.2] - 2023-08-25

### Added
- New 'water' button variant with blue color for better visual distinction
- Colorful pot style buttons with unique colors for each pot type
- Improved hover effects for pot customization options

### Changed
- Reorganized game page layout for better responsiveness on both mobile and desktop
- Enhanced grid layout to better utilize screen space
- Improved button group responsiveness on small screens
- Separated plant customization into its own grid area for better organization

## [0.5.1] - 2023-08-22

### Fixed
- Improved button styling consistency across the game interface
- Enhanced secondary button visibility with proper background colors
- Fixed dark mode compatibility in home page feature cards
- Updated speech bubbles and response containers to use theme colors
- Fixed loading overlay and empty states to support dark mode properly
- Removed all hardcoded color values for better theme consistency

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