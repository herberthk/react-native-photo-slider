
# Project Overview

This project is a React Native image slider component. It provides a customizable, animated image slider for React Native applications. The component supports various animation types, autoplay, and pagination dots.

**Key Technologies:**

*   React Native
*   TypeScript
*   React Native Reanimated
*   Jest for testing
*   ESLint for linting
*   Prettier for code formatting
*   Yarn for package management

**Architecture:**

The project is a monorepo managed with Yarn workspaces. It includes the main library and an example application. The library is built with TypeScript and uses React Native Reanimated for animations.

# Building and Running

**Prerequisites:**

*   Node.js
*   Yarn
*   Android Studio or Xcode for mobile development

**Installation:**

```sh
yarn
```

**Running the Example App:**

*   **Android:** `yarn example android`
*   **iOS:** `yarn example ios`
*   **Web:** `yarn example web`

**Running Tests:**

```sh
yarn test
```

**Linting and Formatting:**

*   **Lint:** `yarn lint`
*   **Fix linting errors:** `yarn lint --fix`
*   **Type checking:** `yarn typecheck`

# Development Conventions

*   **Commit Messages:** The project follows the Conventional Commits specification.
*   **Branching:** (No information on branching strategy was found in the provided files)
*   **Testing:** The project uses Jest for unit testing. However, the test file for the main component is currently empty.
*   **Code Style:** The project uses ESLint and Prettier to enforce a consistent code style.
*   **Contributions:** Contributions are welcome. See `CONTRIBUTING.md` for more details.

# Key Files

*   `src/index.tsx`: The main source file for the ImageSlider component.
*   `example/src/App.tsx`: The example application that demonstrates the usage of the ImageSlider component.
*   `package.json`: Defines the project's dependencies, scripts, and other metadata.
*   `CONTRIBUTING.md`: Provides guidelines for contributing to the project.
*   `babel.config.js`: Babel configuration file.
*   `tsconfig.json`: TypeScript configuration file.
