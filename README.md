dlabs Authentication Service



<!-- To run project on a local environment 
- Simple use `npm run docker-build`
- Spin up the docker containers using `docker-compose up`
- Api docs will serve on `http://localhost:3000/api/v1/docs/` -->


### Start Database
Run `docker-compose up` at the project root.

### Setup environment
Create a file name .env. Update its content to look like the snippet below.

`
DB_CONNECTION=postgres
DB_HOST=localhost
DB_USERNAME=dlabs_auth_service_user
DB_PASSWORD=8T8YS2J4G7LW4G6L
DB_DATABASE=dlabs_auth_service
DB_PORT=5674
DOMAIN=http://localhost
SHOW_LOG=true
PROJECT_NAME=dlabs-auth-service
MAILER_HOST=smtp.mailtrap.io
EMAIL_PORT=587
EMAIL_SENDER=auth@dlabsdevs.com
EMAIL_REPLY=email_reply@dlabsdevs.com
VERSION=1
EMAIL_USER=b0ca5a29dac9
EMAIL_PASS=2804ae384e4
PROJECT_DESCRIPTION=A service tfor dlabs authentication
`
### Start Application
Run `npm run start:dev`

### View API Docs
Open `http://localhost:3000/api/v1/docs/` in your browser.
