import api from "./api";

/**
 * Sign up with email/password
 * @param {{username:string, name:string, email:string, password:string}} payload
 * @returns {Promise<{message:string}>}
 */
export async function signup(payload) {
  try {
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
