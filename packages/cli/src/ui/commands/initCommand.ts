/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommandKind, SlashCommand } from './types.js';
import * as path from 'path';
import * as fs from 'fs';

export const initCommand: SlashCommand = {
  name: 'init',
  description: 'create a GEMINI.md project file',
  kind: CommandKind.BUILT_IN,
  action: async (context, _args) => {
    const projectRoot =
      context.services.config?.getTargetDir() || process.cwd();
    const geminiMdPath = path.join(projectRoot, 'GEMINI.md');

    // Check if GEMINI.md already exists
    if (fs.existsSync(geminiMdPath)) {
      return {
        type: 'message',
        messageType: 'info',
        content: `GEMINI.md already exists at ${path.relative(process.cwd(), geminiMdPath)}. Use the existing file or rename it first.`,
      };
    }

    // Create a basic GEMINI.md template
    const template = `# Project Context

This file contains context and information about this project for Gemini CLI.

## Project Overview

Describe your project here. What is it? What does it do? What are the main goals?

## Key Files and Directories

- \`src/\` - Source code
- \`docs/\` - Documentation
- \`tests/\` - Test files

## Development Setup

How to set up and run this project locally.

## Common Tasks

- Building the project
- Running tests
- Deployment

## Notes

Add any additional context, conventions, or important information here.
`;

    try {
      // Ensure the directory exists
      const dir = path.dirname(geminiMdPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Write the template file
      fs.writeFileSync(geminiMdPath, template, 'utf8');

      return {
        type: 'message',
        messageType: 'info',
        content: `✅ Created GEMINI.md at ${path.relative(process.cwd(), geminiMdPath)}\n\nThis file contains project context for Gemini CLI. Edit it to add information about your project, key files, setup instructions, and any other context that would be helpful for AI assistance.`,
      };
    } catch (error) {
      return {
        type: 'message',
        messageType: 'error',
        content: `Failed to create GEMINI.md: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  },
};
