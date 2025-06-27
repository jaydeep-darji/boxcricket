// Box Cricket Tournament Booking System
// Main JavaScript file to handle all functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the system
    initializeSchedule();
    setupEventListeners();
    
    // Show team registration modal on page load for new users
    if (!localStorage.getItem('hasRegisteredTeam')) {
        showTeamRegistrationModal();
    }
});

// Initialize schedule with time slots
function initializeSchedule() {
    const timeSlots = document.getElementById('timeSlots');
    const daySlots = document.getElementById('daySlots');
    
    // Clear existing content
    timeSlots.innerHTML = '';
    daySlots.innerHTML = '';
    
    // Create time slots from 10 AM to 12 AM (midnight)
    const startHour = 10;
    const endHour = 24; // 12 AM
    
    for (let hour = startHour; hour < endHour; hour++) {
        // Create time slot display (show in 1-hour increments)
        const timeSlot = document.createElement('div');
        timeSlot.className = 'time-slot';
        
        // Format time display
        const displayHour = hour % 12 || 12;
        const amPm = hour < 12 ? 'AM' : 'PM';
        timeSlot.textContent = `${displayHour} ${amPm}`;
        
        timeSlots.appendChild(timeSlot);
        
        // Create slots for each day of the week
        for (let day = 0; day < 7; day++) {
            const slot = document.createElement('div');
            slot.className = 'slot';
            slot.dataset.time = hour;
            slot.dataset.day = day;
            
            // Randomly assign status for demonstration
            const random = Math.random();
            if (random < 0.6) {
                slot.classList.add('available');
                slot.textContent = 'Available';
            } else if (random < 0.8) {
                slot.classList.add('booked');
                slot.textContent = 'Booked';
                slot.dataset.team = 'Team ' + Math.floor(Math.random() * 5 + 1);
            } else {
                slot.classList.add('pending');
                slot.textContent = 'Pending';
                slot.dataset.team = 'Team ' + Math.floor(Math.random() * 5 + 1);
            }
            
            daySlots.appendChild(slot);
        }
    }
}

// Set up event listeners
function setupEventListeners() {
    // Apply filters button
    document.getElementById('applyFilters').addEventListener('click', applyFilters);
    
    // Week navigation
    document.getElementById('prevWeek').addEventListener('click', navigateToPrevWeek);
    document.getElementById('nextWeek').addEventListener('click', navigateToNextWeek);
    
    // Register team button
    document.getElementById('registerTeam').addEventListener('click', showTeamRegistrationModal);
    
    // Create tournament button
    document.getElementById('createTournament').addEventListener('click', showCreateTournamentModal);
    
    // Close modal
    document.querySelector('.close-sch').addEventListener('click', closeModal);
    
    // Booking form submission
    document.getElementById('bookingForm').addEventListener('submit', handleBookingSubmission);
    
    // Add event listeners to all slots
    document.querySelectorAll('.slot').forEach(slot => {
        if (slot.classList.contains('available')) {
            slot.addEventListener('click', function() {
                showBookingModal(this);
            });
        }
    });
}

// Apply filters function
function applyFilters() {
    const venue = document.getElementById('venue').value;
    const date = document.getElementById('date').value;
    const status = document.getElementById('status').value;
    
    // Here you would typically make an API call to get filtered data
    // For demonstration, we'll just show a toast message
    showToast(`Filters applied: Venue=${venue}, Date=${date}, Status=${status}`);
    
    // Refresh the schedule with filtered data
    initializeSchedule();
}

// Navigate to previous week
function navigateToPrevWeek() {
    const currentWeekEl = document.getElementById('currentWeek');
    // In a real app, you would calculate the actual previous week
    currentWeekEl.textContent = "March 3 - 9, 2025";
    initializeSchedule();
}

// Navigate to next week
function navigateToNextWeek() {
    const currentWeekEl = document.getElementById('currentWeek');
    // In a real app, you would calculate the actual next week
    currentWeekEl.textContent = "March 17 - 23, 2025";
    initializeSchedule();
}

