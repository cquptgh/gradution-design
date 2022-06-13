import store from "store";

const USER_KEY = "user_key";

export const operationUserStorage = {
  saveUser(user) {
    store.set(USER_KEY, user);
  },

  getUser() {
    return store.get(USER_KEY) || {};
  },

  removeUser() {
    store.remove(USER_KEY);
  }
};
