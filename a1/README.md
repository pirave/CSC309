## Assignment 1

Commenting System built on Node.JS 

#####Description

Develop a commenting system that provides the following functionality:

- Allows to post a new TOPIC, in the form of a short text (140 characters) plus a link (mandatory).
- Allows a user to REPLY to any topic with a short text
- Replies are threaded, which means users can reply to other replies, creating a tree-like structure with all the replies. Topics are always the root for any branch.
- Allows users to VOTE UP the best REPLIES
- Displays a list of all current TOPICS. Each topic will be displayed along with their threaded replies organized by VOTES. You’ll have to use an algorithm that sorts the topics based on the votes all their replies received.
- When clicking on the topic text, the list of all replies associated with that topic should appear dynamically, without reloading the entire page.   The replies should be sorted in such a way that those that have received the most votes appear at the top of the list.

#####Requirements

- The system is anonymous and so there is NO need to login or keep track of users. (for simplicity sake)
- The system will consist of two main components: the front end, which should be implemented as ONE web page called index.html and the back end, which should be implemented as a Node.js server implementing a REST API. The page is allowed to use the basic jQuery library.
- All the operations need to be performed by the server and can only be requested via your own REST API.   This means that aside from loading the initial index.html page, there should be no other pages served by the server.
- The Node.js server does NOT require a database. For the purpose of this assignment it is ok to loose all data when the server is stopped.
- Your Node.js server should use one of the ports assigned to a member of your team.  For a complete list of ports look at the page CDF accounts and port numbers.The fronted must be accessible using the root URL. For instance,
if your server is running on port 1234 on local machine, we will only
test http://127.0.0.1:1234/
- Make sure your site functions correctly in the CDF environment. TAs will not debug your code so test the assignment before submitting.

#####Deliverables
Put all your project files in one directory (DO NOT INCLUDE NODE.JS ITSELF), and archive the directory into a single file using tar or a similar utility. Finally, submit your assignment using the CDF Submit system (only one member of each team should submit).

You electronic submission should include the following items:

- A README file that lists all the members of your team.
- Documentation for your Web site. Include a brief explanations of how it all works, e.g., list of main user-defined objects, and data structures.
- CSS file (optional).
- HTML file.   The page should display any usage instructions.
- JavaScript file(s) included in the index.html page and for your Node.JS server.  You should also include the jQuery libraries needed by your project.
- A text file with a list of REST URLs meant to be run before the application in order to populate your page (adding a few topics, replies and votes).  Think of these as your test cases too.

Finally, all deliverables should be neatly formatted, readable,and be properly documented.
