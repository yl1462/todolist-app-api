module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'postgres://vshqesltgqiphx:8cddcd32baef5f6c4761c459c8deef276234717c01d6a78df24cda67152a68f1@ec2-54-235-108-217.compute-1.amazonaws.com:5432/d1mq9r4r1m5l7n',
  TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgres://vshqesltgqiphx:8cddcd32baef5f6c4761c459c8deef276234717c01d6a78df24cda67152a68f1@ec2-54-235-108-217.compute-1.amazonaws.com:5432/d1mq9r4r1m5l7n'
}