export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  MOVED_PERMANENTLY: 301,
  FOUND: 302,
  NOT_MODIFIED: 304,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

export const ERROR_MESSAGES = {
  MISSING_FIELDS: "Please fill out all required fields",
  MISSING_USER_ID: "User ID not found in token",
  USER_NOT_FOUND: "Username not found",
  USER_EXISTS: "User already exists",
  INVALID_CREDENTIALS: "Invalid username or password",
  INTERNAL_ERROR: "Something went wrong",
};

export const SUCCESS_MESSAGES = {
  REGISTER_SUCCESS: "User registered successfully",
  LOGIN_SUCCESS: "Login successful",
  PROJECT_CREATED: "Project created successfully",
  PROJECT_UPDATED: "Project details updated successfully",
  PROJECT_DELETED: "Project deleted successfully",
  CODE_SAVED: "Code saved successfully",
};
