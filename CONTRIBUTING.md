# Contributing

Hello, thanks for your interest in contributing to Lophura! We appreciate your help in making Lophura even better.

We have a few guidelines to help you get started in this project:

- [Commit Convention](#commit-convention)
- [Setup](#setup)
- [Pull Request](#pull-request)

## Commit Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification for commit messages.

### Commit Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer]
```

#### Type

Must be one of the following:

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **build**: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
- **ci**: Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)
- **chore**: Other changes that don't modify `src` or `test` files
- **revert**: Reverts a previous commit

Example:

```
feat: add new feature
```

## Setup

Before you start, please make sure you have [Node.js](https://nodejs.org/en/download/) (at least v18) and [pnpm](https://pnpm.io/installation) installed.

```bash
git clone https://github.com/hexaaagon/lophura.git
cd lophura
pnpm install
```

Run this command will spin up all the required services and files.

```bash
pnpm run lophura:setup
```

### Development

Run this script.

```bash
pnpm run packages:script
```

Run this command to start the development server.

```bash
pnpm run lophura:dev
```

Go to http://localhost:3000 to see the development server.

### Production (Build)

Start building the server.

```bash
pnpm run build
```

Run this command to start the production server.

```bash
pnpm run lophura:start
```

Go to http://localhost:3000 to see the production server.

## Pull Request

- When creating a pull request, please provide a clear description of the changes you are making.
- Make sure to add tests for your changes.
- If your pull request fixes an issue, please include a link to the issue in the description.

Thanks for contributing!
