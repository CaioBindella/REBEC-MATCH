export default ({ config }) => ({
  ...config,
  extra: {
    // É uma boa prática manter qualquer valor 'extra' que já exista
    ...config.extra,
    apiUrl: process.env.PUBLIC_API_BASE_URL,
    USER_KEY: process.env.USER_KEY,
    TOKEN_KEY: process.env.TOKEN_KEY,
  },
});