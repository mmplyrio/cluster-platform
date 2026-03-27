"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
require("dotenv/config");
const postgres_js_1 = require("drizzle-orm/postgres-js");
const postgres_1 = __importDefault(require("postgres"));
// Ensure this environment variable is set
const connectionString = process.env.DATABASE_URL || '';
// Create a postgres client
const client = (0, postgres_1.default)(connectionString, { prepare: false });
// Export the db instance
exports.db = (0, postgres_js_1.drizzle)(client);