// Show booking modal
function showBookingModal(slot) {
    const modal = document.getElementById('bookingModal');
    const modalTitle = document.getElementById('modalTitle');
    
    // Get day and time from the slot
    const day = parseInt(slot.dataset.day);
    const time = parseInt(slot.dataset.time);
    
    // Calculate the date
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const currentWeekText = document.getElementById('currentWeek').textContent;
    
    // Format time display
    const displayHour = time % 12 || 12;
    const amPm = time < 12 ? 'AM' : 'PM';
    const timeDisplay = `${displayHour}:00 ${amPm} - ${(displayHour + 1) % 12 || 12}:00 ${time + 1 < 12 ? 'AM' : 'PM'}`;
    
    // Set modal title and fields
    modalTitle.textContent = 'Book a Slot: ' + days[day];
    document.getElementById('slotDate').value = days[day] + ', ' + currentWeekText.split(' - ')[0];
    document.getElementById('slotTime').value = timeDisplay;
    
    // Show duration options
    showDurationOptions();
    
    // Show the modal
    modal.style.display = 'block';
}

// Show duration options
function showDurationOptions() {
    // Create duration selection if it doesn't exist
    if (!document.getElementById('slotDuration')) {
        const durationGroup = document.createElement('div');
        durationGroup.className = 'form-group-sch';
        
        const label = document.createElement('label');
        label.setAttribute('for', 'slotDuration');
        label.textContent = 'Duration';
        
        const select = document.createElement('select');
        select.id = 'slotDuration';
        
        const options = [
            { value: '1', text: '1 Hour - ₹400' },
            { value: '2', text: '2 Hours - ₹700' },
            { value: '3', text: '3 Hours - ₹900' }
        ];
        
        options.forEach(option => {
            const optElement = document.createElement('option');
            optElement.value = option.value;
            optElement.textContent = option.text;
            select.appendChild(optElement);
        });
        
        durationGroup.appendChild(label);
        durationGroup.appendChild(select);
        
        // Insert after slot time
        const slotTimeGroup = document.getElementById('slotTime').parentElement;
        slotTimeGroup.parentElement.insertBefore(durationGroup, slotTimeGroup.nextSibling);
    }
}

// Close modal
function closeModal() {
    document.getElementById('bookingModal').style.display = 'none';
}

// Handle booking submission
function handleBookingSubmission(e) {
    e.preventDefault();
    
    const team = document.getElementById('teamSelect').value;
    const opponents = document.getElementById('opponents').value;
    const duration = document.getElementById('slotDuration').value;
    
    // Check if a team is selected
    if (!team) {
        showToast('Please select a team', 'error');
        return;
    }
    
    // Show payment modal
    showPaymentModal(duration);
}

// Show payment modal
function showPaymentModal(duration) {
    // Close booking modal
    closeModal();
    
    // Create payment modal if it doesn't exist
    if (!document.getElementById('paymentModal')) {
        const paymentModal = document.createElement('div');
        paymentModal.id = 'paymentModal';
        paymentModal.className = 'modal-sch';
        
        // Calculate amount based on duration
        let amount = 800;
        if (duration === '2') amount = 700;
        if (duration === '3') amount = 900;
        
        paymentModal.innerHTML = `
            <div class="modal-content-sch">
                <span class="close-payment close-sch">&times;</span>
                <h3>Payment</h3>
                <div class="payment-info">
                    <p>Booking Summary:</p>
                    <p><strong>Duration:</strong> ${duration} hour(s)</p>
                    <p><strong>Amount:</strong> ₹${amount}</p>
                </div>
                <div class="payment-methods">
                    <h4>Select Payment Method</h4>
                    <div class="payment-options">
                        <div class="payment-option">
                            <input type="radio" name="paymentMethod" id="upi" value="upi" checked>
                            <label for="upi">UPI</label>
                        </div>
                        <div class="payment-option">
                            <input type="radio" name="paymentMethod" id="card" value="card">
                            <label for="card">Credit/Debit Card</label>
                        </div>
                        <div class="payment-option">
                            <input type="radio" name="paymentMethod" id="qr" value="qr">
                            <label for="qr">QR Code</label>
                        </div>
                    </div>
                </div>
                <div class="payment-details">
                    <div id="upi-details" class="payment-detail-section">
                        <div class="form-group-sch">
                            <label for="upiId">UPI ID</label>
                            <input type="text" id="upiId" placeholder="yourname@upi">
                        </div>
                    </div>
                    <div id="card-details" class="payment-detail-section" style="display:none;">
                        <div class="form-group-sch">
                            <label for="cardNumber">Card Number</label>
                            <input type="text" id="cardNumber" placeholder="1234 5678 9012 3456">
                        </div>
                        <div class="form-group-sch row">
                            <div class="col">
                                <label for="expiryDate">Expiry Date</label>
                                <input type="text" id="expiryDate" placeholder="MM/YY">
                            </div>
                            <div class="col">
                                <label for="cvv">CVV</label>
                                <input type="text" id="cvv" placeholder="123">
                            </div>
                        </div>
                        <div class="form-group-sch">
                            <label for="cardName">Name on Card</label>
                            <input type="text" id="cardName" placeholder="JOHN SMITH">
                        </div>
                    </div>
                    <div id="qr-details" class="payment-detail-section" style="display:none;">
                        <div class="qr-container">
                            <div class="qr-code">
                                <div class="qr-placeholder">
                                    <!-- QR code placeholder -->
                                    <div style="width:200px;height:200px;border:1px solid #ccc;margin:0 auto;display:flex;justify-content:center;align-items:center;">
                                        QR Code
                                    </div>
                                </div>
                                <p class="qr-instructions">Scan this QR code with any UPI app to pay</p>
                            </div>
                        </div>
                    </div>
                </div>
                <button id="completePayment" class="btn-sch">Complete Payment</button>
            </div>
        `;
        
        document.body.appendChild(paymentModal);
        
        // Add event listeners for payment modal
        document.querySelector('.close-payment').addEventListener('click', function() {
            paymentModal.style.display = 'none';
        });
        
        // Payment method selection
        document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
            radio.addEventListener('change', function() {
                document.querySelectorAll('.payment-detail-section').forEach(section => {
                    section.style.display = 'none';
                });
                document.getElementById(this.value + '-details').style.display = 'block';
            });
        });
        
        // Complete payment button
        document.getElementById('completePayment').addEventListener('click', function() {
            paymentModal.style.display = 'none';
            completeBooking();
        });
    }
    
    // Show the payment modal
    document.getElementById('paymentModal').style.display = 'block';
}

