import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    environment: process.env.NODE_ENV || 'development',
    app: {
      port: parseInt(process.env.PORT, 10) || 8080,
    },
    mongoDB: {
      uri: process.env.MONGODB_URI,
    },
    acl: {
      companyUid: process.env.BASIC_ACL_COMPANY_UID,
      accessKey: process.env.BASIC_ACL_ACCESS_KEY,
      roles: {
        userCode: process.env.BASIC_ACL_CUSTOMER_ROLE_CODE,
      },
    },
    theMovieDB: {
      url: process.env.THE_MOVIE_DB_URL,
      apiKey: process.env.THE_MOVIE_DB_API_KEY,
    },
  };
});
