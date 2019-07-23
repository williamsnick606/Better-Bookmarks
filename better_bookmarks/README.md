# Better Bookmarks Chrome Extension

Better Bookmarks is a bookmark oganization tool. It uses Machine Learning and Natural Language Processing to automatically categorize your newly added bookmarks into 5 pre-defined categories with 90% accuracy. The categories we currently filter for are Arts, Business, Health, Society, and Sports. No more messy bookmark folders.

# File structure
This is the root folder for the better bookmarks Chrome extension
code.  This README file provides information that each extension
developer should know and be aware of.

# Directory Structure

All JavaScript sources are located in the __js__ directory; HTML is
located in the __views__ directory; CSS is located in the __css__
directory.

We make use of [__JSDoc__](https://github.com/jsdoc/jsdoc) to automatically generate API documentation which gets output in the __docs__
directory.

General informational files such as this README
are located here in the extension's root directory. Programming style guidelines are located in the __Programming_Style_Guideline folder__.

# JavaScript Coding Style

See the file __Programming_Style_Guidelines\Javascript_Style_Guide.md__.

# Contributing Code

Anyone desiring to contribute code to the extension portion of the __Better Bookmarks__ project must follow the following workflow:

1. make sure you [__fork__](https://help.github.com/en/articles/fork-a-repo) the [__main repository__](https://github.com/williamsnick606/Better-Bookmarks);
2. once you decide on a feature or fix that you would like to work on, create a new [__branch__](https://www.git-tower.com/learn/git/ebook/en/command-line/branching-merging/branching-can-change-your-life#start) using the _git_ command, `git checkout -b <branch name>`;
3. when you feel like your feature or fix is complete and it is ready to be integrated back into the main project, create a [__pull request__](https://help.github.com/en/articles/creating-a-pull-request) and __request review__ from the other extension members;
4. respond to review feedback—reviews will predominantly consist of requests to edit submitted code;
5. after the reviewers determine that your code does not break anything and that it adheres to the accepted coding style and best practices, it will be merged into the main repository.  At this point, if you so desire, you can go ahead and delete your branch using the _git_ command, `git branch -d <branch name>`.

# A Note on Branches

__Do not__ work in the master branch of your fork.  Always use branches to work on new features, user stories, tasks, and bug fixes.  Your master branch should be the functioning and releasable version of the application; there should never be any known bugs and errors introduced to it.

See [this link](https://thenewstack.io/dont-mess-with-the-master-working-with-branches-in-git-and-github/) for more information on why you should never work directly in master.

See the following link for an interactive tutorial on git branching:
> https://learngitbranching.js.org/.

Your branches should only be merged into upstream/master once you feel they are complete.  A branch which implements the addition, or altering, of a feature is complete when the feature being added, or altered, has been tested and determined to be error free.  If your branch was created to fix a bug, then your branch is complete when it has been determined that your fix does in fact fix the bug.


__NOTE:__ if your pull request has [merge conflicts](https://www.git-tower.com/learn/git/ebook/en/command-line/advanced-topics/merge-conflicts#start), then you will be responsible for resolving them.

# Generating JSDoc Documentation

You have two options for generating documentation using __JSDoc__:

    1. run the file _generate_jsdocs.js (requires __bash__ and __jsdoc__), or
    2. run __jsdoc__ yourself on the js sources with __JSDoc__ annotations.
