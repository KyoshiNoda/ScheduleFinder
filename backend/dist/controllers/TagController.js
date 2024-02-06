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
class TagController {
    // GET user's tags by token
    static getUserTags(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    // PATCH user's tags by token
    static updateUserTags(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    // DELETE single user's tag by token
    static deleteUserTag(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    // DELETE all user's tags by token
    static clearUserTags(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    // GET all tags
    static getAllTags(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.send('GET All tags working!');
        });
    }
    // POST new tag
    static createTag(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.default = TagController;
