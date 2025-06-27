// Complete Tournament Registration System
// Team Registration and Tournament Creation with Payment Integration

document.addEventListener('DOMContentLoaded', function() {
    // Configuration
    const CONFIG = {
        TEAM: {
            MIN_PLAYERS: 6,
            MAX_PLAYERS: 16,
            REGISTRATION_FEE: 500,
            PAYMENT_URL: "paymentteam.html"
        },
        TOURNAMENT: {
            CREATION_FEE: 1000,
            PAYMENT_URL: "paymenttournament.html"
        },
        HOME_PAGE_URL: "index.php",
        API_ENDPOINTS: {
            REGISTER_TEAM: './backend/registerTeam.php',
            CREATE_TOURNAMENT: './backend/createTournament.php'
        }
    };

    // Global variables
    let playerCount = 0;
    let isSubmitting = false;

    // =======================
    // TEAM REGISTRATION LOGIC
    // =======================

    // Initialize team registration modal
    function initializeTeamRegistration() {
        const openBtn = document.getElementById("openRegistrationBtn");
        const closeBtn = document.getElementById("closeModal");
        const modal = document.getElementById("registrationModal");
        const addPlayerBtn = document.getElementById("addPlayerBtn");
        const teamForm = document.getElementById("teamForm");
        const removePlayerBtns = document.querySelectorAll('.remove-player-btn');

        if (openBtn) {
            openBtn.addEventListener("click", openTeamRegistrationModal);
        }

        if (closeBtn) {
            closeBtn.addEventListener("click", closeTeamRegistrationModal);
        }

        if (addPlayerBtn) {
            addPlayerBtn.addEventListener("click", addPlayer);
        }

        if (teamForm) {
            teamForm.addEventListener("submit", handleTeamRegistration);
        }

        // Close modal when clicking outside
        if (modal) {
            modal.addEventListener("click", function(e) {
                if (e.target === modal) {
                    closeTeamRegistrationModal();
                }
            });
        }
    }

    // Open team registration modal
    function openTeamRegistrationModal() {
        const modal = document.getElementById("registrationModal");
        if (modal) {
            modal.style.display = "flex";
            document.body.classList.add('modal-open');
            resetTeamForm();
        }
    }

    // Close team registration modal
    function closeTeamRegistrationModal() {
        const modal = document.getElementById("registrationModal");
        if (modal) {
            modal.style.display = "none";
            document.body.classList.remove('modal-open');
        }
    }

    // Reset team form to initial state
    function resetTeamForm() {
        playerCount = 0;
        const container = document.getElementById("playersContainer");
        const playerCountLabel = document.getElementById("playerCountLabel");
        const addPlayerBtn = document.getElementById("addPlayerBtn");

        if (container) {
            container.innerHTML = "";
        }

        if (playerCountLabel) {
            playerCountLabel.innerText = `(${playerCount}/${CONFIG.TEAM.MAX_PLAYERS} players)`;
        }

        if (addPlayerBtn) {
            addPlayerBtn.disabled = false;
            addPlayerBtn.textContent = "Add Player";
        }

        updatePlayerCountDisplay();
    }

    // Add player input field
    function addPlayer() {
        if (playerCount >= CONFIG.TEAM.MAX_PLAYERS) {
            showAlert(`Maximum ${CONFIG.TEAM.MAX_PLAYERS} players allowed.`);
            return;
        }

        playerCount++;
        const container = document.getElementById("playersContainer");
        
        if (!container) return;

        // Create player input container
        const playerDiv = document.createElement("div");
        playerDiv.className = "player-input-group";
        playerDiv.style.cssText = `
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            gap: 10px;
        `;

        // Create input field
        const input = document.createElement("input");
        input.type = "text";
        input.name = `player${playerCount}`;
        input.placeholder = `Player ${playerCount} Name`;
        input.required = true;
        input.style.cssText = `
            flex: 1;
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
        `;

        // Create remove button
        const removeBtn = document.createElement("button");
        removeBtn.type = "button";
        removeBtn.textContent = "×";
        removeBtn.className = "remove-player-btn";
        removeBtn.style.cssText = `
            background: #ff4757;
            color: white;
            border: none;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            font-weight: bold;
        `;

        // Add remove functionality
        removeBtn.addEventListener("click", function() {
            removePlayer(playerDiv);
        });

        // Append elements
        playerDiv.appendChild(input);
        playerDiv.appendChild(removeBtn);
        container.appendChild(playerDiv);

        updatePlayerCountDisplay();
        
        // Disable add button if max players reached
        if (playerCount >= CONFIG.TEAM.MAX_PLAYERS) {
            const addPlayerBtn = document.getElementById("addPlayerBtn");
            if (addPlayerBtn) {
                addPlayerBtn.disabled = true;
                addPlayerBtn.textContent = `Max Players Reached (${CONFIG.TEAM.MAX_PLAYERS})`;
            }
        }
    }

    // Remove player input field
    function removePlayer(playerDiv) {
        if (playerDiv && playerDiv.parentNode) {
            playerDiv.parentNode.removeChild(playerDiv);
            playerCount--;
            updatePlayerCountDisplay();
            renumberPlayerInputs();

            // Re-enable add button if below max
            const addPlayerBtn = document.getElementById("addPlayerBtn");
            if (addPlayerBtn && playerCount < CONFIG.TEAM.MAX_PLAYERS) {
                addPlayerBtn.disabled = false;
                addPlayerBtn.textContent = "Add Player";
            }
        }
    }

    // Update player count display
    function updatePlayerCountDisplay() {
        const playerCountLabel = document.getElementById("playerCountLabel");
        if (playerCountLabel) {
            const minText = playerCount < CONFIG.TEAM.MIN_PLAYERS ? 
                ` (Minimum ${CONFIG.TEAM.MIN_PLAYERS} required)` : '';
            playerCountLabel.innerHTML = `(${playerCount}/${CONFIG.TEAM.MAX_PLAYERS} players)<span style="color: #ff4757; font-size: 12px;">${minText}</span>`;
        }
    }

    // Renumber player inputs after removal
    function renumberPlayerInputs() {
        const inputs = document.querySelectorAll("#playersContainer input");
        inputs.forEach((input, index) => {
            const newNumber = index + 1;
            input.name = `player${newNumber}`;
            input.placeholder = `Player ${newNumber} Name`;
        });
    }

    // Handle team registration form submission
    function handleTeamRegistration(e) {
        e.preventDefault();

        if (isSubmitting) return;

        // Get form data
        const formData = getTeamFormData();
        
        // Validate form data
        if (!validateTeamData(formData)) {
            return;
        }

        // Show loading state
        setSubmissionState(true, 'Processing registration...');

        // Prepare team data
        const teamData = {
            ...formData,
            registrationType: 'team',
            registrationFee: CONFIG.TEAM.REGISTRATION_FEE,
            timestamp: new Date().toISOString()
        };

        // Store data for payment
        storeRegistrationData('team', teamData, CONFIG.TEAM.REGISTRATION_FEE);

        // Simulate API validation (replace with actual backend call)
        setTimeout(() => {
            showAlert("Team registration details saved! Redirecting to payment...");
            
            // Close modal and redirect
            closeTeamRegistrationModal();
            redirectToPayment(CONFIG.TEAM.PAYMENT_URL);
            
            setSubmissionState(false);
        }, 1000);
    }

    // Get team form data
    function getTeamFormData() {
        return {
            teamName: getValue("teamName"),
            captainName: getValue("captainName"),
            contact: getValue("contact"),
            email: getValue("email"),
            players: getPlayerNames()
        };
    }

    // Get player names from inputs
    function getPlayerNames() {
        const playerInputs = document.querySelectorAll("#playersContainer input");
        return Array.from(playerInputs).map(input => input.value.trim()).filter(name => name !== "");
    }

    // Validate team registration data
    function validateTeamData(data) {
        // Check required fields
        if (!data.teamName || !data.captainName || !data.contact || !data.email) {
            showAlert("Please fill all required fields.");
            return false;
        }

        // Validate contact number
        if (!/^\d{10}$/.test(data.contact)) {
            showAlert("Contact number must be exactly 10 digits.");
            return false;
        }

        // Validate email
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            showAlert("Please enter a valid email address.");
            return false;
        }

        // Validate player count
        if (data.players.length < CONFIG.TEAM.MIN_PLAYERS) {
            showAlert(`Minimum ${CONFIG.TEAM.MIN_PLAYERS} players required.`);
            return false;
        }

        if (data.players.length > CONFIG.TEAM.MAX_PLAYERS) {
            showAlert(`Maximum ${CONFIG.TEAM.MAX_PLAYERS} players allowed.`);
            return false;
        }

        // Check for empty player names
        if (data.players.some(name => name === "")) {
            showAlert("All player fields must be filled.");
            return false;
        }

        // Check for duplicate player names
        const duplicates = data.players.filter((name, index) => 
            data.players.indexOf(name.toLowerCase()) !== index
        );
        if (duplicates.length > 0) {
            showAlert("Player names must be unique.");
            return false;
        }

        return true;
    }

    // ============================
    // TOURNAMENT CREATION LOGIC
    // ============================

    // Initialize tournament creation
    function initializeTournamentCreation() {
        const openBtn = document.getElementById('openTournamentBtn');
        const closeBtn = document.getElementById('closeTournamentModal');
        const modal = document.getElementById('tournamentModal');
        const tournamentForm = document.getElementById('tournamentForm');

        if (openBtn) {
            openBtn.addEventListener('click', openTournamentModal);
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', closeTournamentModal);
        }

        if (tournamentForm) {
            tournamentForm.addEventListener('submit', handleTournamentCreation);
        }

        // Close modal when clicking outside
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    closeTournamentModal();
                }
            });
        }
    }

    // Open tournament creation modal
    function openTournamentModal() {
        const modal = document.getElementById('tournamentModal');
        if (modal) {
            modal.style.display = 'flex';
            document.body.classList.add('modal-open');
            setDefaultTournamentDates();
        }
    }

    // Close tournament creation modal
    function closeTournamentModal() {
        const modal = document.getElementById('tournamentModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.classList.remove('modal-open');
        }
    }

    // Set default tournament dates
    function setDefaultTournamentDates() {
        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);

        const formatDate = (date) => {
            return date.toISOString().split('T')[0];
        };

        const startDateInput = document.getElementById('startDate');
        const endDateInput = document.getElementById('endDate');

        if (startDateInput) {
            startDateInput.value = formatDate(today);
            startDateInput.min = formatDate(today);
        }

        if (endDateInput) {
            endDateInput.value = formatDate(nextWeek);
        }
    }

    // Handle tournament creation form submission
    function handleTournamentCreation(e) {
        e.preventDefault();

        if (isSubmitting) return;

        // Get form data
        const formData = getTournamentFormData();
        
        // Validate form data
        if (!validateTournamentData(formData)) {
            return;
        }

        // Show loading state
        setSubmissionState(true, 'Processing tournament creation...');

        // Prepare tournament data
        const tournamentData = {
            ...formData,
            registrationType: 'tournament',
            creationFee: CONFIG.TOURNAMENT.CREATION_FEE,
            timestamp: new Date().toISOString()
        };

        // Store data for payment
        storeRegistrationData('tournament', tournamentData, CONFIG.TOURNAMENT.CREATION_FEE);

        // Simulate API validation
        setTimeout(() => {
            showAlert("Tournament details saved! Redirecting to payment...");
            
            // Close modal and redirect
            closeTournamentModal();
            redirectToPayment(CONFIG.TOURNAMENT.PAYMENT_URL);
            
            setSubmissionState(false);
        }, 1000);
    }

    // Get tournament form data
    function getTournamentFormData() {
        return {
            tournamentName: getValue('tournamentName'),
            startDate: getValue('startDate'),
            endDate: getValue('endDate'),
            teamCount: getValue('teamCount'),
            entryFee: getValue('entryFee'),
            tournamentRules: getValue('tournamentRules')
        };
    }

    // Validate tournament data
    function validateTournamentData(data) {
        // Check required fields
        if (!data.tournamentName || !data.startDate || !data.endDate || !data.teamCount || !data.entryFee) {
            showAlert("Please fill all required fields.");
            return false;
        }

        // Validate dates
        const startDate = new Date(data.startDate);
        const endDate = new Date(data.endDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (startDate < today) {
            showAlert("Start date cannot be in the past.");
            return false;
        }

        if (endDate < startDate) {
            showAlert("End date cannot be before start date.");
            return false;
        }

        // Validate team count
        if (data.teamCount < 2) {
            showAlert("Minimum 2 teams required for a tournament.");
            return false;
        }

        if (data.teamCount > 64) {
            showAlert("Maximum 64 teams allowed.");
            return false;
        }

        // Validate entry fee
        if (data.entryFee < 0) {
            showAlert("Entry fee cannot be negative.");
            return false;
        }

        return true;
    }

    // ====================
    // PAYMENT INTEGRATION
    // ====================

    // Store registration data for payment
    function storeRegistrationData(type, data, amount) {
        try {
            if (type === 'team') {
                localStorage.setItem('teamRegistrationData', JSON.stringify(data));
            } else if (type === 'tournament') {
                localStorage.setItem('tournamentRegistrationData', JSON.stringify(data));
            }
            
            localStorage.setItem('registrationAmount', amount.toString());
            localStorage.setItem('registrationType', type);
        } catch (error) {
            console.error('Error storing registration data:', error);
            showAlert('Error saving registration data. Please try again.');
        }
    }

    // Redirect to payment page
    function redirectToPayment(paymentUrl) {
        setTimeout(() => {
            window.location.href = paymentUrl;
        }, 500);
    }

    // Handle payment success (called from payment pages)
    window.handlePaymentSuccess = function(paymentData) {
        const registrationType = localStorage.getItem('registrationType');
        
        if (registrationType === 'team') {
            processTeamRegistrationSuccess(paymentData);
        } else if (registrationType === 'tournament') {
            processTournamentCreationSuccess(paymentData);
        }
    };

    // Process team registration success
    function processTeamRegistrationSuccess(paymentData) {
        const teamData = JSON.parse(localStorage.getItem('teamRegistrationData') || '{}');
        
        const finalData = {
            ...teamData,
            paymentData: paymentData,
            paymentStatus: 'completed'
        };

        // Send to backend
        fetch(CONFIG.API_ENDPOINTS.REGISTER_TEAM, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(finalData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                clearRegistrationData();
                showAlert("Team registration completed successfully!");
                redirectToHome();
            } else {
                showAlert("Registration failed: " + (data.message || 'Unknown error'));
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showAlert("An error occurred during registration. Please contact support.");
        });
    }

    // Process tournament creation success
    function processTournamentCreationSuccess(paymentData) {
        const tournamentData = JSON.parse(localStorage.getItem('tournamentRegistrationData') || '{}');
        
        const finalData = {
            ...tournamentData,
            paymentData: paymentData,
            paymentStatus: 'completed'
        };

        // Send to backend
        fetch(CONFIG.API_ENDPOINTS.CREATE_TOURNAMENT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(finalData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                clearRegistrationData();
                showAlert("Tournament created successfully!");
                redirectToHome();
            } else {
                showAlert("Tournament creation failed: " + (data.message || 'Unknown error'));
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showAlert("An error occurred during tournament creation. Please contact support.");
        });
    }

    // Handle payment cancellation
    window.handlePaymentCancel = function() {
        showAlert("Payment cancelled. Returning to main page...");
        redirectToHome();
    };

    // Get registration data for payment pages
    window.getRegistrationData = function() {
        const registrationType = localStorage.getItem('registrationType');
        const amount = localStorage.getItem('registrationAmount');
        
        if (registrationType === 'team') {
            const teamData = JSON.parse(localStorage.getItem('teamRegistrationData') || '{}');
            return {
                type: 'team',
                amount: amount,
                data: teamData
            };
        } else if (registrationType === 'tournament') {
            const tournamentData = JSON.parse(localStorage.getItem('tournamentRegistrationData') || '{}');
            return {
                type: 'tournament',
                amount: amount,
                data: tournamentData
            };
        }
        return null;
    };

    // ================
    // UTILITY FUNCTIONS
    // ================

    // Get element value safely
    function getValue(elementId) {
        const element = document.getElementById(elementId);
        return element ? element.value.trim() : '';
    }

    // Show alert message
    function showAlert(message) {
        alert(message);
    }

    // Set submission state
    function setSubmissionState(submitting, message = '') {
        isSubmitting = submitting;
        
        const submitBtns = document.querySelectorAll('button[type="submit"]');
        submitBtns.forEach(btn => {
            if (submitting) {
                btn.disabled = true;
                if (message) btn.textContent = message;
            } else {
                btn.disabled = false;
                btn.textContent = btn.getAttribute('data-original-text') || 'Submit';
            }
        });
    }

    // Clear registration data from localStorage
    function clearRegistrationData() {
        localStorage.removeItem('teamRegistrationData');
        localStorage.removeItem('tournamentRegistrationData');
        localStorage.removeItem('registrationAmount');
        localStorage.removeItem('registrationType');
    }

    // Redirect to home page
    function redirectToHome() {
        setTimeout(() => {
            window.location.href = CONFIG.HOME_PAGE_URL;
        }, 2000);
    }

    // Handle escape key to close modals
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeTeamRegistrationModal();
            closeTournamentModal();
        }
    });

    // Initialize everything
    initializeTeamRegistration();
    initializeTournamentCreation();

    // Store original button text for reset
    document.querySelectorAll('button[type="submit"]').forEach(btn => {
        btn.setAttribute('data-original-text', btn.textContent);
    });

    console.log('Tournament Registration System initialized successfully!');
});