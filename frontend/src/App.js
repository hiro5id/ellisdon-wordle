/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
    // Set up some internal state using react's useState capability
    const [grid, setGrid] = useState(Array(5).fill().map(() => Array(5).fill({ letter: '', status: 'white' })));
    const [currentRow, setCurrentRow] = useState(0);
    const [currentCol, setCurrentCol] = useState(0);
    const [gameFinished, setGameFinished] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [winMessage, setWinMessage] = useState('');
    const [userId, setUserId] = useState(null);

    const API_URL = process.env.REACT_APP_API_URL;
    
    React.useEffect(() => {
        const fetchNewWord = async () => {
            try {
                const url = API_URL ? `${API_URL}/ellisdonwordle/new-word` : '/ellisdonwordle/new-word';
                const response = await axios.get(url);
                setUserId(response.data.userId);
            } catch (error) {
                console.error('Error fetching new word:', error);
            }
        };

        fetchNewWord();
    }, [API_URL]);

    const handleKeyPress = async (event) => {
        // Only proceed if we have not guessed all 5 columns in all 5 rows
        if (!gameFinished && currentRow < 5 && currentCol < 5) {
            // Extract keypress from the event
            const letter = event.key.toLowerCase();

            // check that keypress is within a expected set of characters
            if (/^[a-z]$/.test(letter)) {
                try {
                    // Make server request to guess the key press
                    const url = API_URL ? `${API_URL}/ellisdonwordle/guess` : '/ellisdonwordle/guess';
                    const response = await axios.post(url, {
                        userId,
                        letter,
                        position: currentCol
                    });

                    // Lets make a shallow copy of the grid using spread operator to spread it into a new array
                    const newGrid = [...grid];
                    // Lets update the status of the new grid using the results from the server
                    newGrid[currentRow][currentCol] = { letter, status: response.data.status };
                    // update the internal state of our grid
                    setGrid(newGrid);

                    if (currentCol < 4) {
                        // We are not past the end of the current row so just iterate the column by one
                        setCurrentCol(currentCol + 1);
                    } else {
                        // Check if user guessed right
                        if (newGrid[currentRow].every(cell => cell.status === 'correct')) {
                            setWinMessage('You win, reload page to start again');
                            setGameFinished(true);
                        } else {
                            // we are in a new row so lets iterate the row by one
                            setCurrentRow(currentRow + 1);
                            // we need to reset the current column back to zero if we are in a new row
                            setCurrentCol(0);
                            // Check fo game finished condition
                            if (currentRow === 4) {
                                setGameFinished(true);
                            }
                        }                       
                    }
                    setErrorMessage(''); // Clear error message if request is successful
                } catch (error) {
                    setErrorMessage(`Error calling guess API: ${error}`)
                }
            }
        }
    };

    // Use react's effect hook to run our custom function to register handleKeyPress for every keyboard press.
    // This registration will happen after every render or when dependencies change
    // To avoid memory leaks we will also remove the event listener as a cleanup function
    React.useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [currentRow, currentCol, gameFinished]);

    // Render the 5x5 grid by iterating over each row and column from the "grid" react state we set up earlier
    // We will use "getColor" helper function to set the background color based on the state value in "grid" array
    return (
        <div className="App">
            <div className="grid">
                {grid.map((row, rowIndex) => (                    
                    <div className="row" key={rowIndex}>
                        {row.map((cell, colIndex) => (
                            <div
                                className="cell"
                                key={colIndex}
                                style={{ backgroundColor: getColor(cell.status) }}
                            >
                                {cell.letter}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            {winMessage && <div className="message">{winMessage}</div>}
            {gameFinished && !winMessage && <div className="message">You did not guess the word, reload page to start again with a new word</div>}
            {errorMessage && <div className="error-message">{errorMessage}</div>}
        </div>
    );
};

const getColor = (status) => {
    switch (status) {
        case 'correct':
            return 'green';
        case 'present':
            return 'yellow';
        case 'absent':
            return 'gray';
        default:
            return 'white';
    }
};

export default App;
