// Jest setup file
import fetch from "cross-fetch";

// Make fetch available globally for tests
declare const global: any;
global.fetch = fetch;
