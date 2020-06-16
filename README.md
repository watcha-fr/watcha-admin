# Watcha Admin console

## Building in debug

```
cd ..
git clone git@github.com:watcha-fr/matrix-js-sdk.git
cd matrix-js-sdk
yarn install
cd ../watcha-admin
yarn install
cd node_modules
ln -s ../../matrix-js-sdk
cd ..
# will try to start against a local Synapse -- see below to run against a different one
yarn start
```

## Doing a release

Running https://github.com/watcha-fr/devops/blob/dev/build/watchaadmin.sh should do the job, including tagging and upload to release repository.

See also https://github.com/watcha-fr/devops/blob/dev/prod/watchaadmin-install.sh on how it is installed in production

## Using in dev

To connect to a specific Synapse home server, define the `REACT_APP_CORE` environment variable, e.g. run:

`REACT_APP_CORE=https://dev-core.watcha.fr yarn start`

## Using with Riot: simple setup

Requires a rebuild every time, not really practical in dev

* install nginx
* use a config file like this (remove all other servers):

```
server {
    listen 7001;
    root /Users/francois/watcha/src/riot-web/webapp;
    index index.html;
    location /admin {
       alias /Users/francois/watcha/src/watcha-admin/build/;
    }
}
```
* build riot using `yarn build` in the riot folrder
* build this project using `yarn build` here
* everything works :)

## Using with Riot: reverse proxy

* install nginx
* add the file `devops.git/dev/watcha.conf` to your nginx install (follow the instructions in it)
* you can comment the `include nextcloud.conf;` in that file, if you don't need nextcloud

## How was this build ? How can I get more information ?

See earlier version(s) of this file in Git to see how it was created with [Create React App](https://github.com/facebookincubator/create-react-app), and how to use it 
