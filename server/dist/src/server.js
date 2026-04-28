"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
const port = process.env.PORT || 4000;
app_1.default.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`[ENV] NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
    console.log(`[ENV] FRONTEND_URL: ${process.env.FRONTEND_URL || 'NOT SET - CORS will be restricted to localhost'}`);
    console.log(`[ENV] DATABASE_URL set: ${!!process.env.DATABASE_URL}`);
    console.log(`[ENV] JWT_SECRET set: ${!!process.env.JWT_SECRET}`);
});
