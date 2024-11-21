# AI Multi-Agent System - Memory Guide
# Last Updated: 2024-11-19

## Project Overview
This document serves as a human-readable guide to our AI multi-agent system's core principles and learnings from our interactions. It's designed to help understand the system's architecture and key decisions.

## Key File Locations
1. Core API Implementation: src/lib/apiClient.js
2. Base Agent Logic: src/agents/BaseAgent.js
3. Specialized Agents: src/agents/SpecializedAgents.js
4. Environment Configuration: .env

## Critical Design Principles

### URL Handling
- PREFERRED: Use complete URLs in environment variables
- AVOID: Breaking URLs into components (url, deployment name, version)
- WHY: Simplifies configuration and reduces potential errors

### Environment Variables
- PRINCIPLE: Keep all variables explicit and active
- AVOID: Commenting out variables, even if unused
- MAINTAIN: Clear documentation of all variables' purposes

### Code Organization
- STRUCTURE: Modular, agent-based architecture
- FLOW: Environment -> Base Agent -> API Client
- PATTERN: Specialized agents inherit from base agent

## Key Implementation Details

### API Client (apiClient.js)
- Primary interface for API communication
- Handles both OpenAI and custom endpoints
- Uses direct URL configuration approach

### Base Agent (BaseAgent.js)
- Foundation for all specialized agents
- Manages API client configuration
- Ensures consistent behavior across agents

### Specialized Agents (SpecializedAgents.js)
- Implements specific agent behaviors
- Inherits core functionality from BaseAgent
- Maintains clean separation of concerns

## Success Patterns

1. Configuration Flow
   - Direct path: ENV -> Agent -> Client
   - No intermediate transformations
   - Clear error propagation

2. URL Management
   - Single source of truth
   - No URL construction in code
   - Explicit configuration

3. Error Handling
   - Clear error messages
   - Proper propagation
   - Informative feedback

## Future Considerations

1. URL Configuration
   - Continue using full URLs
   - Maintain backward compatibility
   - Document any URL pattern changes

2. Environment Variables
   - Keep configuration explicit
   - Avoid deprecated patterns
   - Document all changes

3. Agent Configuration
   - Align with API client changes
   - Maintain consistency
   - Update documentation

## Reference Points
For technical details, consult:
- @q&a.md for specific implementation discussions
- @README.md for system overview
- @CHANGELOG.md for version history

Remember: The system prioritizes clarity and direct configuration over complex composition of components.
