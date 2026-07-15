"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.comparePassword = comparePassword;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const SALT_ROUNDS = 10;
/**
 * Hashes password using bcryptjs.
 * @param password mot de passe normal
 * @returns mot de passe hashé
 */
async function hashPassword(password) {
    return bcryptjs_1.default.hash(password, SALT_ROUNDS);
}
/**
 * Compaison d'un mot de passe avec un autre hashé
 * @param password mot de passe normal
 * @param hash mot de passe hashé
 * @returns True if they match, false sinon
 */
async function comparePassword(password, hash) {
    return bcryptjs_1.default.compare(password, hash);
}
