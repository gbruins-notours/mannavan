// Even though we are using @nuxt/dotenv module, we need to require dotenv here because
// we need the env variables for the nuxt build (in plugins/api.js)
// https://github.com/nuxt-community/dotenv-module#using-env-file-in-nuxtconfigjs
require('dotenv').config();

const isDev = process.env.NODE_ENV === 'development';

module.exports = {
    mode: 'universal',

    /*
    ** Headers
    ** Common headers are already provided by @nuxtjs/pwa preset
    */
    head: {
        title: process.env.npm_package_name || '',
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/images/favicon.ico' },
            { rel: 'preconnect', href: '//pcdn.piiojs.com' },
            {
                rel: 'preload',
                as: 'script',
                href: `//pcdn.piiojs.com/${process.env.PIIO_DOMAIN_KEY}/image.min.js`
            }
        ],
        script: [
            // NOTE: Putting this in the head() of the cart/checkout/index.vue file, instead of here,
            // causes this to be loaded only for that route.  That's a good thing, but it caused a race
            // condition resulting in a javascript error: SqPaymentForm is not defined
            // That's because the CheckoutSectionPayment component, which uses SqPaymentForm, sometimes
            // loads before the head() script is loaded.
            // Putting it here doesn't seem ideal, but it's safest.
            {
                src: isDev ? 'https://js.squareupsandbox.com/v2/paymentform' : 'https://js.squareup.com/v2/paymentform',
                body: true,
                async: true
            },
            {
                hid: 'piio-init',
                innerHTML: `(function(i,m,a,g,e) {e = i.getElementsByTagName(m)[0], (g = i.createElement(m)).src = "//pcdn.piiojs.com/"+a+"/image.min.js",g.onerror = function() {(g = i.createElement(m)).src = "https://fs.piio.co/image-failover.min.js",e.parentNode.insertBefore(g, e);}, e.parentNode.insertBefore(g, e);}(document, "script", "${process.env.PIIO_DOMAIN_KEY}"));`,
                type: 'text/javascript',
                pbody: true
            }
        ],

        // disabling the HTML sanitizer for the piio-init script (innerHTML vaule)
        __dangerouslyDisableSanitizersByTagID: {
            'piio-init': ['innerHTML']
        }
    },

    telemetry: false,

    meta: {
        name: 'BreadVan',
        theme_color: '#e66d17'
    },

    /*
    ** Customize the progress-bar color
    */
    loading: {
        color: '#67c23a',
        height: '4px',
        duration: 5000
    },


    /*
    ** Global CSS
    */
    css: [
        'element-ui/lib/theme-chalk/index.css',
        '@/assets/css/base.scss'
    ],

    server: {
        port: 3000,
        host: 'localhost', // default: localhost,
        timing: false
    },

    /*
    ** Plugins to load before mounting the App
    */
    plugins: [
        { src: '@/plugins/tenantLogin.js', mode: 'server' },
        '@/plugins/axios.js',
        '@/plugins/api.js',
        '@/plugins/i18n.js',
        '@/plugins/element-ui',
        '@/plugins/global-properties',
        '@/plugins/vuelidate',
        '@/plugins/format8601',
        '@/plugins/prettyJson',
        '@/plugins/svgIcon.js',
        '@/plugins/piio/piio.js',
        // { src: '@/plugins/piio/piio.js', ssr: false },
        { src: '@/plugins/youtube', ssr: false },
        { src: '@/plugins/bugsnag', ssr: false },
        { src: '@/plugins/paypal-button/paypal-button.js', ssr: false }
    ],

    buildModules: [
        // '@nuxtjs/eslint-module' // https://github.com/nuxt-community/eslint-module
        ['@nuxtjs/dotenv', isDev ? null : { path: '/etc/secrets' }] // Doc: https://github.com/nuxt-community/dotenv-module
    ],

    router: {
        middleware: [
            'axios',
            'in-checkout'
        ]
    },

    /*
    ** Nuxt.js modules
    */
    modules: [
        // Doc: https://axios.nuxtjs.org/usage
        '@nuxtjs/axios',
        'cookie-universal-nuxt',
        ['@nuxtjs/pwa', { oneSignal: false }],
        'bootstrap-vue/nuxt'
    ],

    /*
    ** Axios module configuration
    *  See https://github.com/nuxt-community/axios-module#options
    */
    axios: {
        debug: false,
        // retry: { retries: 3 },
        progress: true
    },


    /*
    * Disabling automatic inclusion of bootstrap's compiled CSS files
    * so we can import the SCSS files ourselves in base.scss
    * https://bootstrap-vue.org/docs
    */
    bootstrapVue: {
        bootstrapCSS: false, // Or `css: false`
        bootstrapVueCSS: false, // Or `bvCSS: false`

        // https://bootstrap-vue.org/docs/reference/settings#default-configuration
        // https://getbootstrap.com/docs/4.4/utilities/borders/
        config: {
            BModal: {
                buttonSize: 'md',
                bodyBgVariant: null,
                // bodyTextVariant: 'secondary',
                cancelVariant: 'outline-secondary',
                centered: true,
                footerBgVariant: 'light',
                footerBorderVariant: '0',
                footerClass: 'p-1',
                footerTextVariant: null,
                headerBgVariant: null,
                headerBorderVariant: null,
                headerCloseContent: '&times;',
                headerTextVariant: null,
                headerCloseVariant: null,
                hideHeaderClose: false,
                okVariant: 'primary',
                size: 'md',
                titleTag: 'h6'
            }
        },

        // importing only the stuff we are using to reduce bundle size
        components: [
            // 'BBadge',
            // 'BButton',
            // 'BButtonGroup',
            // 'BCollapse',
            // 'BContainer',
            // 'BRow',
            // 'BCol',
            // 'BDropdown',
            // 'BDropdownForm',
            // 'BDropdownItem',
            // 'BDropdownItemButton',
            // 'BFormCheckbox',
            // 'BFormFile',
            // 'BFormGroup',
            // 'BFormInput',
            // 'BFormRadio',
            // 'BFormSelect',
            // 'BFormSelectOption',
            // 'BFormTextarea',
            'BImg',
            // 'BInputGroup',
            // 'BInputGroupText',
            // 'BInputGroupAppend',
            // 'BModal',
            // 'BOverlay',
            // 'BPopover',
            // 'BTable',
            'BTooltip'
        ],
        componentPlugins: [
            // 'TablePlugin',
            // 'ToastPlugin',
            'ModalPlugin',
            'BVModalPlugin'
        ]
        // directives: ['VBModal', 'VBPopover', 'VBToggle', 'VBTooltip', 'VBScrollspy'],
    },

    /**
     *  Build configuration
     */
    build: {
        // analyze: true,
        transpile: [/^element-ui/],

        /*
        ** You can extend webpack config here
        */
        extend (config, ctx) {
        }
    },

    // render: {
    //     bundleRenderer: {
    //         shouldPreload: (file, type) => {
    //             return ['script', 'style', 'font'].includes(type);
    //         }
    //     }
    // },

    pageTransition: {
        name: 'fade',
        mode: 'out-in'
    }
};
