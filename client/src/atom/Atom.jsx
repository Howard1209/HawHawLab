import { atom } from 'recoil';

export const loginState = atom({
  key: 'isLogin', 
  default: false,
});

export const usernameState = atom({
  key: 'username',
  default: 'Sign In',
});