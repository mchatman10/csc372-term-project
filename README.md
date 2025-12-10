Instructions: click the link: https://csc372-term-project-1-lnk9.onrender.com/ (deployed by Render) to get taken to the landing page, which will be populated with a recipe on startup (intended to be populated with recipes through the external API). Go to login at the top right, using email: 'test@example.com', and password: 'password123'. From there, you have a few different options:
During my presentation, I was nervous and did not show the add recipe (POST) feature, but it was there, as well as the edit recipe (PUT) and delete recipe (DELETE) features. You can also toggle dark mode or light mode by hitting the button at the top right.

The back end URL is a Node web service and is located here: https://csc372-term-project-1.onrender.com
The front end link is a static site.  


Design choices: I chose what I'm most comfortable with based on the bit of hands-on experience we got during the lectures. React + Vite, Render, Node.js, and Neon were all protocols that we spent time getting used to in class, so I felt the most comfortable using them. 
Challenges: By far the biggest hurdle was getting authentication to work properly after deploying to render; I solved the issue by profusely changing environment variables around, looking up information about Render, just generally learning more about Render so I could understand how the front end and back end were communicating with each other
Learning Outcomes: I truly did learn how to develop a full stack app. I particularly learned a lot about authentication, the deployment was initially giving me a lot of problems so I was forced to learn how to work around it, and I got some more practice with SQL and integrating the database, which I liked.
Future Work: I would have liked to add a system where you could rate other people's recipe submissions out of 5 stars. I would have also liked to implement logging in with your Google account using OAuth.