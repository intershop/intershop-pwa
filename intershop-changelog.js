'use strict';
var compareFunc = require('compare-func');
var Q = require('q');
var readFile = Q.denodeify(require('fs').readFile);
var resolve = require('path').resolve;
var path = require('path');
var pkgJson = {};
try {
  pkgJson = require(path.resolve(process.cwd(), './package.json'));
} catch (err) {
  console.error('no root package.json found');
}

var parserOpts = {
  headerPattern: /^(\w*)(?:\((.*)\))?\: (.*)$/,
  headerCorrespondence: ['type', 'scope', 'subject'],
  noteKeywords: ['BREAKING CHANGE', 'BREAKING CHANGES'],
  revertPattern: /^revert:\s([\s\S]*?)\s*This reverts commit (\w*)\./,
  revertCorrespondence: ['header', 'hash'],
};

var writerOpts = {
  transform: function (commit) {
    var discard = true;
    var issues = [];

    commit.notes.forEach(function (note) {
      note.title = 'BREAKING CHANGES';
      discard = false;
    });

    if (commit.type === 'feat') {
      commit.type = 'Features';
    } else if (commit.type === 'fix') {
      commit.type = 'Bug Fixes';
    } else if (commit.type === 'perf') {
      commit.type = 'Performance Improvements';
    } else if (commit.type === 'docs') {
      commit.type = 'Documentation';
    } else if (discard) {
      return;
    } else if (commit.type === 'style') {
      commit.type = 'Styles';
    } else if (commit.type === 'refactor') {
      commit.type = 'Code Refactoring';
    } else if (commit.type === 'revert') {
      commit.type = 'Reverts';
    } else if (commit.type === 'test') {
      commit.type = 'Tests';
    } else if (commit.type === 'chore') {
      commit.type = 'Chores';
    }

    if (commit.scope === '*') {
      commit.scope = '';
    }

    if (typeof commit.hash === 'string') {
      commit.hash = commit.hash.substring(0, 7);
    }

    // remove references that already appear in the subject
    commit.references = commit.references.filter(function (reference) {
      if (issues.indexOf(reference.issue) === -1) {
        return true;
      }

      return false;
    });

    return commit;
  },
  groupBy: 'type',
  commitGroupsSort: function (arg1, arg2) {
    var order = ['Features', 'Bug Fixes', 'Performance Improvements', 'Documentation', 'Code Refactoring'];
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
  notesSort: compareFunc,
};

module.exports = Q.all([
  readFile(resolve(__dirname, 'templates/template.hbs'), 'utf-8'),
  readFile(resolve(__dirname, 'templates/header.hbs'), 'utf-8'),
  readFile(resolve(__dirname, 'templates/commit.hbs'), 'utf-8'),
  readFile(resolve(__dirname, 'templates/footer.hbs'), 'utf-8'),
]).spread(function (template, header, commit, footer) {
  writerOpts.mainTemplate = template;
  writerOpts.headerPartial = header;
  writerOpts.commitPartial = commit;
  writerOpts.footerPartial = footer;

  return {
    gitRawCommitsOpts: { merges: null },
    parserOpts: parserOpts,
    writerOpts: writerOpts,
  };
});
