# nyoom-local-server
This repo stores the local (client-side) server that runs Nyoom tasks. 
This server commands from Nyoom-CLI (via a REST API), and either forwards tasks to aa Nyoom-host-server (to shedule tasks for non-local machines) or runs the tasks locally.


Since most of the magic happens in this layer, I will use this as the primary source of explanation as to how Nyoom works.


## Goal
The goal of Nyoom is to store a list of programming Projects, with the added capability of basic source control, compilation and deployment of these Projects.


#### As a User, Nyoom will allow you to:
- Add projects to Nyoom (this is a personal list that is unique to your account)
- Schedule tasks for a Nyoom Node* to execute
- Sync your project list to a centralized server

*(a Node is any PC running _Nyoom-local-server_ that is linked to your account)


#### Each project may store the following information:
- The name of the project
- The GIT URL used to checkout the project
- Any initialization scripts required to compile / build this project (to prepare it for deployment)
- Any deployment scripts required to deploy the project
- A URL to use as a Health check for the current deployment
- A URL to use to determine what version of the project is currently deployed
- A script to determine what is the version of the source code