// Complete booking
function completeBooking() {
    showToast('Payment successful! Slot booked.');
    
    // In a real application, you would update the database
    // For demonstration, we'll just refresh the schedule
    setTimeout(() => {
        initializeSchedule();
    }, 1000);
}

// Team Registration Modal
function showTeamRegistrationModal() {
    // Create team registration modal if it doesn't exist
    if (!document.getElementById('teamRegistrationModal')) {
        const registrationModal = document.createElement('div');
        registrationModal.id = 'teamRegistrationModal';
        registrationModal.className = 'modal-sch';
        
        registrationModal.innerHTML = `
            <div class="modal-content-sch">
                <span class="close-registration close-sch">&times;</span>
                <h3>Register New Team</h3>
                <form id="teamRegistrationForm">
                    <div class="form-group-sch">
                        <label for="teamName">Team Name</label>
                        <input type="text" id="teamName" required placeholder="Enter your team name">
                    </div>
                    <div class="form-group-sch">
                        <label for="captainName">Captain Name</label>
                        <input type="text" id="captainName" required placeholder="Enter captain's name">
                    </div>
                    <div class="form-group-sch">
                        <label for="contactNumber">Contact Number</label>
                        <input type="tel" id="contactNumber" required placeholder="Enter contact number">
                    </div>
                    <div class="form-group-sch">
                        <label for="email">Email Address</label>
                        <input type="email" id="email" required placeholder="Enter email address">
                    </div>
                    <div class="form-group-sch">
                        <label>Team Members (6-8 players)</label>
                        <div id="teamMembers">
                            <div class="member-row">
                                <input type="text" class="member-name" placeholder="Player 1 name" required>
                            </div>
                            <div class="member-row">
                                <input type="text" class="member-name" placeholder="Player 2 name" required>
                            </div>
                            <div class="member-row">
                                <input type="text" class="member-name" placeholder="Player 3 name" required>
                            </div>
                            <div class="member-row">
                                <input type="text" class="member-name" placeholder="Player 4 name" required>
                            </div>
                            <div class="member-row">
                                <input type="text" class="member-name" placeholder="Player 5 name" required>
                            </div>
                            <div class="member-row">
                                <input type="text" class="member-name" placeholder="Player 6 name" required>
                            </div>
                        </div>
                        <button type="button" id="addPlayer" class="btn-sch" style="margin-top: 10px;">Add Player</button>
                    </div>
                    <button type="submit" class="btn-sch">Register Team</button>
                </form>
            </div>
        `;
        
        document.body.appendChild(registrationModal);
        
        // Add event listeners for registration modal
        document.querySelector('.close-registration').addEventListener('click', function() {
            registrationModal.style.display = 'none';
        });
        
        // Add player button
        document.getElementById('addPlayer').addEventListener('click', function() {
            const teamMembers = document.getElementById('teamMembers');
            const playerCount = teamMembers.children.length + 1;
            
            if (playerCount <= 8) {
                const memberRow = document.createElement('div');
                memberRow.className = 'member-row';
                memberRow.innerHTML = `<input type="text" class="member-name" placeholder="Player ${playerCount} name" ${playerCount <= 6 ? 'required' : ''}>`;
                teamMembers.appendChild(memberRow);
            } else {
                showToast('Maximum 8 players allowed', 'error');
            }
        });
        
        // Team registration form submission
        document.getElementById('teamRegistrationForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // In a real application, you would save the team to the database
            localStorage.setItem('hasRegisteredTeam', 'true');
            
            // Add the new team to the team selection dropdown
            const teamName = document.getElementById('teamName').value;
            const teamSelect = document.getElementById('teamSelect');
            const option = document.createElement('option');
            option.value = 'newTeam';
            option.textContent = teamName;
            teamSelect.appendChild(option);
            
            // Close the modal
            registrationModal.style.display = 'none';
            
            showToast('Team registered successfully!');
        });
    }
    
    // Show the registration modal
    document.getElementById('teamRegistrationModal').style.display = 'block';
}

