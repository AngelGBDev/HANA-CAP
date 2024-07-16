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

cds bind -2 equipment-transfer-management-dev:SharedDevKey

cf create-service xsuaa application equipment-transfer-management-auth -c xs-security.json
cf create-service-key equipment-transfer-management-auth default  
cds watch --profile hybrid
cds bind --exec -- npm start --prefix app/router

git credential-cache exit