# Interesting things to note

- Hosted on my personal server in my office on this address: https://nextcloud.noobtech.com/ellisdonwordle/
- It is hosted on Docker behind a NGINX reverse proxy over HTTPS using a Let's Encrypt cert
- The words to be guessed are generated on the back end, and the business logic for the guessing is also on the back end, preventing the ability for clients to cheat by looking at the javascript browser client code.
- The possible words to guess for this demo purposes is hard coded in the back end as follows `"apple", "brave", "crane", "drive", "eagle"`
  
# Docker


## To build dockerfile

```
docker build -t wordle-game .
```

## To run container
```
docker run -p 3001:3001 wordle-game
```

The static react files are served directly from the Node.js backend.

## To override root host URL
Set following environment variable
```
REACT_APP_API_URL=http://localhost:3001
```