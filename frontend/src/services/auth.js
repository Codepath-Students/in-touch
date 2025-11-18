import api, { ensureCsrf, setAccessToken } from "./api";

/**
 * Sign up with email/password
 * @param {{username:string, name:string, email:string, password:string}} payload
 * @returns {Promise<{message:string}>}
 */
export async function signup(payload) {
  try {
    await ensureCsrf();
    const { username, name, email, password } = payload;
    const res = await api.post("/auth/signup", {
      username,
      email,
      password,
      display_name: name,
    });
    return res.data; // { message }
  } catch (err) {
    const status = err?.response?.status;
    const message = err?.response?.data?.message || "Signup failed";
    // normalize errors used by UI
    if (status === 400 && /Email already in use/i.test(message)) {
      throw Object.assign(new Error("Email already registered"), {
        code: "EMAIL_TAKEN",
        message: "Email already registered",
      });
    }
    if (status === 400 && /Username already in use/i.test(message)) {
      throw Object.assign(new Error("Username already taken"), {
        code: "USERNAME_TAKEN",
        message: "Username already taken",
      });
    }
    throw Object.assign(new Error(message), { code: "UNKNOWN" });
  }
}

/**
 * Log in with email/password
 * @param {{email:string, password:string}} payload
 * @returns {Promise<{accessToken:string}>}
 */
export async function login(payload) {
  try {
    await ensureCsrf();
    const { email, password } = payload;
    const res = await api.post("/auth/login", { email, password });
    if (res.data?.accessToken) setAccessToken(res.data.accessToken);
    return res.data; // { accessToken }
  } catch (err) {
    const status = err?.response?.status;
    const message = err?.response?.data?.message || "Login failed";
    if (status === 401) {
      throw Object.assign(new Error("Invalid email or password"), {
        code: "INVALID_CREDENTIALS",
        message: "Invalid email or password",
      });
    }
    throw Object.assign(new Error(message), { code: "UNKNOWN" });
  }
}

/**
 * Log out the current user (server + client)
 */
export async function logout() {
  try {
    await ensureCsrf();
    await api.post("/auth/logout");
  } finally {
    // Clear token locally regardless of server response
    setAccessToken(null);
  }
}
