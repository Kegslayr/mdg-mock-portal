### deploy to amplify
1. Log in to AWS
2. Go to Amplify
3. Scroll down on the Get Started Page to the Deliver Get Started button
4. Select GitHub
5. Select repo and branch (mdg-mock-portal main)
6. Select defaults until Save and Deploy

### configure cli
1. npm install -g @aws-amplify/cli
2. amplify configure
3. region = us-west-2
4. create new IAM user (mdg-mock-portal-admin)
5. copy the secret access key (PK8Q/9XfUXCaub3ELqnxRmLERdHW+GLeIS1E3YJs)
6. copy access key id to clipboard
7. paste into command prompt
8. paste secret access key into prompt
9. leave profile name as default

### install a backend for authz
Note: amplify delete to wipe backend and start fresh
1. npm install aws-amplify @aws-amplify/ui-react
2. init amplify if not done from root dir - amplify init (select defaults except for region)
3. amplify add auth - default, email, done (amplify update auth if exists)
4. amplify push --y to push to aws server
5. 