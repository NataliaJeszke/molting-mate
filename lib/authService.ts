import * as SecureStore from "expo-secure-store";

const USERNAME_KEY = "local_user_username";
const PASSWORD_KEY = "local_user_password";
const LOGGED_IN_KEY = "local_user_logged_in";

export const registerUser = async (username: string, password: string) => {
  const alreadyRegistered = await isUserRegistered();
  if (alreadyRegistered) {
    throw new Error("Użytkownik już istnieje");
  }
  await SecureStore.setItemAsync(USERNAME_KEY, username);
  await SecureStore.setItemAsync(PASSWORD_KEY, password);
  await SecureStore.setItemAsync(LOGGED_IN_KEY, "true");
};

export const resetPassword = async (username: string) => {
  const storedUsername = await SecureStore.getItemAsync(USERNAME_KEY);
  if (storedUsername === username) {
    await SecureStore.deleteItemAsync(PASSWORD_KEY);
    return true;
  }
  return false;
};

export const isUserRegistered = async (): Promise<boolean> => {
  const username = await SecureStore.getItemAsync(USERNAME_KEY);
  const password = await SecureStore.getItemAsync(PASSWORD_KEY);
  return !!username && !!password;
};

export const loginUser = async (
  username: string,
  password: string,
): Promise<boolean> => {
  const storedUsername = await SecureStore.getItemAsync(USERNAME_KEY);
  const storedPassword = await SecureStore.getItemAsync(PASSWORD_KEY);

  const isMatch = storedUsername === username && storedPassword === password;
  if (isMatch) {
    await SecureStore.setItemAsync(LOGGED_IN_KEY, "true");
  }

  return isMatch;
};

export const logoutUser = async () => {
  await SecureStore.setItemAsync(LOGGED_IN_KEY, "false");
};

export const isLoggedIn = async (): Promise<boolean> => {
  const status = await SecureStore.getItemAsync(LOGGED_IN_KEY);
  return status === "true";
};
