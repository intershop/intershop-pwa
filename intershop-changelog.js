'use strict';

module.exports = {
  parser: {
    headerPattern: /^(\w*)(?:\((.*)\))?: (.*)$/,
    headerCorrespondence: ['type', 'scope', 'subject'],
    noteKeywords: ['BREAKING CHANGE', 'BREAKING CHANGES'],
    revertPattern: /^revert:\s([\s\S]*?)\s*This reverts commit (\w*)\./,
    revertCorrespondence: ['header', 'hash'],
  },
  writer: {
    transform: function (commit) {
      var noBreakingChanges = true;
      var diff = {};

      if (commit.notes && commit.notes.length > 0) {
        diff.notes = commit.notes.map(note => Object.assign({}, note, { title: 'BREAKING CHANGES' }));
        noBreakingChanges = false;
      }

      if (commit.type === 'feat') {
        diff.type = 'Features';
      } else if (commit.type === 'fix') {
        diff.type = 'Bug Fixes';
      } else if (commit.type === 'perf') {
        diff.type = 'Performance Improvements';
      } else if (commit.type === 'docs') {
        diff.type = 'Documentation';
      } else if (commit.type === 'deps') {
        diff.type = 'Dependencies';
      } else if (noBreakingChanges) {
        return null;
      } else if (commit.type === 'refactor') {
        diff.type = 'Code Refactoring';
      } else if (commit.type === 'style') {
        diff.type = 'Styles';
      } else if (commit.type === 'test') {
        diff.type = 'Tests';
      } else if (commit.type === 'revert') {
        diff.type = 'Reverts';
      } else if (commit.type === 'chore') {
        diff.type = 'Chores';
      }

      if (commit.scope === '*') {
        diff.scope = '';
      }

      if (typeof commit.hash === 'string') {
        diff.hash = commit.hash.substring(0, 7);
      }

      var issues = [];
      diff.references = commit.references.filter(reference => issues.indexOf(reference.issue) === -1);

      return diff;
    },
    groupBy: 'type',
    commitGroupsSort: function (arg1, arg2) {
      var order = [
        'Features',
        'Bug Fixes',
        'Performance Improvements',
        'Documentation',
        'Dependencies',
        'Code Refactoring',
        'Styles',
        'Tests',
        'Reverts',
        'Chores',
      ];
      if (order.indexOf(arg1.title) < order.indexOf(arg2.title)) {
        return -1;
      }
      if (order.indexOf(arg1.title) > order.indexOf(arg2.title)) {
        return 1;
      }
      return 0;
    },
    commitsSort: ['scope'],
    noteGroupsSort: 'title',
    notesSort: 'text',
    headerPartial: function (context) {
      return `## [${context.version}](${context.host}/${context.owner}/${context.repository}/releases/tag/${context.version}) (${context.date})`;
    },
    commitPartial: function (context, commit) {
      var repoUrl = context.repository
        ? [context.host, context.owner, context.repository].filter(Boolean).join('/')
        : context.repoUrl || '';
      var commitPath = context.commit || 'commit';
      var scope = commit.scope ? `**${commit.scope}:** ` : '';
      var subject = commit.subject || commit.header || '';
      var hashRef = '';
      if (commit.hash) {
        hashRef = context.linkReferences
          ? ` ([${commit.hash}](${repoUrl}/${commitPath}/${commit.hash}))`
          : ` ${commit.hash}`;
      }
      return `${scope}${subject}${hashRef}`;
    },
    footerPartial: function (context) {
      var result = '';
      if (context?.noteGroups?.length) {
        context.noteGroups.forEach(group => {
          result += `\n### ${group.title}\n\n`;
          group.notes.forEach(note => {
            result += `- ${note.commit?.scope ? `**${note.commit.scope}:** ` : ''}${note.text}\n`;
          });
        });
      }
      return result;
    },
    template: function (context) {
      var { headerPartial, commitPartial, footerPartial } = context;
      var commitGroups = context.commitGroups || [];
      var result = headerPartial(context) + '\n';
      commitGroups.forEach(group => {
        if (group.title) {
          result += '\n### ' + group.title + '\n\n';
        }
        group.commits.forEach(commit => {
          result += '- ' + commitPartial(context, commit) + '\n';
        });
      });
      result += footerPartial(context);
      result += '\n';
      return result;
    },
  },
};
