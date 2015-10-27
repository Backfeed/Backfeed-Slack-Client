Hi!

If you’re here it means you’re about to install Backfeed’s Chrome Extension for Slack. Our extension adds a layer of functionality to Slack which allows you to manage and take part in collaborative projects.

Every channel in Slack can be turned into a collaborative project which allows any team member to join and contribute to it, and proportionally divides the mutually created value between all participating project members.

This manual will guide you through the processes of starting a project, joining one, and managing it within the larger collaboration.

Before anything else, you will need to install the Backfeed Extension by following [this ](https://chrome.google.com/webstore/detail/backfeed-slack-extension/feglgahjbjnabofomkpmoacillfnpjpb)[link](https://chrome.google.com/webstore/detail/backfeed-slack-extension/feglgahjbjnabofomkpmoacillfnpjpb) to where it lives on Chrome’s Web Store. Now, in the top right corner, click the ![](https://raw.githubusercontent.com/Backfeed/Backfeed-Slack-Client/master/assets/manual/extension-install-button.png) button.

When it’s done installing, a new ![add to button](https://raw.githubusercontent.com/Backfeed/Backfeed-Slack-Client/master/assets/icon16.png) button will appear on the right-hand side of Chrome’s address bar. Click it, and a small screen will pop up with a big green ‘Authorize with Slack’ button. Press it, and enter your Slack credentials.

Now the Extension is fully installed! If you look around Slack now, you might notice some new buttons.

Good.

Let’s get to the fun parts.
* * *
## Philosophy & Mechanism

Every channel can be turned into a project, and **every project is its own collaboration**, acting freely and independently from the other projects. A project can be a sub-project of another project. For example #branding might be a sub-project of #design which is a subproject of #general. Every project runs on its own set of tokens and reputation, which are earned by contributing to the project or evaluating contributions made by other members.


***Tokens* are a measure of value**. Tokens are used to distribute the value created by an organization to all the people who contribute to it. For example, project_design might be a token used to divide the value of an organization design team between its contributing members. This enables designers to evaluate designers, programmers to evaluate programmers, and all members to evaluate high-level projects (for example, the iOS app when it’s ready for review). 

***Reputation* is a measure of influence** within a project, or how much weight a member’s vote carries when it comes to making decisions and evaluating contributions in the project.

For every contribution, the contributors are being awarded **newly generated tokens and reputation**.

During the evaluation process, **reputation flows** from evaluators who vote late and poorly to evaluators who vote early and accurately. For example, if a member was the first to evaluate the iOS app at 500,000 BTC, and the entire community evaluated it at 540,000 BTC, she will gain reputation (on account of a second member who evaluated it at 80,000 BTC) and her vote would hold more weight in the next evaluation. 

When a project’s members decide they have reached a significant milestone, they can take all the contributions made so far, bundle them together, and submit them as a single contribution to a second, higher-level project. We call these bundled contributions **"milestones"**. For example, when the #design project finished a website design (after 25 contributions by various project members), they can submit the finished design to the #website project for evaluation.

When a milestone is submitted, **all the tokens earned for the project are exchanged for the tokens of the higher-level project’s** and proportionally divided between all the project members.

The tokens of the highest-level project must have real-world value, like Pound Sterling originally being exchangeable for a pound of sterling. Even a small contribution like fixing a typo in the website’s homepage is ultimately rewarded with tokens.

## Founding a Project

With most collaborative projects, there is a group of people who bring the project to where it is before its creation in the Backfeed Extension. We call these people the project’s **founders.** ![](https://raw.githubusercontent.com/Backfeed/Backfeed-Slack-Client/master/assets/manual/add-collab-project.jpg)

Before starting a project, **make sure all the founders agree on an initial distribution of value and reputation between themselves, and on the combined value of their prior efforts.** 

To make evaluations easier we **strongly suggest treating all project tokens as either being worth 1 known currency unit** (ILS, USD, BTC, etc). This also gives a reference point for evaluating contributions across projects.

Once you all agree on the initial distribution, you select the appropriate Slack channel, open the channel menu (on the top left of the screen, immediately next to the sidebar), and click on ‘Start a Collaborative Project’, opening this page:

![](https://raw.githubusercontent.com/Backfeed/Backfeed-Slack-Client/master/assets/screens/new-project.png)

Under General Settings, you can choose the name of the token your team will use, like QAcoin, FeedBucks, or BrandDesignCoins. Next, you can choose the 3-letter symbol for your currency, which are things like USD, FB$, or BDC.

Next, you can choose how many tokens will be divided between the founders for their work until this point. Under Founding Contributors, choose how the tokens and reputation will be divided between each founder.

Now you can fine-tune how reputation flows from member to member in this project. Please note that these are advanced options: you don’t need to change them for your project to operate smoothly.

There are currently 2 parameters you can change.

The first one determines how close to each other evaluations need to be for the system to consider them similar to each other. Are evaluations for 100 tokens and 110 tokens related to each other, or are they entirely different? Are evaluations for 100 and 1000? Usually, projects that deal in smaller amounts of tokens need more specific evaluations.

The second one allows you to choose how quickly reputation will flow from the project’s founders to new members, or how much new members have to contribute to have as much reputation as a founder. Founders who want to give over control of the project slower or faster have the option to do so.

Now press the button at the bottom, and you’re done! Your new collaborative project is all set up. Here’s what you do next.

## Contributions

Contributions are anything that can potentially provide value to a project. Once a contribution is submitted, any project member can evaluate how many *tokens* the contribution is worth. As soon as a consensus is achieved (see Evaluations below), new *tokens* and *reputation* are generated and divided between the contributors. further evaluations can generate more reputation and tokens to the contributors if they increase the median of all evaluations. ![](https://raw.githubusercontent.com/Backfeed/Backfeed-Slack-Client/master/assets/manual/submit-contrib.jpg)

Here’s how you submit contributions. In the relevant #project, press the + button to the left of the chat box and choose the ‘Submit Contribution’ button. 

![](https://raw.githubusercontent.com/Backfeed/Backfeed-Slack-Client/master/assets/screens/new-contribution.png)

Give your contribution a title and describe it to the team as clearly as possible. In the description include links to relevant resources. If you weren’t the only contributor, add the other contributors and their relative part in the contribution.

As soon as you press the ‘Add Contribution’ button, your contribution is automatically submitted and declared by a bot in the project’s #channel. Next, you will get the chance to evaluate your contribution. As a contribution creator, your interest is always to be the first to evaluate your contribution in order to maximize your potential reputation gain. ![](https://raw.githubusercontent.com/Backfeed/Backfeed-Slack-Client/master/assets/manual/contrib-announcement-evaluate.jpg)

## Evaluations

Every member can evaluate a contribution by pressing the "evaluate" button next to the contribution declaration in the project’s Slack channel. 

Members can only evaluate a contribution once. Making an evaluation costs you reputation: the earlier you vote, the less it costs. The first evaluation is free.

![](https://raw.githubusercontent.com/Backfeed/Backfeed-Slack-Client/master/assets/screens/new-evaluation.png)

Reputation flows to members who vote early and in alignment with the members who vote after them. How close evaluations need to be to be considered aligned is one of the advanced parameters defined at the beginning of a project.

**All evaluations are positive**. Evaluating a contribution means you think it’s good. The worst evaluation you can make is not to evaluate at all.

Once a consensus is achieved when members holding 51% or more of a project’s reputation have made an evaluation, the value of the contribution is determined and the contributors receive tokens and reputation according to the value of the contribution.

Once you evaluate a contribution, the button next to the declaration will change into a "status" button. ![](https://raw.githubusercontent.com/Backfeed/Backfeed-Slack-Client/master/assets/manual/contrib-announcement-status.jpg)

## Milestones

Finally, when project members decide they’ve reached a significant milestone in the project’s lifecycle, they can take all the contributions made so far and submit them as a single contribution to another, higher-level project. 

To suggest submitting a milestone, you can click the project’s name on the top left of the screen and choose ‘Submit Milestone’.![](https://raw.githubusercontent.com/Backfeed/Backfeed-Slack-Client/master/assets/manual/submit-milestone.jpg)

You need to give the milestone a title and provide a description for it, just like a normal contribution. A milestone contains all the contributions made since the last milestone. The contributors list is automatically generated from all the project members, and their proportions are calculated based on their share in the project’s tokens. ![](https://raw.githubusercontent.com/Backfeed/Backfeed-Slack-Client/master/assets/screens/new-milestone.png)

## Status Pages

There are status pages for projects, team members, and contributions, which are useful to know about, and have little question marks inside each of them that explain what everything means.

You can get to a project’s status page by clicking on the project’s name on the top left of the page, directly to the right of the sidebar, and choosing ‘project status’. ![](https://raw.githubusercontent.com/Backfeed/Backfeed-Slack-Client/master/assets/manual/project-status.jpg)

You can get to a team member’s status page by clicking on her name anywhere in Slack and choosing ‘Collaborator Overview’.

You can get to a contribution status page only after you’ve evaluated it, and then through the ‘status’ button next to its bot declaration in the feed.
* * *
That’s it! This how the Backfeed extension works. 

Now go! start a collaborative project, create a new feature for your organization and get one step closer to your goals. We would love to stay involved and help you on your way. This is a very early release and we would LOVE to hear anything and everything you have to say about our tool.. Send us an email at [info@backfeed.cc](mailto:info@backfeed.cc)!

And if you need help with anything, or even if you just want someone to talk to, there’s a Backfeed presence only an @backfeed away from anywhere on Slack. Please, talk to us. It’s never a hassle. It’s always a pleasure. It’s what we’re here for.

Good luck!
