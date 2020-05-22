# node-mandatory-2
This is my mandatory project for the Node.js elective.

The main intent with this website is a place to share cool pictures of your car. 
Eventually it would be possible if the user could upload more than one picture at a time.
Then intent is also that it would be possible to comment on picutres.
When uploading a picture, the use will be asked to choose a category. 
The webiste will use this category for sorting the pictures into their coresponding html lists.

The website includes a Sign In and Create User page. These includes enctyption and are connected to a local database.
The database can be set up by using the migrate:latest script.
An example of a row in the database can be found in the seeds. The admin password is "password".

After a successful sign in the user will recievie ad jwt token in response. 
I have also implemented a middleware function which checks if the token is valid. 
But for now i don't know how to use the token after is has been sent to the user in response. 
Therefor the middleware will say "Auth token is not supplied".

Started to set up nodemailer. This would eventually be used to send a new password to the user, 
but for now its just works for sending whatever by calling the nodemailer.js file with node.

