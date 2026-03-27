"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)(); // Load .env
exports.default = {
    schema: './src/db/schema.ts',
    out: './drizzle',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL,
    },
};
