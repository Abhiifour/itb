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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cronJob = cronJob;
const node_cron_1 = __importDefault(require("node-cron"));
const db_1 = require("./db");
const github_1 = require("./github");
function cronJob() {
    node_cron_1.default.schedule('* * * * *', () => __awaiter(this, void 0, void 0, function* () {
        console.log('running a task every minute');
        const repos = yield db_1.prisma.repo.findMany({
            include: {
                subscribers: true
            }
        });
        console.log(repos);
        repos.forEach((repo) => __awaiter(this, void 0, void 0, function* () {
            const issues = yield (0, github_1.getIssues)(repo.name, repo.owner);
            if (issues.length >= 1) {
                for (const issue of issues) {
                    yield db_1.prisma.notification.create({
                        data: {
                            title: issue.title, // Access individual issue title
                            user: {
                                connect: repo.subscribers.map(subscriber => ({
                                    id: subscriber.id // Assuming `id` is the unique identifier
                                }))
                            }
                        }
                    });
                }
            }
            const lastUpdatedAt = yield (0, github_1.getLastIssue)(repo.name, repo.owner);
            if (lastUpdatedAt) {
                yield db_1.prisma.repo.update({
                    where: {
                        id: repo.id
                    },
                    data: {
                        lastIssueUpdatedAt: lastUpdatedAt.lastIssueUpdatedAt,
                        lastIssueId: lastUpdatedAt.id
                    }
                });
            }
        }));
    }));
}
