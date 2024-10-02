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
exports.AccountModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = require("../../utils/bcrypt");
const account_schema_1 = require("./account.schema");
//middleware
account_schema_1.ACCOUNT_COLLECTION_SCHEMA.pre('save', function () {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isModified('password')) {
            this.password = yield (0, bcrypt_1.hashValue)(this.password);
        }
    });
});
//methods
account_schema_1.ACCOUNT_COLLECTION_SCHEMA.methods.comparePassword = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (0, bcrypt_1.compareHash)(password, this.password);
    });
};
exports.AccountModel = mongoose_1.default.model(account_schema_1.ACCOUNT_COLLECTION_NAME, account_schema_1.ACCOUNT_COLLECTION_SCHEMA);
