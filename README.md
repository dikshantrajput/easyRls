# EasyRls

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)](CONTRIBUTING.md)

EasyRls is an open-source project designed to simplify the management of Row
Level Security (RLS) policies in PostgreSQL databases. With EasyRls, you can
easily connect to your PostgreSQL instance, manage schemas and tables, and
create, edit, or delete RLS policies—all through an intuitive interface that
supports both light and dark themes.

https://github.com/user-attachments/assets/3a86e97c-2b3d-4119-b26f-be2773613e7d

## Features

- **Connect to PostgreSQL Instances**: Easily connect to any PostgreSQL instance
  using a connection string.
- **List Schemas**: View all schemas available in your connected PostgreSQL
  instance.
- **List Tables in a Schema**: Navigate through schemas to list all tables
  within a selected schema.
- **RLS Policy Status**: Check the RLS policy status on any table, enabling you
  to quickly identify which tables have RLS policies applied.
- **Enable/Disable RLS Policies**: Toggle RLS policies on and off as needed for
  any table.
- **Manage RLS Policies**:
  - **List All RLS Policies**: View a list of all RLS policies applied to a
    specific table.
  - **Create New RLS Policy**: Easily create new RLS policies to manage data
    access at a granular level.
  - **Edit Existing Policy**: Modify existing RLS policies to adapt to changing
    requirements.
  - **Delete Policy**: Remove unnecessary RLS policies with ease.
  - **Copy Policy**: Duplicate existing RLS policies to streamline the creation
    of similar policies.
- **Search Functionality**: Search through schemas, tables, and policies to
  quickly find what you need.
- **Light and Dark Theme**: Choose between light and dark themes for a
  comfortable user experience.



## Installation

To get started with EasyRls, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/EasyRls.git
   cd easyRls
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the application:**
   ```bash
   npm start
   ```

## Usage

1. **Connect to your PostgreSQL instance** using the provided connection string
   interface.
2. **Explore schemas and tables** to manage RLS policies.
3. **Create, edit, or delete RLS policies** as per your requirements.

### Note:
If it says "SAML ERROR", double check your password for `@`,`#` and other special characters. They are not properly encoded and if issue still persists, try to use `psql` instead of `postgres` in prefix of connection string

## Contributing

Contributions from the community are welcomed! If you'd like to contribute,
please read our [Contributing Guide](CONTRIBUTING.md) and
[Code of Conduct](CODE_OF_CONDUCT.md).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.txt)
file for details.
