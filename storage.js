import Cookies from 'js-cookie';

export const token = Cookies.get('token');
export const currentUser = Cookies.get('currentUser');