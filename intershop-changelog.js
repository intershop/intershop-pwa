'use strict';
var fs = require('fs');
var path = require('path');

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

      // remove references that already appear in the subject
      var issues = [];
      diff.references = commit.references.filter(reference => issues.indexOf(reference.issue) === -1);

      return Object.assign({}, commit, diff);
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
    mainTemplate: fs.readFileSync(path.resolve(__dirname, 'templates/template.hbs'), 'utf-8'),
    headerPartial: fs.readFileSync(path.resolve(__dirname, 'templates/header.hbs'), 'utf-8'),
    commitPartial: fs.readFileSync(path.resolve(__dirname, 'templates/commit.hbs'), 'utf-8'),
    footerPartial: fs.readFileSync(path.resolve(__dirname, 'templates/footer.hbs'), 'utf-8'),
  },
};
