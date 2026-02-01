web: npm start

workers: 1

dyno_type: standard-1x

release:
  - cd server && npm install && npm run build && npm run seed

env:
  NODE_ENV: production
  NPM_CONFIG_PRODUCTION: false
