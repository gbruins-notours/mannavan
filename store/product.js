'use strict';

export const state = () => ({
    types: {},
    subTypes: {},
    seoUri: {}
})


export const mutations = {
    PRODUCT_TYPES: (state, productTypes) => {
        if(Array.isArray(productTypes)) {
            productTypes.forEach((obj) => {
                state.types[obj.name] = obj.value;
            })
        }
    },

    PRODUCT_SUBTYPES: (state, subTypes) => {
        if(Array.isArray(subTypes)) {
            subTypes.forEach((obj) => {
                state.subTypes[obj.name] = obj.value;
                state.seoUri[obj.name] = obj.slug;
            })
        }
    }
}


export const actions = {
    PRODUCT_TYPES ({ commit }, productTypes) {
        commit('PRODUCT_TYPES', productTypes)
    },

    PRODUCT_SUBTYPES ({ commit }, subTypes) {
        commit('PRODUCT_SUBTYPES', subTypes)
    }
}


export const getters = {
    subTypes: (state) => {
        return state.subTypes;
    },

    seoUri: (state) => {
        return state.seoUri;
    }
}
