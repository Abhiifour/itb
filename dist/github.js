"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLastIssue = exports.getRepo = exports.getIssues = void 0;
const octokit_1 = require("octokit");
const repo_1 = require("./repo");
const octokit = new octokit_1.Octokit({
    auth: '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'
});
const getIssues = (name, owner) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lastIssue = yield (0, repo_1.getLastIssueId)(name, owner);
        console.log(lastIssue);
        const res = yield octokit.request('GET /repos/{owner}/{repo}/issues', {
            owner: owner,
            repo: name,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            },
            sort: 'created',
            direction: 'desc',
        });
        const issues = res.data.filter((issue) => !issue.pull_request);
        // console.log(issues)
        const newIssues = [];
        console.log(issues[0].id);
        if (issues.length > 0) {
            const lastUpdated = new Date(lastIssue === null || lastIssue === void 0 ? void 0 : lastIssue.lastIssueUpdatedAt);
            for (const issue of issues) {
                const created = new Date(issue.created_at);
                if (created > lastUpdated) {
                    newIssues.push(issue);
                }
                else {
                    break; // assuming issues are sorted newest -> oldest
                }
            }
        }
        // console.log(newIssues)
        return newIssues;
    }
    catch (error) {
        return error;
    }
});
exports.getIssues = getIssues;
const getRepo = (name, owner) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield octokit.request('GET /repos/{owner}/{repo}', {
            owner: owner,
            repo: name,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        });
        const repo = res.data;
        return repo;
    }
    catch (error) {
        return error;
    }
});
exports.getRepo = getRepo;
const getLastIssue = (name, owner) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield octokit.request('GET /repos/{owner}/{repo}/issues', {
            owner: owner,
            repo: name,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        });
        const issues = res.data.filter((issue) => !issue.pull_request);
        const id = issues[0].id.toString();
        const lastIssueUpdatedAt = issues[0].updated_at;
        return {
            id,
            lastIssueUpdatedAt
        };
    }
    catch (error) {
        return error;
    }
});
exports.getLastIssue = getLastIssue;