// Show Create Tournament Modal
function showCreateTournamentModal() {
    // Create tournament modal if it doesn't exist
    if (!document.getElementById('tournamentModal')) {
        const tournamentModal = document.createElement('div');
        tournamentModal.id = 'tournamentModal';
        tournamentModal.className = 'modal-sch';
        
        tournamentModal.innerHTML = `
            <div class="modal-content-sch">
                <span class="close-tournament close-sch">&times;</span>
                <h3>Create Tournament</h3>
                <form id="tournamentForm">
                    <div class="form-group-sch">
                        <label for="tournamentName">Tournament Name</label>
                        <input type="text" id="tournamentName" required placeholder="Enter tournament name">
                    </div>
                    <div class="form-group-sch">
                        <label for="startDate">Start Date</label>
                        <input type="date" id="startDate" required>
                    </div>
                    <div class="form-group-sch">
                        <label for="endDate">End Date</label>
                        <input type="date" id="endDate" required>
                    </div>
                    <div class="form-group-sch">
                        <label for="teamCount">Number of Teams</label>
                        <select id="teamCount" required>
                            <option value="">Select team count</option>
                            <option value="4">4 Teams</option>
                            <option value="8">8 Teams</option>
                            <option value="16">16 Teams</option>
                        </select>
                    </div>
                    <div class="form-group-sch">
                        <label for="entryFee">Entry Fee (₹)</label>
                        <input type="number" id="entryFee" required placeholder="Enter entry fee">
                    </div>
                    <div class="form-group-sch">
                        <label for="tournamentRules">Tournament Rules</label>
                        <textarea id="tournamentRules" rows="4" placeholder="Enter tournament rules and regulations"></textarea>
                    </div>
                    <button type="submit" class="btn-sch">Create Tournament</button>
                </form>
            </div>
        `;
        
        document.body.appendChild(tournamentModal);
        
        // Add event listeners for tournament modal
        document.querySelector('.close-tournament').addEventListener('click', function() {
            tournamentModal.style.display = 'none';
        });
        
        // Tournament form submission
        document.getElementById('tournamentForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // In a real application, you would save the tournament to the database
            
            // Close the modal
            tournamentModal.style.display = 'none';
            
            showToast('Tournament created successfully!');
        });
    }
    
    // Show the tournament modal
    document.getElementById('tournamentModal').style.display = 'block';
}

// Show toast message
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    
    if (type === 'error') {
        toast.style.backgroundColor = 'var(----accent-color)';
    } else {
        toast.style.backgroundColor = 'var(----secondary-color)';
    }
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Add additional CSS for new components
function addAdditionalStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .row {
            display: flex;
            gap: 10px;
        }
        
        .col {
            flex: 1;
        }
        
        .member-row {
            margin-bottom: 10px;
        }
        
        .member-row input {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 6px;
        }
        
        .payment-options {
            display: flex;
            gap: 20px;
            margin: 15px 0;
        }
        
        .payment-option {
            display: flex;
            align-items: center;
            gap: 5px;
        }
        
        .qr-container {
            display: flex;
            justify-content: center;
            margin: 20px 0;
        }
        
        .qr-instructions {
            text-align: center;
            margin-top: 10px;
            font-size: 0.9rem;
            color: #666;
        }
        
        .payment-info {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        
        .payment-info p {
            margin: 5px 0;
        }
    `;
    
    document.head.appendChild(style);
}

// Call to add the additional styles
addAdditionalStyles();