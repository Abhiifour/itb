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
const express_1 = __importDefault(require("express"));
const cron_1 = require("./cron");
const repo_1 = require("./repo");
const auth_1 = require("./auth");
const app = (0, express_1.default)();
(0, cron_1.cronJob)();
app.use(express_1.default.json());
app.post('/login', auth_1.login);
app.post('/signup', auth_1.signup);
app.post('/repo/create', repo_1.createRepo);
app.post('/repos', repo_1.getAllRepo);
app.post('/repo/subscribe', repo_1.subscribeRepo);
app.post('/repo/unsubscribe', repo_1.unsubscribeRepo);
app.post('/getIssues', repo_1.getdemoIssues);
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({
        message: "kela k tham pe"
    });
}));
app.listen(3001, () => [
    console.log('server listening on port 3001')
]);
