// src/index.js

document.addEventListener("DOMContentLoaded", () => {

    const baseUrl = 'http://localhost:3000';

    function loadFirstFilm() {

        const url = `${baseUrl}/films/1`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok (${response.status})`);
                }
                return response.json();
            })
            .then(film => {

                const availableTickets = film.capacity - film.tickets_sold;

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
                    if (availableTickets <= 0) {
                        buyTicketButton.classList.add('disabled');
                        buyTicketButton.textContent = 'Sold Out';
                    } else {
                        buyTicketButton.classList.remove('disabled');
                        buyTicketButton.textContent = 'Buy Ticket';
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

                // Optionally, display an error message to the user
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

    loadFirstFilm();
});
