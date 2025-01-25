# Contributing to Novascript

Thank you for your interest in contributing to Novascript! Contributions are welcome and appreciated. Whether you're reporting a bug, 
proposing a feature, or submitting code, this guide will help you get started.

---

## How to Contribute

### 1. Reporting Issues
If you find a bug or have a feature request, please create an issue in the [GitHub Issues](https://github.com/Repositoir/novascript-source/issues) section. Be sure to include:
- A clear description of the problem or suggestion.
- Steps to reproduce the issue.
- Your operating system and Novascript version.

### 2. Proposing Features
Before starting development on a new feature, create an issue or join the discussion to ensure alignment with the project's goals. Clearly describe:
- The purpose of the feature.
- The problem it solves.
- Any alternative solutions you’ve considered.

### 3. Submitting Pull Requests
To contribute code, follow these steps:
1. Fork the repository and clone it to your local machine.
2. Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b username/your-feature-name
   ```
3. Make your changes, following the coding standards outlined below.
4. Test your changes thoroughly.
5. Make a summary of 
6. Commit your changes with a clear and concise commit message.
7. Push your branch to your forked repository:
   ```bash
   git push origin username/your-feature-name
   ```
8. Open a pull request against the `main` branch of the Novascript repository.

### 4. Reviewing Pull Requests

When submitting a pull request:

- Ensure your code passes all tests.
- Provide a clear description of your changes and why they are necessary.
- Reference the related issue number (if applicable).

## Coding Standards

To ensure consistency and maintainability:

- Write clear, concise, and self-documenting code.
- Include comments where necessary.
- Use meaningful variable and function names.

---

# Development Setup

To set up the Novascript development environment:

1. Clone the repository.
   ```bash
   git clone https://github.com/Repositoir/novascript-source
   ```
2. Install dependencies
    ```bash
   npm install
    ```
3. For running and debugging using the `repl()`, just run the development

   ```shell
   npm run rev
   ```
   
   For running in Script mode, add the NovaScript file as program arguments.

   ```shell
   npm run dev -- filename.nv
   ```
4. Run your tests.

## Contact

For questions or discussions, email us at [aritrabb@gmail.com](mailto:aritrabb@gmail.com).

## Thank You for Contributing to NovaScript!
