// context.js
let currentUser = null;

export const setCurrentUser = (user) => {
    currentUser = user;
};

export const getCurrentUser = () => {
    return currentUser;
};
