# Getting Started

Welcome to your new project.

It contains these folders and files, following our recommended project layout:

File or Folder | Purpose
---------|----------
`app/` | content for UI frontends goes here
`db/` | your domain models and data go here
`srv/` | your service models and code go here
`package.json` | project metadata and configuration
`readme.md` | this getting started guide


## Next Steps

- Open a new terminal and run `cds watch`
- (in VS Code simply choose _**Terminal** > Run Task > cds watch_)
- Start adding content, for example, a [db/schema.cds](db/schema.cds).


## Learn More

Learn more at https://cap.cloud.sap/docs/get-started/.

cds bind -2 HANA-CAP-dev:SharedDevKey

<!-- Config Security -->
cf create-service xsuaa application equipment-transfer-backend-auth -c xs-security.json
cf create-service-key equipment-transfer-backend-auth default  

cf create-service-key equipment-transfer-backend-auth default  
cds bind -2 equipment-transfer-backend-auth:default

cds watch --profile hybrid
cds bind --exec -- npm start --prefix app/router

<!-- Create a Destination service instance and service key: -->
cf create-service destination lite equipment-transfer-backend-destination
cf create-service-key equipment-transfer-backend-destination equipment-transfer-backend-destination-key
cds bind -2 equipment-transfer-backend-xsuaa,equipment-transfer-backend-destination

<!-- cds deploy --to hana:equipment-transfer-backend -->

cf bind-service equipment-transfer-backend equipment-transfer-backend-auth
cf restage equipment-transfer-backend

# This will remove the latest commit and keep the changes in your working directory
git reset --soft HEAD~1

# This will remove the latest commit and discard the changes
git reset --hard HEAD~1

GIT

# Create a Patch Series for Multiple Commits
git format-patch -10 HEAD

# Apply the Patch Series to the Target Repository
git am ../0001-*.patch  # Adjust the path to the patch files if necessary

git am --continue

git push