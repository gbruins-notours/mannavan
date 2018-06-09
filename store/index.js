import Cookie from 'cookie';
import shopping_cart_mixin from '@/mixins/shopping_cart_mixin';


export const state = () => ({
    jwtKey: null,
    user: null
});

export const mutations = {
    JWT_KEY: (state, key) => {
        state.jwtKey = key
    },

    SET_USER (state, user) {
        state.user = user || null
    }
}

export const actions = {
    JWT_KEY: ({ commit }, key) => {
        commit('JWT_KEY', key)
    },

    /**
     * If there's a cookie in the request header, get the cart and save it in vuex,
     * otherwise we get the client token and save it in vuex
     */
    async nuxtServerInit({ commit }, { req, app }) {
        try {
            let accessToken = null;

            if (req.headers.cookie) {
                const parsed = Cookie.parse(req.headers.cookie);
                app.store.dispatch('shoppingcart/CART_TOKEN_SET', parsed['cart-jwt']);

                const shoppingCart = await shopping_cart_mixin.methods.getCart.call(app);
                app.store.dispatch('shoppingcart/CART_SET', shoppingCart);
                return;
            }

            const cartToken = await shopping_cart_mixin.methods.getCartToken.call(app);
            app.store.dispatch('shoppingcart/CART_TOKEN_SET', cartToken);

            // Note: using Cookie.serialize here wont work.  It doesn't actually
            // set a cookie, but instead will "Serialize a cookie name-value pair into a Set-Cookie header string",
            // which is not what we want (https://github.com/jshttp/cookie#cookieserializename-value-options)
            // So, we're setting the token in vuex, and the cart-token nuxt plugin will pull the
            // value from vuex and set in a cookie.

            return;
        }
        catch(err) {
            console.error("ERROR GETTING CART TOKEN", err);
        }
    }
}


export const getters = {
    isAuthenticated (state) {
        return !!state.user
    },

    loggedUser (state) {
        return state.user
    }
}
