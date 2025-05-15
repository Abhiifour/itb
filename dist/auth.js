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
exports.login = login;
exports.signup = signup;
const db_1 = require("./db");
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            const user = yield db_1.prisma.user.findFirst({
                where: {
                    email: email,
                    password: password
                }
            });
            if (user) {
                return res.status(200).json({
                    user
                });
            }
        }
        catch (error) {
            return res.json(error);
        }
    });
}
function signup(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { name, username, email, password } = req.body;
            const user = yield db_1.prisma.user.findFirst({
                where: {
                    email: email,
                }
            });
            if (!user) {
                const newUser = yield db_1.prisma.user.create({
                    data: {
                        name: name,
                        username: username,
                        email: email,
                        password: password
                    }
                });
                return res.status(200).json({
                    newUser
                });
            }
            return res.json({
                message: "user already exists"
            });
        }
        catch (error) {
            return res.json(error);
        }
    });
}
