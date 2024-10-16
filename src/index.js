// src/index.js

document.addEventListener("DOMContentLoaded", () => {
    const baseUrl = 'http://localhost:3000';

     //Fetches and displays the details of a specific film.
    function loadFilmDetails(filmId) {
        const url = `${baseUrl}/films/${filmId}`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok (${response.status})`);
                }
                return response.json();
            })
            .then(film => {
                // Calculate available tickets
                let availableTickets = film.capacity - film.tickets_sold;

                // Update Title
                const titleElement = document.getElementById('title');
                if (titleElement) {
                    titleElement.textContent = film.title;
                }

                // Update Runtime
                const runtimeElement = document.getElementById('runtime');
                if (runtimeElement) {
                    runtimeElement.textContent = `${film.runtime} minutes`;
                }

                // Update Description
                const descriptionElement = document.getElementById('film-info');
                if (descriptionElement) {
                    descriptionElement.textContent = film.description;
                }

                // Update Showtime
                const showtimeElement = document.getElementById('showtime');
                if (showtimeElement) {
                    showtimeElement.textContent = film.showtime;
                }

                // Update Available Tickets
                const ticketNumElement = document.getElementById('ticket-num');
                if (ticketNumElement) {
                    ticketNumElement.textContent = availableTickets;
                }

                // Update Buy Ticket Button
                const buyTicketButton = document.getElementById('buy-ticket');
                if (buyTicketButton) {
                    // Reset button state
                    buyTicketButton.classList.remove('disabled');
                    buyTicketButton.textContent = 'Buy Ticket';

                    if (availableTickets <= 0) {
                        buyTicketButton.classList.add('disabled');
                        buyTicketButton.textContent = 'Sold Out';
                    } else {
                        // Remove any existing event listeners to prevent multiple bindings
                        const newBuyTicketButton = buyTicketButton.cloneNode(true);
                        buyTicketButton.parentNode.replaceChild(newBuyTicketButton, buyTicketButton);

                        // Add click event listener for buying a ticket
                        newBuyTicketButton.addEventListener('click', () => {
                            if (availableTickets > 0) {
                                availableTickets -= 1;
                                ticketNumElement.textContent = availableTickets;

                                if (availableTickets === 0) {
                                    newBuyTicketButton.classList.add('disabled');
                                    newBuyTicketButton.textContent = 'Sold Out';
                                }
                            }
                        });
                    }
                }

                // Update Poster Image
                const posterImg = document.getElementById('poster');
                if (posterImg) {
                    posterImg.src = film.poster;
                    posterImg.alt = film.title;
                }
            })
            .catch(error => {
                console.error('Error fetching film data:', error);

                // Display an error message to the user
                const showingElement = document.getElementById('showing');
                if (showingElement) {
                    showingElement.innerHTML = `
                        <div class="ui red message">
                            Failed to load film data. Please try again later.
                        </div>
                    `;
                }
            });
    }

     //Fetches and populates the list of all films in the menu.
     
    function loadFilmsList() {
        const url = `${baseUrl}/films`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok (${response.status})`);
                }
                return response.json();
            })
            .then(films => {
                const filmsList = document.getElementById('films');
                if (!filmsList) {
                    console.error('Element with id "films" not found.');
                    return;
                }

                // Remove the placeholder <li> element if it exists
                const placeholderLi = filmsList.querySelector('li');
                if (placeholderLi) {
                    filmsList.removeChild(placeholderLi);
                }

                // Iterate through the films array and create <li> elements
                films.forEach(film => {
                    const li = document.createElement('li');
                    li.classList.add('film', 'item');
                    li.textContent = film.title;
                    // Set a data attribute with the film's ID for future use
                    li.setAttribute('data-id', film.id);
                    filmsList.appendChild(li);

                    // Add click event listener to load film details when clicked
                    li.addEventListener('click', () => {
                        loadFilmDetails(film.id);
                    });
                });
            })
            .catch(error => {
                console.error('Error fetching films list:', error);

                //display an error message to the user
                const filmsList = document.getElementById('films');
                if (filmsList) {
                    filmsList.innerHTML = `
                        <li class="ui red message">
                            Failed to load films list. Please try again later.
                        </li>
                    `;
                }
            });
    }

    // Initialize the application by loading the first film and the films list
    loadFilmDetails(1);
    loadFilmsList();
});
