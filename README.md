# Address Book Assignment

A simple address book API that stores basically validated addresses in memory and shouldn't be deployed anywhere for any reason other than completing this assignment.

Created using Express-Boilerplate.

## Set up

Complete the following steps to start a new project, address-book:

1. Clone this repository to your local machine `git clone (URL or SSH) address-book`
2. `cd` into the cloned repository
3. Make a fresh start of the git history for this project with `rm -rf .git && git init`
4. Install the node dependencies `npm install`
5. Move the example Environment file to `.env` that will be ignored by git and read by the express server `mv example.env .env`

## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests `npm test`

## Deploying

When your new project is ready for deployment, add a new Heroku application with `heroku create`. This will make a new git remote called "heroku" and you can then `npm run deploy` which will push to this remote's master branch.
