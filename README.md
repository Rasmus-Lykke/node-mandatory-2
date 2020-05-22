# node-mandatory-2
This is my mandatory project for the Node.js elective.

The main intent with this website is a place to share cool pictures of your car. 
Eventually it would be possible if the user could upload more than one picture at a time.
Then intent is also that it would be possible to comment on pictures.
When uploading a picture, the use will be asked to choose a category. 
The website will use this category for sorting the pictures into their corresponding html lists.

The website includes a Sign In and Create User page. These includes encryption and are connected to a local database.
The database can be set up by using the migrate:latest script.
An example of a row in the database can be found in the seeds. The admin password is "password".

After a successful sign in the user will receive ad jwt token in response. 
I have also implemented a middleware function which checks if the token is valid. 
But for now i don't know how to use the token after is has been sent to the user in response. 
Therefor the middleware will say "Auth token is not supplied" unless you copy the token into the header by using for example Postman.
I was thinking about parsing the token as a parameter in the redirect url,
which seems to work but i am sure that its not the right way to do it? I think i am supposed to add it to the client header somehow

Started to set up nodemailer. This would eventually be used to send a new password to the user, 
but for now its just works for sending whatever by calling the nodemailer.js file with node.

