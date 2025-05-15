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
exports.createRepo = createRepo;
exports.getARepo = getARepo;
exports.getAllRepo = getAllRepo;
exports.deleteARepo = deleteARepo;
exports.subscribeRepo = subscribeRepo;
exports.unsubscribeRepo = unsubscribeRepo;
exports.getLastIssueId = getLastIssueId;
exports.getdemoIssues = getdemoIssues;
const github_1 = require("./github");
const db_1 = require("./db");
// TO CREATE A REPO
function createRepo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { name, owner } = req.body;
            const lastIssue = yield (0, github_1.getLastIssue)(name, owner);
            const repo = yield db_1.prisma.repo.create({
                data: {
                    name: name,
                    owner: owner,
                    lastIssueId: lastIssue.id,
                    lastIssueUpdatedAt: lastIssue.lastIssueUpdatedAt
                }
            });
            return res.json({
                message: 'repo created',
                repo
            });
        }
        catch (error) {
            return res.json(error);
        }
    });
}
// TO GET A REPO
function getARepo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.body; // repo id
            const repo = yield db_1.prisma.repo.findFirst({
                where: {
                    id: id
                }
            });
            return res.json({
                message: 'repo found',
                repo
            });
        }
        catch (error) {
            return res.json(error);
        }
    });
}
// TO GET ALL REPO
function getAllRepo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.body; //user id
            const repos = yield db_1.prisma.user.findUnique({
                where: {
                    id: id
                },
                include: {
                    subRepos: true
                }
            });
            return res.json({
                message: 'repos found',
                repos
            });
        }
        catch (error) {
            return res.json(error);
        }
    });
}
// TO DELETE A REPO 
function deleteARepo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.body; // repo id
            const repo = yield db_1.prisma.repo.delete({
                where: {
                    id: id
                }
            });
            return res.json({
                message: 'repo deleted'
            });
        }
        catch (error) {
            return res.json(error);
        }
    });
}
// TO SUBSCRIBE A REPO
function subscribeRepo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { repoId, userId } = req.body;
            const sub = yield db_1.prisma.repo.update({
                where: {
                    id: repoId
                },
                data: {
                    subscribers: {
                        connect: {
                            id: userId
                        }
                    }
                }
            });
            return res.json({
                message: "subscribed"
            });
        }
        catch (error) {
            return res.json({
                error
            });
        }
    });
}
// TO UNSUBSCRIBE A REPO
function unsubscribeRepo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { repoId, userId } = req.body;
            const sub = yield db_1.prisma.repo.update({
                where: {
                    id: repoId
                },
                data: {
                    subscribers: {
                        disconnect: {
                            id: userId
                        }
                    }
                }
            });
            return res.json({
                message: "unsubscribed"
            });
        }
        catch (error) {
            return res.json({
                error
            });
        }
    });
}
// GET THE LAST ISSUE ID
function getLastIssueId(name, owner) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const repo = yield db_1.prisma.repo.findFirst({
                where: {
                    name: name,
                    owner: owner
                }
            });
            return {
                lastIssueId: repo === null || repo === void 0 ? void 0 : repo.lastIssueId,
                lastIssueUpdatedAt: repo === null || repo === void 0 ? void 0 : repo.lastIssueUpdatedAt
            };
        }
        catch (error) {
            console.log(error);
        }
    });
}
function getdemoIssues(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { name, owner } = req.body;
            const issues = yield (0, github_1.getIssues)(name, owner);
            return res.json({
                issues
            });
        }
        catch (error) {
            return res.json(error);
        }
    });
}
