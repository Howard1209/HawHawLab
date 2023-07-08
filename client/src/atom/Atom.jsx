import { atom } from 'recoil';

export const loginState = atom({
  key: 'isLogin', 
  default: false,
});

export const usernameState = atom({
  key: 'username',
  default: 'Sign In',
});

export const userIdState = atom({
  key: 'userId',
  default: '',
})

export const loginBtnState = atom({
  key: 'isShowing',
  default: false,
});

export const sidebarButtonState = atom({
  key:'open',
  value: true,
})
