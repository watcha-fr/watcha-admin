# Watcha Admin console

## Building in debug

`npm start`

## Doing a release

Running the script https://github.com/watcha-fr/devops/blob/dev/prod/watchaadmin-release.sh should do the job, including tagging and upload to release repository.

## Using in dev

To connect to a specific Home core server, define `REACT_APP_CORE` environement variable, e.g. run:

`REACT_APP_CORE=http://mycore.watcha.fr npm start`

## Using with Riot

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
* build riot using `npm run build` in the riot folrder
* build this project using `npm run build` here
* everything works :)

Alternatively, it should be able to run with 'npm start' for both riot (i.e. make it run on port 7001) and watcha-admin make it run on port 1664),and a config like:

```
server {
    listen 7001;
    location / {
            proxy_pass http://localhost:8080;
            index index.html;
    }
    location /admin {    
            proxy_pass http://localhost:1664;
            sub_filter "/static" "/admin/static";
            proxy_set_header Accept-Encoding "";
            sub_filter_once off;
            sub_filter_types *;
    } 
}
```

but it doesn't seem to be working ( http://localhost:7001/admin/static/js/bundle.js is not serving the .js...)

## How was this build ? How can I get more information ?

See earlier version(s) of this file in Git to see how it was created with [Create React App](https://github.com/facebookincubator/create-react-app), and how to use it 
