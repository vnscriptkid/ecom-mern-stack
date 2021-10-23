import Cookie from 'js-cookie'
import Router from 'next/router';

export const handleLogin = (token) => {
    Cookie.set('token', token);

    Router.push('/')
}