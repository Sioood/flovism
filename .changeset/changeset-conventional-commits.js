/**
 * @see https://github.com/moecasts/casts-design/blob/285f4f6e855137b9f2736e9eb6328b0d71885cf5/package.json
 * @see https://github.com/iamchathu/changeset-conventional-commits/blob/50bf163d24b0edfc3c9b8b1ab284ef61fbd07522/src/utils/index.ts
 * - This can be executed by pnpm dlx changeset-conventional-commits
 * - But docs, tests, ci and chore are considered minor
 */
import readChangeset from '@changesets/read'
import writeChangeset from '@changesets/write'
import { getPackagesSync } from '@manypkg/get-packages'
import { execSync } from 'child_process'
import { Command } from 'commander'
import fs from 'fs'
import path from 'path'
/*
 * Copied from conventional commits config:
 * https://github.com/conventional-changelog/conventional-changelog/blob/master/packages/conventional-changelog-conventionalcommits/writer-opts.js
 * "section" is currently unused but is left in, with the intent to update changeset changelog generation once more fleshed out
 */
const defaultCommitTypes = [
  { type: 'feat', section: 'Features' },
  { type: 'feature', section: 'Features' },
  { type: 'fix', section: 'Bug Fixes' },
  { type: 'perf', section: 'Performance Improvements' },
  { type: 'revert', section: 'Reverts' },
  { type: 'docs', section: 'Documentation' },
  { type: 'style', section: 'Styles' },
  { type: 'chore', section: 'Miscellaneous Chores' },
  { type: 'refactor', section: 'Code Refactoring' },
  { type: 'test', section: 'Tests' },
  { type: 'build', section: 'Build System' },
  { type: 'ci', section: 'Continuous Integration' },
]
export const isBreakingChange = (commit) => {
  return commit.includes('BREAKING CHANGE:') || defaultCommitTypes.some((commitType) => commit.match(new RegExp(`^${commitType.type}(?:\(.*\))?!:`)))
}
export const isConventionalCommit = (commit) => {
  return defaultCommitTypes.some((commitType) => commit.match(new RegExp(`^${commitType.type}(?:\(.*\))?!?:`)))
}
/* Attempts to associate non-conventional commits to the nearest conventional commit */
export const associateCommitsToConventionalCommitMessages = (commits) => {
  return commits.reduce((acc, curr) => {
    if (!acc.length) {
      return [
        {
          changelogMessage: curr.commitMessage,
          commitHashes: [curr.commitHash],
        },
      ]
    }
    if (isConventionalCommit(curr.commitMessage)) {
      if (isConventionalCommit(acc[acc.length - 1].changelogMessage)) {
        return [
          ...acc,
          {
            changelogMessage: curr.commitMessage,
            commitHashes: [curr.commitHash],
          },
        ]
      } else {
        return [
          ...acc.slice(0, acc.length - 1),
          {
            changelogMessage: curr.commitMessage,
            commitHashes: [...acc[acc.length - 1].commitHashes, curr.commitHash],
          },
        ]
      }
    } else {
      return [
        ...acc.slice(0, acc.length - 1),
        {
          ...acc[acc.length - 1],
          commitHashes: [...acc[acc.length - 1].commitHashes, curr.commitHash],
        },
      ]
    }
  }, [])
}
export const getFilesChangedSince = (opts) => {
  return execSync(`git diff --name-only ${opts.from}~1...${opts.to}`).toString().trim().split('\n')
}
export const getRepoRoot = () => {
  return execSync('git rev-parse --show-toplevel').toString().trim().replace(/\n|\r/g, '')
}
export const conventionalMessagesWithCommitsToChangesets = (conventionalMessagesToCommits, options) => {
  const { ignoredFiles = [], packages } = options
  return conventionalMessagesToCommits
    .map((entry) => {
      const filesChanged = getFilesChangedSince({
        from: entry.commitHashes[0],
        to: entry.commitHashes[entry.commitHashes.length - 1],
      }).filter((file) => {
        return ignoredFiles.every((ignoredPattern) => !file.match(ignoredPattern))
      })
      const packagesChanged = packages.filter((pkg) => {
        const pkgDir = `${pkg.dir.replace(`${getRepoRoot()}/`, '')}/`
        return filesChanged.some((file) => file.match(pkgDir))
      })
      console.log(
        `${entry.commitHashes[entry.commitHashes.length - 1]}  packagesChanged`,
        packagesChanged?.map((pkg) => pkg.packageJson.name),
      )
      if (packagesChanged.length === 0) {
        return null
      }
      return {
        releases: packagesChanged.map((pkg) => {
          return {
            name: pkg.packageJson.name,
            // Maybe add a mapping of commit types to semver levels so chore, refactor, test, etc. don't bump the version
            type: isBreakingChange(entry.changelogMessage) ? 'major' : entry.changelogMessage.startsWith('feat') ? 'minor' : 'patch',
          }
        }),
        summary: entry.changelogMessage,
        packagesChanged,
      }
    })
    .filter(Boolean)
}
export const gitFetch = (branch) => {
  execSync(`git fetch origin ${branch}`)
}
export const getCurrentBranch = () => {
  return execSync('git rev-parse --abbrev-ref HEAD').toString().trim().replace(/\n|\r/g, '')
}
// This could be running on the main branch or on a branch that was created from the main branch.
// If this is running on the main branch, we want to get all commits since the last release.
// If this is running on a branch that was created from the main branch, we want to get all commits since the branch was created.
export const getCommitsSinceRef = (branch) => {
  gitFetch(branch)
  const currentBranch = getCurrentBranch()
  let sinceRef = `origin/${branch}`
  if (currentBranch === branch) {
    try {
      sinceRef = execSync('git describe --tags --abbrev=0').toString().trim().replace(/\n|\r/g, '')
    } catch {
      console.log("No git tags found, using repo's first commit for automated change detection. Note: this may take a while.")
      sinceRef = execSync('git rev-list --max-parents=0 HEAD').toString().trim().replace(/\n|\r/g, '')
    }
  }
  return execSync(`git rev-list --ancestry-path ${sinceRef}...HEAD`).toString().split('\n').filter(Boolean).reverse()
}
const compareChangeSet = (a, b) => {
  return a.summary === b.summary && JSON.stringify(a.releases) == JSON.stringify(b.releases)
}
export const difference = (a, b) => {
  return a.filter((changeA) => !b.some((changeB) => compareChangeSet(changeA, changeB)))
}
const CHANGESET_CONFIG_LOCATION = path.join('.changeset', 'config.json')
const conventionalCommitChangeset = async (cwd = process.cwd(), options = { ignoredFiles: [] }) => {
  const packages = getPackagesSync(cwd).packages.filter((pkg) => !pkg.packageJson.private && Boolean(pkg.packageJson.version))
  const changesetConfig = JSON.parse(fs.readFileSync(path.join(cwd, CHANGESET_CONFIG_LOCATION)).toString())
  const { baseBranch = 'main' } = changesetConfig
  const commitsSinceBase = getCommitsSinceRef(baseBranch)
  const commitsWithMessages = commitsSinceBase.map((commitHash) => ({
    commitHash,
    commitMessage: execSync(`git log -n 1 --pretty=format:%s ${commitHash}`).toString(),
  }))
  const changelogMessagesWithAssociatedCommits = associateCommitsToConventionalCommitMessages(commitsWithMessages)
  const changesets = conventionalMessagesWithCommitsToChangesets(changelogMessagesWithAssociatedCommits, {
    ignoredFiles: options.ignoredFiles,
    packages,
  })
  const currentChangesets = await readChangeset(cwd)
  const newChangesets = currentChangesets.length === 0 ? changesets : difference(changesets, currentChangesets)
  newChangesets.map((changeset) => writeChangeset(changeset, cwd))
}
export const runChangesets = () => {
  conventionalCommitChangeset()
}
const run = () => {
  const program = new Command('changesets').action(() => runChangesets())
  program.parse()
}
run()
