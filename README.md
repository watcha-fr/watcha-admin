# Watcha Admin console

## Building in debug

`npm start`

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
* everything should work

## How was this build ? How can I get more information ?

See earlier version(s) of this file in Git to see how it was created with [Create React App](https://github.com/facebookincubator/create-react-app), and how to use it 
