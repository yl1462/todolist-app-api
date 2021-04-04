module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'postgres://hlvobvgrehjmuz:10153a5b5ebce22a8477a7deb287ffd7772786050ee82671df027ee9880f8681@ec2-3-233-43-103.compute-1.amazonaws.com:5432/dcnc6f42l93v8a?ssl=true',
  TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgres://hlvobvgrehjmuz:10153a5b5ebce22a8477a7deb287ffd7772786050ee82671df027ee9880f8681@ec2-3-233-43-103.compute-1.amazonaws.com:5432/dcnc6f42l93v8a-test?ssl=true'
}