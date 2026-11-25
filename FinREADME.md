CS333 Final Project Plan

Name: Tristan Skeritt

Project name: Show Watchlist

GitHub repo link: https://github.com/TDS121/Show-Watchlist.git 

I used Claude to go into further detail of my plan

Part 1: What it is and who it's for
What is your app? What will it do?
Show Watchlist is an app for keeping track of TV shows. You make an account, log in, and keep your own list of shows. Each show is marked "to watch", "watching" or "finished", and you can give it a rating.

Who will use it? What do they want to get done when they open it?
People who watch a lot of shows and forget what they wanted to watch next. When they open it they want to see their list, add a new show, or update a show they just finished.

Part 2: What can people do with it?
Add a show to my list
Mark a show as "to watch", "watching" or "finished"
Delete a show from my list
Sign up for an account
Log in and log out
See only my own shows, not other people's
Give a show a rating from 1 to 10
Filter the list by status
Search for a show by name instead of typing it in (only if there is time)

The 3 with a star are built first. Accounts are the first extra I build after that.

Part 3: Pages
1. Log in page
On it: a username box, a password box, a "Log in" button, and a link to the sign up page.
The user can: log in, or go to sign up.

2. Sign up page
On it: a username box, a password box, a "Sign up" button, and a link back to log in.
The user can: make a new account.

3. My Watchlist page (the main page)
On it: my username and a "Log out" button at the top. A form to add a show (title box, status dropdown, "Add" button). Filter buttons (All, To watch, Watching, Finished). My list of shows, and each show has its title, a status dropdown, a rating, and a "Delete" button.
The user can: add a show, change its status, rate it, delete it, filter the list, and log out.


Part 4: Your data
users: username (String, required, unique), passwordHash (String, required)
shows: title (String, required), status (String, required, one of "to watch", "watching", "finished"), rating (Number, 1 to 10), userId (ObjectId, required, the user who owns the show)

Required fields: username and passwordHash for users. title, status and userId for shows. rating is not required.
Nothing goes inside something else. Users and shows are two separate collections. Each show has a userId that says whose list it is on.
The password itself is never saved, only the hash.

Part 5: Your routes
POST /api/signup makes a new account
POST /api/login logs a user in
POST /api/logout logs the user out
GET /api/me returns the user who is logged in
GET /api/shows returns all of my shows
GET /api/shows/:id returns one of my shows
POST /api/shows adds a show to my list
PATCH /api/shows/:id changes the status or rating of a show
DELETE /api/shows/:id deletes a show from my list

Part 6: Tools
bcrypt, to hash passwords so they are not saved as plain text: https://www.npmjs.com/package/bcrypt
express-session, to remember who is logged in: https://www.npmjs.com/package/express-session
TVMaze API, to search for shows by name (extra, only if there is time): https://www.tvmaze.com/api
I will learn each one from its docs page at the link.

Part 7: Plan by week
Week 7: A hello version on my server. One React page that says "Show Watchlist" and one route, GET /api/hello, that sends back a message. The page shows the message.
Week 8: The list works in React on my server. I can add a show, change its status, and delete it. The data is only in the browser for now.
Week 9: The list is saved in MongoDB through my Express API. All the shows routes work. If I refresh the page, my shows are still there.
Week 10: Accounts work. I can sign up, log in and log out. Each user only sees their own shows.
Finals week: Rating and filter buttons, styling, and bug fixes. Show search only if everything else is finished. Final version live on my server.

Part 8: The hard part
I am most worried about login. I have not done password hashing or sessions before, and every shows route has to check who is logged in.
My backup version has no accounts. It is one shared watchlist that still saves to MongoDB, which is what I will have working at the end of week 9.

Part 9: Start your repo




