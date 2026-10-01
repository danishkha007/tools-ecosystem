export interface CliTool {
  id: string;
  name: string;
  icon: string;           // SVG path data (d attribute content)
  accentColor: string;
  description: string;
  subcommands: Subcommand[];
}

export interface Subcommand {
  name: string;
  description: string;
  options: CommandOption[];
}

export interface CommandOption {
  flag: string;           // e.g. '--namespace'
  shortFlag?: string;     // e.g. '-n'
  label: string;          // UI display label
  type: 'toggle' | 'text' | 'select' | 'repeatable';
  placeholder?: string;
  choices?: string[];     // For 'select' type
  defaultValue?: string;
  required?: boolean;
  group?: string;         // For grouping related options in UI
}

export const CLI_TOOLS: CliTool[] = [
  {
    id: 'kubectl',
    name: 'kubectl',
    icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
    accentColor: '#326CE5',
    description: 'Kubernetes command-line tool',
    subcommands: [
      {
        name: 'get',
        description: 'Display one or many resources',
        options: [
          { flag: 'resource', label: 'Resource Type', type: 'select', choices: ['pods', 'services', 'deployments', 'nodes', 'namespaces', 'configmaps', 'secrets', 'ingress', 'pv', 'pvc', 'statefulsets', 'daemonsets', 'jobs', 'cronjobs'], required: true },
          { flag: '--namespace', shortFlag: '-n', label: 'Namespace', type: 'text', placeholder: 'default' },
          { flag: '--output', shortFlag: '-o', label: 'Output Format', type: 'select', choices: ['json', 'yaml', 'wide', 'name', 'custom-columns'] },
          { flag: '--selector', shortFlag: '-l', label: 'Label Selector', type: 'text' },
          { flag: '--field-selector', label: 'Field Selector', type: 'text' },
          { flag: '--all-namespaces', shortFlag: '-A', label: 'All Namespaces', type: 'toggle' },
          { flag: '--watch', shortFlag: '-w', label: 'Watch', type: 'toggle' },
          { flag: '--show-labels', label: 'Show Labels', type: 'toggle' }
        ]
      },
      {
        name: 'describe',
        description: 'Show details of a specific resource or group of resources',
        options: [
          { flag: 'resource', label: 'Resource Type', type: 'select', choices: ['pods', 'services', 'deployments', 'nodes', 'namespaces', 'configmaps', 'secrets', 'ingress', 'pv', 'pvc', 'statefulsets', 'daemonsets', 'jobs', 'cronjobs'], required: true },
          { flag: 'name', label: 'Resource Name', type: 'text', required: true },
          { flag: '--namespace', shortFlag: '-n', label: 'Namespace', type: 'text' }
        ]
      },
      {
        name: 'apply',
        description: 'Apply a configuration to a resource by file name or stdin',
        options: [
          { flag: '--filename', shortFlag: '-f', label: 'File Path', type: 'text', required: true },
          { flag: '--namespace', shortFlag: '-n', label: 'Namespace', type: 'text' },
          { flag: '--dry-run', label: 'Dry Run', type: 'select', choices: ['none', 'client', 'server'] },
          { flag: '--force', label: 'Force', type: 'toggle' },
          { flag: '--recursive', shortFlag: '-R', label: 'Recursive', type: 'toggle' }
        ]
      },
      {
        name: 'delete',
        description: 'Delete resources by file names, stdin, resources and names, or by resources and label selector',
        options: [
          { flag: 'resource', label: 'Resource Type', type: 'select', choices: ['pods', 'services', 'deployments', 'nodes', 'namespaces', 'configmaps', 'secrets', 'ingress', 'pv', 'pvc', 'statefulsets', 'daemonsets', 'jobs', 'cronjobs'] },
          { flag: 'name', label: 'Resource Name', type: 'text' },
          { flag: '--namespace', shortFlag: '-n', label: 'Namespace', type: 'text' },
          { flag: '--all', label: 'All', type: 'toggle' },
          { flag: '--force', label: 'Force', type: 'toggle' },
          { flag: '--grace-period', label: 'Grace Period', type: 'text' }
        ]
      },
      {
        name: 'logs',
        description: 'Print the logs for a container in a pod',
        options: [
          { flag: 'name', label: 'Pod Name', type: 'text', required: true },
          { flag: '--container', shortFlag: '-c', label: 'Container', type: 'text' },
          { flag: '--namespace', shortFlag: '-n', label: 'Namespace', type: 'text' },
          { flag: '--follow', shortFlag: '-f', label: 'Follow', type: 'toggle' },
          { flag: '--tail', label: 'Tail Lines', type: 'text' },
          { flag: '--previous', shortFlag: '-p', label: 'Previous', type: 'toggle' },
          { flag: '--timestamps', label: 'Timestamps', type: 'toggle' },
          { flag: '--since', label: 'Since', type: 'text' }
        ]
      },
      {
        name: 'exec',
        description: 'Execute a command in a container',
        options: [
          { flag: 'name', label: 'Pod Name', type: 'text', required: true },
          { flag: '--container', shortFlag: '-c', label: 'Container', type: 'text' },
          { flag: '--namespace', shortFlag: '-n', label: 'Namespace', type: 'text' },
          { flag: '-it', label: 'Interactive + TTY', type: 'toggle' },
          { flag: '--', label: 'Command', type: 'text', required: true }
        ]
      },
      {
        name: 'create',
        description: 'Create a resource from a file or from stdin',
        options: [
          { flag: 'resource', label: 'Resource Type', type: 'select', choices: ['deployment', 'service', 'namespace', 'configmap', 'secret', 'job', 'cronjob'], required: true },
          { flag: 'name', label: 'Name', type: 'text', required: true },
          { flag: '--image', label: 'Image', type: 'text' },
          { flag: '--namespace', shortFlag: '-n', label: 'Namespace', type: 'text' }
        ]
      },
      {
        name: 'scale',
        description: 'Set a new size for a deployment, replica set, or replication controller',
        options: [
          { flag: 'resource', label: 'Resource Type', type: 'select', choices: ['deployment', 'statefulset', 'replicaset'], required: true },
          { flag: 'name', label: 'Name', type: 'text', required: true },
          { flag: '--replicas', label: 'Replicas', type: 'text', required: true },
          { flag: '--namespace', shortFlag: '-n', label: 'Namespace', type: 'text' }
        ]
      },
      {
        name: 'rollout',
        description: 'Manage the rollout of a resource',
        options: [
          { flag: 'action', label: 'Action', type: 'select', choices: ['status', 'history', 'undo', 'restart', 'pause', 'resume'], required: true },
          { flag: 'resource', label: 'Resource Type', type: 'select', choices: ['deployment', 'statefulset', 'daemonset'], required: true },
          { flag: 'name', label: 'Name', type: 'text', required: true },
          { flag: '--namespace', shortFlag: '-n', label: 'Namespace', type: 'text' },
          { flag: '--to-revision', label: 'To Revision', type: 'text' }
        ]
      },
      {
        name: 'port-forward',
        description: 'Forward one or more local ports to a pod',
        options: [
          { flag: 'resource', label: 'Resource', type: 'text', required: true },
          { flag: 'ports', label: 'Ports', type: 'text', required: true },
          { flag: '--namespace', shortFlag: '-n', label: 'Namespace', type: 'text' },
          { flag: '--address', label: 'Address', type: 'text' }
        ]
      }
    ]
  },
  {
    id: 'docker',
    name: 'Docker',
    icon: 'M22.5 12.5h-2.5v-1.25h2.5v1.25zm-3.75 0h-2.5v-1.25h2.5v1.25zm-3.75 0h-2.5v-1.25h2.5v1.25zm-3.75 0h-2.5v-1.25h2.5v1.25zm-3.75 0h-2.5v-1.25h2.5v1.25z',
    accentColor: '#2496ED',
    description: 'Docker container platform',
    subcommands: [
      {
        name: 'run',
        description: 'Run a command in a new container',
        options: [
          { flag: 'image', label: 'Image', type: 'text', required: true },
          { flag: '--name', label: 'Name', type: 'text' },
          { flag: '--publish', shortFlag: '-p', label: 'Ports', type: 'repeatable', placeholder: '8080:80' },
          { flag: '--volume', shortFlag: '-v', label: 'Volumes', type: 'repeatable', placeholder: '/host:/container' },
          { flag: '--env', shortFlag: '-e', label: 'Env Vars', type: 'repeatable', placeholder: 'KEY=VALUE' },
          { flag: '--detach', shortFlag: '-d', label: 'Detach', type: 'toggle' },
          { flag: '-it', label: 'Interactive + TTY', type: 'toggle' },
          { flag: '--rm', label: 'Rm After Exit', type: 'toggle' },
          { flag: '--network', label: 'Network', type: 'text' },
          { flag: '--restart', label: 'Restart Policy', type: 'select', choices: ['no', 'always', 'on-failure', 'unless-stopped'] },
          { flag: '--memory', shortFlag: '-m', label: 'Memory Limit', type: 'text' },
          { flag: '--cpus', label: 'CPU Limit', type: 'text' },
          { flag: '--entrypoint', label: 'Entrypoint', type: 'text' },
          { flag: 'command', label: 'Command', type: 'text' }
        ]
      },
      {
        name: 'build',
        description: 'Build an image from a Dockerfile',
        options: [
          { flag: 'path', label: 'Path/Context', type: 'text', required: true },
          { flag: '--tag', shortFlag: '-t', label: 'Tag', type: 'text' },
          { flag: '--file', shortFlag: '-f', label: 'File', type: 'text' },
          { flag: '--no-cache', label: 'No Cache', type: 'toggle' },
          { flag: '--pull', label: 'Pull', type: 'toggle' },
          { flag: '--build-arg', label: 'Build Arg', type: 'repeatable' },
          { flag: '--target', label: 'Target', type: 'text' },
          { flag: '--platform', label: 'Platform', type: 'text' }
        ]
      },
      {
        name: 'pull',
        description: 'Pull an image or a repository from a registry',
        options: [
          { flag: 'image', label: 'Image', type: 'text', required: true },
          { flag: '--platform', label: 'Platform', type: 'text' },
          { flag: '--all-tags', shortFlag: '-a', label: 'All Tags', type: 'toggle' }
        ]
      },
      {
        name: 'push',
        description: 'Push an image or a repository to a registry',
        options: [
          { flag: 'image', label: 'Image', type: 'text', required: true },
          { flag: '--all-tags', shortFlag: '-a', label: 'All Tags', type: 'toggle' }
        ]
      },
      {
        name: 'exec',
        description: 'Run a command in a running container',
        options: [
          { flag: 'container', label: 'Container', type: 'text', required: true },
          { flag: '-it', label: 'Interactive + TTY', type: 'toggle' },
          { flag: '--detach', shortFlag: '-d', label: 'Detach', type: 'toggle' },
          { flag: '--user', shortFlag: '-u', label: 'User', type: 'text' },
          { flag: '--workdir', shortFlag: '-w', label: 'Workdir', type: 'text' },
          { flag: '--env', shortFlag: '-e', label: 'Env', type: 'repeatable' },
          { flag: 'command', label: 'Command', type: 'text', required: true }
        ]
      },
      {
        name: 'stop',
        description: 'Stop one or more running containers',
        options: [
          { flag: 'container', label: 'Container', type: 'text', required: true },
          { flag: '--time', shortFlag: '-t', label: 'Time/Timeout', type: 'text' }
        ]
      },
      {
        name: 'rm',
        description: 'Remove one or more containers',
        options: [
          { flag: 'container', label: 'Container', type: 'text', required: true },
          { flag: '--force', shortFlag: '-f', label: 'Force', type: 'toggle' },
          { flag: '--volumes', shortFlag: '-v', label: 'Volumes', type: 'toggle' }
        ]
      },
      {
        name: 'images',
        description: 'List images',
        options: [
          { flag: 'repository', label: 'Repository', type: 'text' },
          { flag: '--all', shortFlag: '-a', label: 'All', type: 'toggle' },
          { flag: '--filter', shortFlag: '-f', label: 'Filter', type: 'text' },
          { flag: '--format', label: 'Format', type: 'text' },
          { flag: '--quiet', shortFlag: '-q', label: 'Quiet', type: 'toggle' }
        ]
      },
      {
        name: 'ps',
        description: 'List containers',
        options: [
          { flag: '--all', shortFlag: '-a', label: 'All', type: 'toggle' },
          { flag: '--filter', shortFlag: '-f', label: 'Filter', type: 'text' },
          { flag: '--format', label: 'Format', type: 'text' },
          { flag: '--quiet', shortFlag: '-q', label: 'Quiet', type: 'toggle' },
          { flag: '--last', shortFlag: '-n', label: 'Last', type: 'text' }
        ]
      },
      {
        name: 'compose',
        description: 'Define and run multi-container applications with Docker',
        options: [
          { flag: 'action', label: 'Action', type: 'select', choices: ['up', 'down', 'build', 'logs', 'ps', 'restart', 'stop', 'pull'], required: true },
          { flag: '--file', shortFlag: '-f', label: 'File', type: 'text' },
          { flag: '--detach', shortFlag: '-d', label: 'Detach (for up)', type: 'toggle' },
          { flag: '--build', label: 'Build (for up)', type: 'toggle' },
          { flag: '--force-recreate', label: 'Force Recreate (for up)', type: 'toggle' },
          { flag: '--follow', shortFlag: '-f', label: 'Follow (for logs)', type: 'toggle' },
          { flag: '--tail', label: 'Tail (for logs)', type: 'text' },
          { flag: 'service', label: 'Service', type: 'text' }
        ]
      }
    ]
  },
  {
    id: 'git',
    name: 'Git',
    icon: 'M15.5 4.5l-4.5 4.5 4.5 4.5 4.5-4.5-4.5-4.5zm-5.5 5.5l-4.5 4.5 4.5 4.5 4.5-4.5-4.5-4.5z',
    accentColor: '#F05032',
    description: 'Distributed version control system',
    subcommands: [
      {
        name: 'clone',
        description: 'Clone a repository into a new directory',
        options: [
          { flag: 'url', label: 'Repository URL', type: 'text', required: true },
          { flag: 'directory', label: 'Directory', type: 'text' },
          { flag: '--branch', shortFlag: '-b', label: 'Branch', type: 'text' },
          { flag: '--depth', label: 'Depth', type: 'text' },
          { flag: '--recursive', label: 'Recursive', type: 'toggle' },
          { flag: '--bare', label: 'Bare', type: 'toggle' }
        ]
      },
      {
        name: 'commit',
        description: 'Record changes to the repository',
        options: [
          { flag: '--message', shortFlag: '-m', label: 'Message', type: 'text', required: true },
          { flag: '--all', shortFlag: '-a', label: 'All Staged', type: 'toggle' },
          { flag: '--amend', label: 'Amend', type: 'toggle' },
          { flag: '--no-edit', label: 'No Edit', type: 'toggle' },
          { flag: '--allow-empty', label: 'Allow Empty', type: 'toggle' },
          { flag: '--gpg-sign', shortFlag: '-S', label: 'Sign', type: 'toggle' }
        ]
      },
      {
        name: 'push',
        description: 'Update remote refs along with associated objects',
        options: [
          { flag: 'remote', label: 'Remote', type: 'text', defaultValue: 'origin' },
          { flag: 'branch', label: 'Branch', type: 'text' },
          { flag: '--force', shortFlag: '-f', label: 'Force', type: 'toggle' },
          { flag: '--force-with-lease', label: 'Force With Lease', type: 'toggle' },
          { flag: '--tags', label: 'Tags', type: 'toggle' },
          { flag: '--set-upstream', shortFlag: '-u', label: 'Set Upstream', type: 'toggle' },
          { flag: '--delete', shortFlag: '-d', label: 'Delete', type: 'toggle' },
          { flag: '--dry-run', label: 'Dry Run', type: 'toggle' }
        ]
      },
      {
        name: 'pull',
        description: 'Fetch from and integrate with another repository or a local branch',
        options: [
          { flag: 'remote', label: 'Remote', type: 'text' },
          { flag: 'branch', label: 'Branch', type: 'text' },
          { flag: '--rebase', label: 'Rebase', type: 'toggle' },
          { flag: '--no-rebase', label: 'No Rebase', type: 'toggle' },
          { flag: '--ff-only', label: 'FF Only', type: 'toggle' },
          { flag: '--no-ff', label: 'No FF', type: 'toggle' },
          { flag: '--autostash', label: 'Autostash', type: 'toggle' }
        ]
      },
      {
        name: 'branch',
        description: 'List, create, or delete branches',
        options: [
          { flag: 'branchname', label: 'Branch Name', type: 'text' },
          { flag: '--delete', shortFlag: '-d', label: 'Delete', type: 'toggle' },
          { flag: '--D', shortFlag: '-D', label: 'Force Delete', type: 'toggle' },
          { flag: '--all', shortFlag: '-a', label: 'List All', type: 'toggle' },
          { flag: '--remotes', shortFlag: '-r', label: 'Remote', type: 'toggle' },
          { flag: '--verbose', shortFlag: '-v', label: 'Verbose', type: 'toggle' },
          { flag: '--move', shortFlag: '-m', label: 'Move/Rename', type: 'text' },
          { flag: '--copy', shortFlag: '-c', label: 'Copy', type: 'text' }
        ]
      },
      {
        name: 'merge',
        description: 'Join two or more development histories together',
        options: [
          { flag: 'branch', label: 'Branch', type: 'text', required: true },
          { flag: '--no-ff', label: 'No FF', type: 'toggle' },
          { flag: '--squash', label: 'Squash', type: 'toggle' },
          { flag: '--abort', label: 'Abort', type: 'toggle' },
          { flag: '--message', shortFlag: '-m', label: 'Message', type: 'text' },
          { flag: '--strategy', shortFlag: '-s', label: 'Strategy', type: 'select', choices: ['recursive', 'ours', 'theirs', 'octopus'] }
        ]
      },
      {
        name: 'rebase',
        description: 'Reapply commits on top of another base tip',
        options: [
          { flag: 'branch', label: 'Branch', type: 'text' },
          { flag: '--interactive', shortFlag: '-i', label: 'Interactive', type: 'toggle' },
          { flag: '--onto', label: 'Onto', type: 'text' },
          { flag: '--abort', label: 'Abort', type: 'toggle' },
          { flag: '--continue', label: 'Continue', type: 'toggle' },
          { flag: '--skip', label: 'Skip', type: 'toggle' },
          { flag: '--autosquash', label: 'Autosquash', type: 'toggle' }
        ]
      },
      {
        name: 'stash',
        description: 'Stash the changes in a dirty working directory away',
        options: [
          { flag: 'action', label: 'Action', type: 'select', choices: ['push', 'pop', 'apply', 'list', 'drop', 'show', 'clear'] },
          { flag: '--message', shortFlag: '-m', label: 'Message (for push)', type: 'text' },
          { flag: '--include-untracked', shortFlag: '-u', label: 'Include Untracked', type: 'toggle' },
          { flag: '--keep-index', label: 'Keep Index', type: 'toggle' },
          { flag: 'index', label: 'Index (for pop/apply/drop)', type: 'text' }
        ]
      },
      {
        name: 'log',
        description: 'Show commit logs',
        options: [
          { flag: '-n', label: 'Number of Commits', type: 'text' },
          { flag: '--oneline', label: 'Oneline', type: 'toggle' },
          { flag: '--graph', label: 'Graph', type: 'toggle' },
          { flag: '--all', label: 'All', type: 'toggle' },
          { flag: '--author', label: 'Author', type: 'text' },
          { flag: '--since', label: 'Since', type: 'text' },
          { flag: '--until', label: 'Until', type: 'text' },
          { flag: '--grep', label: 'Grep', type: 'text' },
          { flag: '--format', label: 'Format', type: 'text' },
          { flag: '--stat', label: 'Stat', type: 'toggle' },
          { flag: '--patch', shortFlag: '-p', label: 'Patch', type: 'toggle' }
        ]
      },
      {
        name: 'checkout',
        description: 'Switch branches or restore working tree files',
        options: [
          { flag: 'target', label: 'Branch/Commit', type: 'text', required: true },
          { flag: '-b', label: 'Create New Branch', type: 'toggle' },
          { flag: '--force', shortFlag: '-f', label: 'Force', type: 'toggle' },
          { flag: '--track', shortFlag: '-t', label: 'Track', type: 'toggle' }
        ]
      },
      {
        name: 'reset',
        description: 'Reset current HEAD to the specified state',
        options: [
          { flag: 'commit', label: 'Commit/Ref', type: 'text' },
          { flag: 'mode', label: 'Mode', type: 'select', choices: ['--soft', '--mixed', '--hard'] },
          { flag: 'file', label: 'File', type: 'text' }
        ]
      },
      {
        name: 'diff',
        description: 'Show changes between commits, commit and working tree, etc',
        options: [
          { flag: 'target', label: 'File or Ref', type: 'text' },
          { flag: '--staged', label: 'Staged', type: 'toggle' },
          { flag: '--stat', label: 'Stat', type: 'toggle' },
          { flag: '--name-only', label: 'Name Only', type: 'toggle' },
          { flag: '--color', label: 'Color', type: 'toggle' }
        ]
      },
      {
        name: 'tag',
        description: 'Create, list, delete or verify a tag object signed with GPG',
        options: [
          { flag: 'tagname', label: 'Tag Name', type: 'text' },
          { flag: '--message', shortFlag: '-m', label: 'Message', type: 'text' },
          { flag: '--annotate', shortFlag: '-a', label: 'Annotated', type: 'toggle' },
          { flag: '--delete', shortFlag: '-d', label: 'Delete', type: 'toggle' },
          { flag: '--list', shortFlag: '-l', label: 'List', type: 'toggle' },
          { flag: '--force', shortFlag: '-f', label: 'Force', type: 'toggle' }
        ]
      },
      {
        name: 'remote',
        description: 'Manage set of tracked repositories',
        options: [
          { flag: 'action', label: 'Action', type: 'select', choices: ['add', 'remove', 'show', 'rename', 'get-url', 'set-url'] },
          { flag: 'name', label: 'Name', type: 'text' },
          { flag: 'url', label: 'URL', type: 'text' }
        ]
      },
      {
        name: 'cherry-pick',
        description: 'Apply the changes introduced by some existing commits',
        options: [
          { flag: 'commit', label: 'Commit', type: 'text', required: true },
          { flag: '--no-commit', shortFlag: '-n', label: 'No Commit', type: 'toggle' },
          { flag: '--edit', shortFlag: '-e', label: 'Edit', type: 'toggle' },
          { flag: '--signoff', shortFlag: '-s', label: 'Signoff', type: 'toggle' },
          { flag: '--abort', label: 'Abort', type: 'toggle' },
          { flag: '--continue', label: 'Continue', type: 'toggle' }
        ]
      }
    ]
  },
  {
    id: 'npm',
    name: 'npm',
    icon: 'M0 0v24h24v-24h-24zm20.8 17.6h-3.2v-8h-3.2v8h-11.2v-11.2h17.6v11.2z',
    accentColor: '#CB3837',
    description: 'Node package manager',
    subcommands: [
      {
        name: 'install',
        description: 'Install a package and any packages that it depends on',
        options: [
          { flag: 'package', label: 'Package Name', type: 'text' },
          { flag: '--global', shortFlag: '-g', label: 'Global', type: 'toggle' },
          { flag: '--save-dev', shortFlag: '-D', label: 'Save Dev', type: 'toggle' },
          { flag: '--save-exact', shortFlag: '-E', label: 'Save Exact', type: 'toggle' },
          { flag: '--save-optional', shortFlag: '-O', label: 'Save Optional', type: 'toggle' },
          { flag: '--legacy-peer-deps', label: 'Legacy Peer Deps', type: 'toggle' },
          { flag: '--force', label: 'Force', type: 'toggle' },
          { flag: '--dry-run', label: 'Dry Run', type: 'toggle' },
          { flag: '--no-save', label: 'No Save', type: 'toggle' }
        ]
      },
      {
        name: 'uninstall',
        description: 'Remove a package',
        options: [
          { flag: 'package', label: 'Package Name', type: 'text', required: true },
          { flag: '--global', shortFlag: '-g', label: 'Global', type: 'toggle' },
          { flag: '--save-dev', shortFlag: '-D', label: 'Save Dev', type: 'toggle' }
        ]
      },
      {
        name: 'run',
        description: 'Run arbitrary package scripts',
        options: [
          { flag: 'script', label: 'Script Name', type: 'text', required: true },
          { flag: '--if-present', label: 'If Present', type: 'toggle' },
          { flag: '--silent', label: 'Silent', type: 'toggle' }
        ]
      },
      {
        name: 'init',
        description: 'Create a package.json file',
        options: [
          { flag: '--scope', label: 'Scope', type: 'text' },
          { flag: '--yes', shortFlag: '-y', label: 'Yes', type: 'toggle' },
          { flag: '--force', label: 'Force', type: 'toggle' }
        ]
      },
      {
        name: 'publish',
        description: 'Publish a package',
        options: [
          { flag: '--tag', label: 'Tag', type: 'text' },
          { flag: '--access', label: 'Access', type: 'select', choices: ['public', 'restricted'] },
          { flag: '--dry-run', label: 'Dry Run', type: 'toggle' },
          { flag: '--otp', label: 'OTP', type: 'text' }
        ]
      },
      {
        name: 'audit',
        description: 'Run a security audit',
        options: [
          { flag: '--audit-level', label: 'Level', type: 'select', choices: ['info', 'low', 'moderate', 'high', 'critical'] },
          { flag: '--fix', label: 'Fix', type: 'toggle' },
          { flag: '--force', label: 'Force', type: 'toggle' },
          { flag: '--dry-run', label: 'Dry Run', type: 'toggle' },
          { flag: '--json', label: 'JSON', type: 'toggle' },
          { flag: '--production', label: 'Production', type: 'toggle' }
        ]
      },
      {
        name: 'update',
        description: 'Update packages',
        options: [
          { flag: 'package', label: 'Package Name', type: 'text' },
          { flag: '--global', shortFlag: '-g', label: 'Global', type: 'toggle' },
          { flag: '--save', label: 'Save', type: 'toggle' },
          { flag: '--dry-run', label: 'Dry Run', type: 'toggle' }
        ]
      },
      {
        name: 'list',
        description: 'List installed packages',
        options: [
          { flag: '--global', shortFlag: '-g', label: 'Global', type: 'toggle' },
          { flag: '--depth', label: 'Depth', type: 'text' },
          { flag: '--json', label: 'JSON', type: 'toggle' },
          { flag: '--long', label: 'Long', type: 'toggle' },
          { flag: '--all', label: 'All', type: 'toggle' },
          { flag: '--production', label: 'Production', type: 'toggle' }
        ]
      },
      {
        name: 'outdated',
        description: 'Check for outdated packages',
        options: [
          { flag: '--global', shortFlag: '-g', label: 'Global', type: 'toggle' },
          { flag: '--json', label: 'JSON', type: 'toggle' },
          { flag: '--long', label: 'Long', type: 'toggle' },
          { flag: '--all', label: 'All', type: 'toggle' }
        ]
      },
      {
        name: 'cache',
        description: 'Manipulates packages cache',
        options: [
          { flag: 'action', label: 'Action', type: 'select', choices: ['clean', 'verify', 'ls'] },
          { flag: '--force', label: 'Force (for clean)', type: 'toggle' }
        ]
      },
      {
        name: 'config',
        description: 'Manage the npm configuration files',
        options: [
          { flag: 'action', label: 'Action', type: 'select', choices: ['set', 'get', 'delete', 'list', 'edit'] },
          { flag: 'key', label: 'Key', type: 'text' },
          { flag: 'value', label: 'Value', type: 'text' },
          { flag: '--global', shortFlag: '-g', label: 'Global', type: 'toggle' }
        ]
      }
    ]
  },
  {
    id: 'yarn',
    name: 'yarn',
    icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z',
    accentColor: '#2C8EBB',
    description: 'Fast, reliable, and secure dependency management',
    subcommands: [
      {
        name: 'add',
        description: 'Installs a package and any packages that it depends on',
        options: [
          { flag: 'package', label: 'Package Name', type: 'text', required: true },
          { flag: '--dev', shortFlag: '-D', label: 'Dev', type: 'toggle' },
          { flag: '--peer', shortFlag: '-P', label: 'Peer', type: 'toggle' },
          { flag: '--optional', shortFlag: '-O', label: 'Optional', type: 'toggle' },
          { flag: '--exact', shortFlag: '-E', label: 'Exact', type: 'toggle' },
          { flag: '--tilde', shortFlag: '-T', label: 'Tilde', type: 'toggle' }
        ]
      },
      {
        name: 'remove',
        description: 'Remove a package',
        options: [
          { flag: 'package', label: 'Package Name', type: 'text', required: true }
        ]
      },
      {
        name: 'run',
        description: 'Run a defined package script',
        options: [
          { flag: 'script', label: 'Script Name', type: 'text', required: true },
          { flag: '--silent', label: 'Silent', type: 'toggle' }
        ]
      },
      {
        name: 'init',
        description: 'Initialize for the development of a package',
        options: [
          { flag: '--yes', shortFlag: '-y', label: 'Yes', type: 'toggle' },
          { flag: '--private', shortFlag: '-p', label: 'Private', type: 'toggle' }
        ]
      },
      {
        name: 'upgrade',
        description: 'Upgrades packages to their latest version based on the specified range',
        options: [
          { flag: 'package', label: 'Package Name', type: 'text' },
          { flag: '--latest', shortFlag: '-L', label: 'Latest', type: 'toggle' },
          { flag: '--scope', label: 'Scope', type: 'text' },
          { flag: '--pattern', label: 'Pattern', type: 'text' }
        ]
      },
      {
        name: 'info',
        description: 'Show information about a package',
        options: [
          { flag: 'package', label: 'Package Name', type: 'text', required: true },
          { flag: 'field', label: 'Field', type: 'text' },
          { flag: '--json', label: 'JSON', type: 'toggle' }
        ]
      },
      {
        name: 'why',
        description: 'Show information about why a package is installed',
        options: [
          { flag: 'package', label: 'Package Name', type: 'text', required: true }
        ]
      },
      {
        name: 'cache',
        description: 'Clear the local cache',
        options: [
          { flag: 'action', label: 'Action', type: 'select', choices: ['clean', 'dir', 'list'] }
        ]
      },
      {
        name: 'global',
        description: 'Install packages globally on your operating system',
        options: [
          { flag: 'action', label: 'Action', type: 'select', choices: ['add', 'remove', 'list', 'upgrade'] },
          { flag: 'package', label: 'Package Name', type: 'text' }
        ]
      }
    ]
  },
  {
    id: 'python',
    name: 'Python',
    icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z',
    accentColor: '#3776AB',
    description: 'Python programming language',
    subcommands: [
      {
        name: 'run',
        description: 'Run a python script or module',
        options: [
          { flag: 'script', label: 'Script File', type: 'text', required: true },
          { flag: '-m', label: 'Module Mode', type: 'toggle' },
          { flag: '-c', label: 'Command String', type: 'text' },
          { flag: '-i', label: 'Interactive', type: 'toggle' },
          { flag: '-O', label: 'Optimize', type: 'toggle' },
          { flag: '-v', label: 'Verbose', type: 'toggle' },
          { flag: '-V', label: 'Version', type: 'toggle' },
          { flag: '-u', label: 'Unbuffered', type: 'toggle' },
          { flag: '-W', label: 'Warning Control', type: 'select', choices: ['default', 'error', 'ignore', 'always', 'module', 'once'] }
        ]
      },
      {
        name: 'pip install',
        description: 'Install packages via pip',
        options: [
          { flag: 'package', label: 'Package', type: 'text' },
          { flag: '-r', label: 'Requirements File', type: 'text' },
          { flag: '-U', label: 'Upgrade', type: 'toggle' },
          { flag: '--user', label: 'User', type: 'toggle' },
          { flag: '-e', label: 'Editable', type: 'toggle' },
          { flag: '--no-deps', label: 'No Deps', type: 'toggle' },
          { flag: '--pre', label: 'Pre', type: 'toggle' },
          { flag: '-t', label: 'Target', type: 'text' },
          { flag: '--index-url', label: 'Index URL', type: 'text' }
        ]
      },
      {
        name: 'pip uninstall',
        description: 'Uninstall packages via pip',
        options: [
          { flag: 'package', label: 'Package', type: 'text', required: true },
          { flag: '-y', label: 'Yes', type: 'toggle' },
          { flag: '-r', label: 'Requirement', type: 'text' }
        ]
      },
      {
        name: 'pip freeze',
        description: 'Output installed packages in requirements format',
        options: [
          { flag: '-l', label: 'Local', type: 'toggle' },
          { flag: '--all', label: 'All', type: 'toggle' },
          { flag: '--exclude-editable', label: 'Exclude Editable', type: 'toggle' },
          { flag: '--format', label: 'Format', type: 'select', choices: ['freeze', 'columns', 'json'] }
        ]
      },
      {
        name: 'venv',
        description: 'Create virtual environments',
        options: [
          { flag: 'dir', label: 'Directory', type: 'text', required: true },
          { flag: '--system-site-packages', label: 'System Site Packages', type: 'toggle' },
          { flag: '--clear', label: 'Clear', type: 'toggle' },
          { flag: '--without-pip', label: 'Without Pip', type: 'toggle' },
          { flag: '--prompt', label: 'Prompt', type: 'text' }
        ]
      },
      {
        name: 'pytest',
        description: 'Run python tests using pytest',
        options: [
          { flag: 'path', label: 'Path', type: 'text' },
          { flag: '-k', label: 'Keyword', type: 'text' },
          { flag: '-m', label: 'Marker', type: 'text' },
          { flag: '-v', label: 'Verbose', type: 'toggle' },
          { flag: '-q', label: 'Quiet', type: 'toggle' },
          { flag: '-x', label: 'Exitfirst', type: 'toggle' },
          { flag: '--maxfail', label: 'Maxfail', type: 'text' },
          { flag: '--capture', label: 'Capture', type: 'select', choices: ['fd', 'sys', 'no', 'tee-sys'] },
          { flag: '--pdb', label: 'Pdb', type: 'toggle' },
          { flag: '--cov', label: 'Cov', type: 'text' },
          { flag: '--cov-report', label: 'Cov Report', type: 'select', choices: ['term', 'html', 'xml', 'json'] },
          { flag: '-n', label: 'Parallel', type: 'toggle' },
          { flag: '--lf', label: 'Last Failed', type: 'toggle' },
          { flag: '--ff', label: 'Failed First', type: 'toggle' }
        ]
      },
      {
        name: 'flask run',
        description: 'Run a local development server',
        options: [
          { flag: '--host', label: 'Host', type: 'text' },
          { flag: '--port', label: 'Port', type: 'text' },
          { flag: '--debug', label: 'Debug', type: 'toggle' },
          { flag: '--reload', label: 'Reload', type: 'toggle' },
          { flag: '--no-reload', label: 'No Reload', type: 'toggle' }
        ]
      },
      {
        name: 'django manage',
        description: 'Django management commands',
        options: [
          { flag: 'subcommand', label: 'Subcommand', type: 'select', choices: ['runserver', 'migrate', 'makemigrations', 'shell', 'createsuperuser', 'collectstatic', 'test', 'startapp'] },
          { flag: 'argument', label: 'Argument', type: 'text' },
          { flag: '--settings', label: 'Settings', type: 'text' },
          { flag: '-v', label: 'Verbosity', type: 'select', choices: ['0', '1', '2', '3'] },
          { flag: '--no-input', label: 'No Input', type: 'toggle' }
        ]
      }
    ]
  }
];
