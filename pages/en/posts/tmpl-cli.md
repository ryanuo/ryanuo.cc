---
title: "Template CLI: A Powerful Tool for Managing Project Templates"
date: 2025-03-10 20:00:00
description: A powerful tool for efficiently managing project templates, supporting quick cloning and flexible configuration from Git repositories.
---

# Template CLI 🚀

A convenient project template management tool for quickly cloning templates from Git repositories.

## Features

- ✅ Interactive template selection
- ✅ Flexible configuration via command-line arguments
- ✅ Intelligent cache configuration management
- ✅ Support for branch specification and directory renaming
- ⚡ Native JSON project selection mode

## Installation

### Install via Cargo

```bash
cargo install --path .
```

### Manual Build

```bash
git clone https://github.com/your-repo/project-template.git
cd project-template
cargo build --release
```

## Usage Guide

### Basic Command Structure

```bash
template-cli [options]
```

### Quick Start Examples

```bash
# Clone a template project (interactive selection)
template-cli https://github.com/my-repo/templates

# Clone with specific parameters
template-cli -r https://github.com/my-repo -b dev -d ./new-project -t my_template

# View cache configuration
template-cli -x

# Use native project selection mode
template-cli --original https://github.com/my-repo.json
```

## Parameter Description

| Parameter           | Description                       | Default Value |
| ------------------- | --------------------------------- | ------------- |
| `-r, --repo`        | Git repository URL to clone       | -             |
| `-b, --branch`      | Git branch name                   | main          |
| `-d, --target-dir`  | Target directory for the template | Current dir   |
| `-t, template`      | Specific template to use          | Interactive   |
| `-o, --original`    | Use native JSON configuration     | -             |
| `-c, --clear-cache` | Clear configuration cache         | -             |
| `-x, --check-cache` | View saved configuration cache    | -             |

### Advanced Parameters

- **Intelligent Cache**:
  Automatically saves recently used repositories, branches, etc., and prioritizes cache on reuse.

  - View cache: `template-cli -x`
  - Clear cache: `template-cli -c`

- **Native Project Selection Mode**:
  Use the `--original` parameter to specify a JSON configuration file URL, which displays a selection interface like this:

  ```bash
  Category:
  1. Frontend Projects
  2. Backend Projects

  Select a category (default: Frontend Projects):
  ```

## Workflow

1. User inputs parameters or selects interactive mode.
2. Determine repository information based on parameters/cache.
3. Clone the repository from the specified branch to a temporary directory.
4. Display available templates for user selection.
5. Copy the selected template to the target path.
6. Automatically clean up temporary files and output success message.

## FAQ

**Q: Where is the cache stored?**

```bash
~/.tmpl-cli/{.template_cli_cache.json}
```

**Q: How to completely reset the configuration?**

```bash
rm -rf ~/.tmpl-cli && template-cli --clear-cache
```

**Q: Supported template repository structure?**

```
<repository>/
├── template1/
├── template2/
└── .gitignore
```

## Developer Guide

### Code Structure

```
src/
├── cache.rs    # Cache module
├── cli.rs      # Command-line parsing
├── errors.rs   # Error handling
├── git.rs      # Git operations
├── original.rs # Native mode implementation
├── utils.rs    # Utility methods
└── template.rs # Core template handling
```

### Contribution Guide

1. Fork this repository.
2. Create a feature branch: `git checkout -b feature/X`.
3. Implement the feature and test it.
4. Create a Pull Request.
