import fetch, { Response, HeadersInit } from "node-fetch";

const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY;
const JUDGE0_API_HOST = process.env.JUDGE0_API_HOST;

export const executeCodeOnJudge0 = async (
  languageId: number,
  sourceCode: string
) => {
  if (!JUDGE0_API_KEY) {
    throw {
      message: "JUDGE0_API_KEY is not set in environment variables",
    };
  }
  if (!JUDGE0_API_HOST) {
    throw {
      message: "JUDGE0_API_HOST is not set in environment variables",
    };
  }
  const url = `https://${JUDGE0_API_HOST}/submissions?wait=true`;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "X-RapidAPI-Key": JUDGE0_API_KEY,
    "X-RapidAPI-Host": JUDGE0_API_HOST,
  };
  const body = JSON.stringify({
    language_id: languageId,
    source_code: sourceCode,
  });
  try {
    const response: Response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: body,
    });
    if (!response.ok) {
      const error = await response.json();
      throw {
        message: `Judge0 API Error: ${JSON.stringify(error)}`,
      };
    }
    const result = await response.json();
    return result;
  } catch (error: any) {
    throw error;
  }
};

export const getJudge0LanguageId = (language: string) => {
  switch (language.toLowerCase()) {
    case "javascript":
      return 63;
    case "java":
      return 62;
    case "python":
      return 71;
    case "python3":
      return 71;
    case "c++":
      return 54;
    case "c#":
      return 51;
    case "r":
      return 80;
    default:
      return null;
  }
};
