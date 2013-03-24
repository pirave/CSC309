## Assignment 3

###Twitter Favourite Things Client

[Preview Client](http://pirave.github.com/csc309_a3/)

To push changes to preview:
```
$ git checkout gh-pages // go to the gh-pages branch
$ git rebase master // bring gh-pages up to date with master
$ git push origin gh-pages // commit the changes
$ git checkout master // return to the master branch
```

####Introduction
Given the recent announcement by Google to deprecate its famous Google Reader, there is a growing concern among savvy users about trusting other companies with their historical data. Forward thinking companies like Twitter have a strong RESTful API that allows users to explore the wealth of data they manage and even provide ways to download your entire archive of tweets.

Many users rely on Twitter’s favorites as a mechanism to bookmark tweets that link to interesting content elsewhere on the web. However, in order to avoid a potential downfall in the future, where those favorites could one day become unavailable, I’ve decided to retrieve a list with my favorites tweets as a JSON object.

####Description
Develop a client capable of reading a local JSON file and presenting the information within in a way that would make it easy to explore:

- The client needs to adhere to Responsive Design principles by providing at least 2 layouts depending on the width of the browser window.
- The client needs to present a main navigation window which allows for a quick exploration of content available. Secondary pop-up windows should be enabled to explore more details when available.
- The client needs to be able to manage a large number of favorites by providing some kind of pagination mechanism.
- The client should allow me to click-through any links by opening them in a new window. If you feel very confident, you can try to render the links within an iFrame.
- The client should allow me to learn more about the users that originally tweeted the content
- If available, images attached to the tweet should be visible either in the main navigation window or in one of the pop-ups.
- Other entities, such as places, hashtags and user mentions would be a great addition to the client, but are not mandatory

####Requirements

- Your client should be written in HTML5/CSS3 and use jQuery Mobile 1.3.
- Other than jQuery, no other frameworks or libraries are allowed unless approved by the professor.
- Your client should be optimized for mobile devices. This means working with events like “swipe” and “tap”, unique to touch interfaces.
- A good separation of concerns will be key when marking this assignment. jQuery Mobile promotes a good HTML structure. Follow their lead.
- This is a group assignment. Teams of 3 or 4 people.
- To encourage proper team work, your team should create a GIT repository for this project and all team members should commit work against it. Please use detailed comments.
- The sample JSON file provided is just for testing purposes. When evaluating the assignment we will use a much larger version. Assume up to 100 tweets could be available in the file.

####Deliverables

- Put all your project files in one directory, and archive the directory into a single file using tar or a similar utility. Submit your assignment using the CDF Submit system (only one member of each team should submit).
- Include a README file that includes the names of all your team members.
- Include a GIT.LOG file as generated from your GIT repository before submitting.
