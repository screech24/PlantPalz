# Plant Palz

Plant Palz is a virtual plant simulation game where you can grow, nurture, and share plants with unique personalities. Experience the joy of gardening in a fun, interactive way!

![Plant Palz Screenshot](public/screenshot.png)

**Current Version: 0.8.5**

## Features

- **Grow Your Garden**: Start with a seedling and watch it grow through different stages as you care for it.
- **Interactive Care**: Water, fertilize, prune, adjust sunlight, and talk to your plants to keep them happy and healthy.
- **Plant Personalities**: Each plant has a unique personality (sassy, shy, cheerful, grumpy, philosophical, or dramatic) that affects how it responds to your care.
- **Garden View**: View all your plants together in a 3D living room scene with interactive lighting controls.
- **Day/Night Cycle**: Experience a day/night cycle that affects your plants' sunlight needs.
- **Achievements System**: Unlock achievements as you care for your plants and grow your garden.
- **Share Your Plants**: Share your plants with friends and family via social media or direct links.
- **Customization**: Choose from different plant types and pot styles, each with unique characteristics.
- **Time Simulation**: Watch your plants grow over time with adjustable time scales.
- **Dark Mode**: Toggle between light and dark themes for comfortable viewing day or night.

## Garden View Features

The garden view allows you to:

- See all your plants displayed together on a shelving unit in a living room setting
- Control sunlight through interactive curtains that can be opened or closed
- Use a grow light that can be turned on/off to provide artificial light at night
- Experience a day/night cycle that affects your plants' sunlight needs
- Toggle between individual plant view and garden view

## Customization Features

The customization features allow you to:

- Select from 5 different pot types (basic, round, square, hexagonal, decorative)
- Choose from 8 different pot colors to match your style
- Customize each plant individually with its own unique pot

## Sharing Feature

The sharing feature allows you to:

- Generate a unique URL for any plant in your garden
- Share your plants directly to social media platforms
- Capture screenshots of your plants to save or share
- View plants shared by others and add them to your garden

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/plant-palz.git
   cd plant-palz
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## Technologies Used

- React
- TypeScript
- Three.js for 3D rendering
- Styled Components for styling
- Zustand for state management
- React Router for navigation

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Plant icons created by [Freepik](https://www.freepik.com)
- Inspiration from real-world plant care

## Version History

- 0.8.5: Improved living room dimensions and plant positioning on shelves
- 0.8.4: Fixed styled-components warnings and improved code quality
- 0.8.3: Fixed styled-components warnings by using transient props with $ prefix
- 0.8.2: Fixed ESLint warnings by removing unused imports and variables
- 0.8.1: Fixed NewPlantForm component compatibility issues
- 0.8.0: Added garden view with 3D living room scene and day/night cycle
- 0.7.0: Added Talk to Plant feature and achievements system
- 0.6.1: Fixed mobile menu navigation issues and improved mobile UX
- 0.6.0: Added complete set of favicons for better cross-platform support
- 0.5.2: Improved button styling and game page layout
- 0.5.0: Added pot customization with different types and colors
- 0.4.1: Enhanced dark mode implementation across all UI components
- 0.4.0: Added dark mode theme with toggle in settings
- 0.3.1: Fixed routing issues for GitHub Pages deployment
- 0.3.0: Fixed bugs, improved performance, and deployed to GitHub Pages
- 0.2.0: Added sharing feature
- 0.1.0: Initial release with basic plant care functionality
