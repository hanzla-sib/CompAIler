import { GoogleGenAI } from "@google/genai";
import { systemPrompt, fixPrompt } from "../constants/prompts";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY; // i have given a dummy env file and you have to make .env file and paste your own key

if (!apiKey) {
  throw new Error(
    "Gemini API key is missing. Set VITE_GEMINI_API_KEY in your .env file. " +
      "Note: exposing API keys in client-side code is a security risk — prefer calling Gemini from a server."
  );
}

const ai = new GoogleGenAI({ apiKey });

/**
 * Generate code based on prompt and framework
 * @param {string} prompt - Description of the component to generate
 * @param {string} framework - Framework to use (e.g., 'html-css', 'html-tailwind')
 * @returns {Promise<string>} Generated code
 */
export async function generateCode(prompt, framework) {
  if (!prompt?.trim()) {
    throw new Error("Prompt is required to generate code");
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: systemPrompt(prompt, framework),
    });
    console.log(response.text);
    return response.text;
  } catch (error) {
    console.error("Error generating code:", error);
    throw new Error("Failed to generate code. Please try again.");
  }
}

/**
 * Review existing code and provide feedback
 * @param {string} value - Type of review or instructions
 * @param {string} code - Code to review
 * @returns {Promise<string>} Review feedback
 */
export async function reviewCode(value, code) {
  if (!code?.trim()) {
    throw new Error("Code is required for review");
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: systemPrompt(value, code),
    });
    console.log(response.text);
    return response.text;
  } catch (error) {
    console.error("Error reviewing code:", error);
    throw new Error("Failed to review code. Please try again.");
  }
}

/**
 * Fix code based on issues or requirements
 * @param {string} value - Fix instructions or issue description
 * @param {string} code - Code to fix
 * @returns {Promise<string>} Fixed code
 */
export async function fixCode(value, code) {
  if (!code?.trim()) {
    throw new Error("Code is required for fixing");
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: fixPrompt(value, code),
    });
    return response.text;
  } catch (error) {
    console.error("Error fixing code:", error);
    throw new Error("Failed to fix code. Please try again.");
  }
}

/**
 * Extract code from markdown-formatted response
 * @param {string} response - Raw response that may contain markdown code blocks
 * @returns {string} Extracted code
 */
export function extractCode(response) {
  if (!response) return "";
  
  // Match code blocks with optional language identifier
  const match = response.match(/```(?:\w+)?\n?([\s\S]*?)```/);
  return match ? match[1].trim() : response.trim();
}