# Notes


## To build dockerfile

```
docker build -t wordle-game .
```

## To run container
```
docker run -p 3001:3001 wordle-game
```

The static react files are served directly from the Node.js backend.
