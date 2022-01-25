module.exports = {
  eslint: {
    dirs: ['pages', 'components','apis','services'], //Only run lint in theese folders
  },
  
  publicRuntimeConfig: {
    BFF_BASE_URL: process.env.BFF_BASE_URL,
    DOCKERTAG: process.env.DOCKERTAG,
  }
}
