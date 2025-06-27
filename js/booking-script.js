document.addEventListener('DOMContentLoaded', function() {
    // Open registration modal
    document.getElementById('openRegistrationBtn').addEventListener('click', function() {
        document.getElementById('registrationModal').style.display = 'flex';
    });
    
    // Close registration modal
    document.getElementById('closeModal').addEventListener('click', function() {
        document.getElementById('registrationModal').style.display = 'none';
    });
    
    // Add player functionality
    const teamMembers = document.getElementById('teamMembers');
    const playerCount = document.getElementById('playerCount');
    let playerCounter = 0;
    
    document.getElementById('addPlayerBtn').addEventListener('click', function() {
        if (playerCounter >= 16) {
            alert('Maximum 16 players allowed');
            return;
        }
        
        const playerDiv = document.createElement('div');
        playerDiv.className = 'player-entry';
        playerDiv.innerHTML = `
            <input type="text" name="players[]" required placeholder="Player ${playerCounter + 1} name">
            <button type="button" class="remove-player">×</button>
        `;
        teamMembers.appendChild(playerDiv);
        
        playerCounter++;
        updatePlayerCount();
        
        // Add event listener for remove button
        playerDiv.querySelector('.remove-player').addEventListener('click', function() {
            teamMembers.removeChild(playerDiv);
            playerCounter--;
            updatePlayerCount();
        });
    });
    
    // Update player count display
    function updatePlayerCount() {
        playerCount.textContent = `(${playerCounter}/16 players)`;
    }
    
    // Add initial players
    for (let i = 0; i < 3; i++) {
        document.getElementById('addPlayerBtn').click();
    }
    
    // Form submission
    document.getElementById('teamRegistrationForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (playerCounter < 3) {
            alert('At least 3 players are required');
            return;
        }
        
        // Collect form data
        const formData = new FormData(this);
        
        // Submit form using fetch API
        fetch('backend/register_team.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert(data.message);
                document.getElementById('registrationModal').style.display = 'none';
                document.getElementById('teamRegistrationForm').reset();
                teamMembers.innerHTML = '';
                playerCounter = 0;
                updatePlayerCount();
                // Add initial players again
                for (let i = 0; i < 3; i++) {
                    document.getElementById('addPlayerBtn').click();
                }
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        });
    });
});