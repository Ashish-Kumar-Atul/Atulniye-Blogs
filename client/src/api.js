// client/src/api.js
export const API_URL =
  import.meta.env.VITE_API_URL || "/api";

// Example register call
export const registerUser = async (data) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include", // needed for cookies
  });
  return res.json();
};
