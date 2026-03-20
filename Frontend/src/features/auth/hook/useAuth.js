import { useDispatch } from "react-redux";
import { setError, setLoading, setUser } from "../auth.slice";
import { register, login, getMe } from "../services/auth.api";

export function useAuth() {
  const dispatch = useDispatch();

  async function handleRegister({ username, email, password }) {
    try {
      dispatch(setError(null));
      dispatch(setLoading(true));
      await register({ username, email, password });
      //   no need to return anything here since the user will verify their email before logging in
    } catch (err) {
      dispatch(
        setError(err.response?.data?.message || "Failed to fetch user data"),
      );
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleLogin({ email, password }) {
    try {
      dispatch(setError(null));
      dispatch(setLoading(true));
      const data = await login({ email, password });
      dispatch(setUser(data.user));
    } catch (err) {
      dispatch(
        setError(err.response?.data?.message || "Failed to fetch user data"),
      );
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleGetMe() {
    try {
      dispatch(setError(null));
      dispatch(setLoading(true));
      const data = await getMe();
      dispatch(setUser(data.user));
    } catch (err) {
      dispatch(
        setError(err.response?.data?.message || "Failed to fetch user data"),
      );
    } finally {
      dispatch(setLoading(false));
    }
  }

  return {
    handleGetMe,
    handleLogin,
    handleRegister,
  };
}
