"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSecretKeyFromEnv = void 0;
const getSecretKeyFromEnv = (secretKey) => secretKey.replace(/\\n/g, '\n');
exports.getSecretKeyFromEnv = getSecretKeyFromEnv;
