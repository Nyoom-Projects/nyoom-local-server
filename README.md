# nyoom-local-server
This repo stores the local (client-side) server that runs Nyoom tasks. 
This server accepts commands from Nyoom-CLI (via a REST API), and forwards requests to a Nyoom-host-server (to schedule tasks for nyoom-local servers to execute).


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



# Deep-dive on how it works
## Adding a project:
1. Using the Nyoom-CLI; a user will execute `nyoom create project` which will prompt them for the minimum required information to create a Project on Nyoom
2. The CLI will call the _Nyoom-local-server (N-LS)_ with these parameters, and then:
3. N-LS will upload the project configuration to the centralized (remote) host. This project will then by sync'ed accross all Nodes, allowing any other linked PC to use the configuration. 

## Checking out a project:
1. Using the Nyoom-CLI; a user will execute `nyoom checkout project` which will prompt them for the project name.
2. Nyoom will list all available Nodes that can execute this command, and after the user selects the Node, then Nyoom will ask that Node to check whether the source code is already checked out. 
3. If not, Nyoom will prompt the user for a checkout directory (defaulting to what the Node has configured), and then send the Checkout task to that Node.
