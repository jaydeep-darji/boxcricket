<?php include './backend/session.php'; ?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>7 STAR BOX CRICKET</title>
    <!-- linking font awesome for icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css">
    <link rel="stylesheet" href="./css/style.css">
    <link rel="stylesheet" href="./css/live.css">
    <style> 
    /* available */
    .modal-overlay {
      display: none;
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background-color: rgba(0,0,0,0.5);
      justify-content: center;
      align-items: center;
    }
    .modal-content-sch {
      background: #fff;
      padding: 20px;
      border-radius: 10px;
      width: 400px;
      position: relative;
    }
    .close-registration {
      position: absolute;
      right: 10px;
      top: 10px;
      cursor: pointer;
      font-size: 20px;
    }
    .form-group-sch {
      margin-bottom: 10px;
    }
    .form-group-sch input {
      width: 100%;
      padding: 8px;
    }
    .btn-add-player, .btn-sch {
      margin-top: 10px;
      padding: 8px 12px;
      cursor: pointer;
    }
    /* Button style */
  .register-btn {
    display: inline-block;
    background-color:  #27ae60;
    color: white;
    padding: 12px 18px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: bold;
    transition: all 0.3s ease;
    text-align: center;
    margin-top: 10px;
    width: 100%;
    box-shadow: 0 4px 6px rgba(39, 174, 96, 0.2);
  }

  .register-btn:hover {
    background-color: #218838;
  }
  
  /* Modal styles */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(8px);
    display: none;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal-content-sch {
    background: #fff;
    border-radius: 10px;
    padding: 25px;
    width: 90%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
    position: relative;
  }

  .modal-content-sch h3 {
    margin-top: 0;
    text-align: center;
  }

  .form-group-sch {
    margin-bottom: 15px;
  }

  .form-group-sch label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }

  .form-group-sch input {
    width: 100%;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
  }

  .member-row {
    margin-bottom: 10px;
  }

  .btn-sch {
    background-color: #28a745;
    color: #fff;
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    display: inline-block;
  }

  .btn-sch:hover {
    background-color: #218838;
  }
  
  .btn-add-player {
    background-color: #007bff;
    color: #fff;
    padding: 8px 12px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 10px;
    display: inline-block;
  }
  
  .btn-add-player:hover {
    background-color: #0069d9;
  }
  
  .btn-add-player:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }

  .players-counter {
    display: block;
    margin-top: 10px;
    font-size: 14px;
    color: #666;
  }

  .close-registration, .close-tournament {
    position: absolute;
    top: 10px;
    right: 15px;
    font-size: 24px;
    font-weight: bold;
    color: #333;
    cursor: pointer;
  }

   /* Additional styles specific to the tournament form */
   #tournamentRules {
    width: 100%;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
    resize: vertical;
  }
  
  select {
    width: 100%;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
  }
  
  /* The following styles are for both forms */
  .register-btn {
    background-color: #28a745;
    color: #fff;
    padding: 12px 24px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    margin-right: 10px;
  }

  .register-btn:hover {
    background-color: #218838;
  }
  </style>
</head>
<body>
    <!-- Header / Navbar -->
    <header>
    <nav class="navbar section-content"  id="home" >
        <a href="#" class="nav-logo">
            <h2 class="logo-text">BCT</h2>
        </a>
        <ul class="nav-menu">
            <button id="menu-close-button" class="fas fa-times"></button>
            <li class="nav-item">
                 <a href="#" class="nav-link">Home</a>
            </li>
            <li class="nav-item">
                <a href="#about" class="nav-link">About Us</a>
           </li>
            <li class="nav-item">
                 <a href="#schedule" class="nav-link">Schedule </a>
            </li>
            <li class="nav-item">
                 <a href="#Service" class="nav-link">Services</a>
            </li>
          
        </ul>
        <button id="menu-open-button" class="fas fa-bars"></button>
    </nav>
    </header>
    <!-- hero body section  -->
    <main>
        <section class="hero-section">
            <div class="section-content">
                <div class="hero-details">
                    <h3>Welcome<?php echo $username ? ", " . htmlspecialchars($username) . "!" : "!"; ?></h3>
                    <h2 class="title">Box Cricket</h2>
                    <h3 class="subtitle">Don't just watch-play,score and celebrate!</h3>
                    <p class="description">Small ground, big excitement! Play, compete, and celebrate the spirit of cricket in our electrifying box cricket tournament</p>
                    <div class="buttons" style="width:450px;">
                        <?php if (isset($username) && !empty($username)) : ?>
                            <form action="./backend/logout.php" method="post" style="display:inline;">
                                <button type="submit" class="button Registration" style="background-color:#e74c3c;">Logout</button>
                            </form>
                        <?php else: ?>
                            <a href="SignUp_LogIn_Form.html" class="button Registration">Registration/Login</a>
                        <?php endif; ?>
                        <a href="contact.html" class="button contact-us">Contact Us</a>
                    </div>
                </div>
                <div class="hero-image-wrapper">
                    <img src="photos/main bat.png" alt="Hero" class="hero-image">
                </div>
            </div>
        </section>
        <!-- About Us -->
         <section class="about-section" id="about">
            <div class="section-content">
                <div class="about-image-wrapper">
                  <img src="photos/disscussion.png" alt="about" class="about-image">
                <div class="about-details">
                    <h2 class="section-title">About Us</h2>
                    <p class="text">Welcome to the Box Cricket Tournament Booking System, your ultimate platform for organizing and managing box cricket tournaments effortlessly. Our system enables teams to register, schedule matches, and book slots with ease. Designed with a user-friendly interface, it ensures a seamless experience for both administrators and participants. With real-time updates, secure payment integration, and efficient match scheduling, we aim to simplify tournament management. Join us and experience hassle-free cricket tournament coordination like never before!</p>
                    <div class="social-link-list">
                        <a href="#" class="social-link"><i class="fa-brands fa-facebook"></i></a>
                        <a href="#" class="social-link"><i class="fa-brands fa-instagram"></i></a>
                        <a href="#" class="social-link"><i class="fa-brands fa-x-twitter"></i></a>
                    </div>
                </div>
                </div>
            </div>
         </section>
         <!-- schedule data -->
         <body-sch>
            <section class="sched" id="schedule">
                <div class="container-sch" >
                <div class="sche">
                    <h1-m >Box Cricket Tournament</h1-m><br><br>
                    <p style=" font-size: 20px;font-weight: 300;">Book your slots and manage your teams in real-time</p>
                </div>
                
                <div class="sche-list">
                    <ul>
                    <li><a href="#home">Home</a></li>
                            <li><a href="#about">About Us</a></li>
                            <li><a href="#schedule">Schedule</a></li>
                            <li><a href="#Service">Services</a></li>
                    </ul>
                </div>
                
                <div class="dashboard-sch">
                    <div class="sidebar-sch">
                        
                        
                        <div class="team-registration-sch">
                            <h3>Quick Actions</h3>
                               
              <!-- Registration Button team registration -->
              <button id="openRegistrationBtn" class="register-btn">  <i class="fas fa-users"></i>Register New Team</button>

<!-- Modal Overlay -->
                <div class="modal-overlay" id="registrationModal">
                <div class="modal-content-sch">
                    <span class="close-registration" id="closeModal">&times;</span>
                    <h3>Register New Team</h3>
                    <form id="teamForm">
                    <div class="form-group-sch">
                        <label for="teamName">Team Name</label>
                        <input type="text" id="teamName" name="teamName" required placeholder="Enter your team name">
                    </div>
                    <div class="form-group-sch">
                        <label for="captainName">Captain Name</label>
                        <input type="text" id="captainName" name="captainName" required placeholder="Enter captain's name">
                    </div>
                    <div class="form-group-sch">
                        <label for="contact">Contact Number</label>
                        <input type="tel" id="contact" name="contact" required placeholder="Enter contact number">
                    </div>
                    <div class="form-group-sch">
                        <label for="email">Email Address</label>
                        <input type="email" id="email" name="email" required placeholder="Enter email address">
                    </div>
                    <div class="form-group-sch">
                        <label>Team Members <span id="playerCountLabel">(0/16 players)</span></label>
                        <div id="playersContainer"></div>
                        <button type="button" id="addPlayerBtn" class="btn-add-player">Add Player</button>
                        <span class="players-counter">Min: 6, Max: 16 players</span>
                    </div>
                    <button type="submit" class="btn-sch">Register Team</button>
                    </form>
                </div>
                </div>

<!-- tournament registration -->
                    <!-- Tournament Creation Button - Add this wherever you want the button to appear -->
                    <button id="openTournamentBtn" class="register-btn"><i class="fas fa-trophy"></i> Create Tournament</button>

                    <!-- Modal Overlay and Content for Tournament Creation -->
                    <div class="modal-overlay" id="tournamentModal">
                    <div class="modal-content-sch">
                        <span class="close-tournament" id="closeTournamentModal">&times;</span>
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
                    </div>
    
                       </div>
                    </div>
                    
                    <div class="schedule-container">
                        <div class="live-indicator">
                            <div class="pulse"></div>
                            Live Schedule Updates
                        </div>
                        
                        <div class="status-indicator-sch">
                            <div class="status-item-sch">
                                <div class="status-color-sch" style="background-color: var(--available-color)"></div>
                                <span>Available</span>
                            </div>
                            <div class="status-item-sch">
                                <div class="status-color-sch" style="background-color: var(--booked-color)"></div>
                                <span>Booked</span>
                            </div>
                            <div class="status-item-sch">
                                <div class="status-color-sch" style="background-color: var(--pending-color)"></div>
                                <span>Pending</span>
                            </div>
                        </div>
                        
                        <div class="date-navigation-sch">
                            <button class="btn-sch" id="prevWeek">Previous Week</button>
                            <h3 id="currentWeek">March 10 - 16, 2025</h3>
                            <button class="btn-sch" id="nextWeek">Next Week</button>
                        </div>
                        
                        <div class="schedule-header-sch">
                            <div class="time-column">Time</div>
                            <div class="day-column">Mon</div>
                            <div class="day-column">Tue</div>
                            <div class="day-column">Wed</div>
                            <div class="day-column">Thu</div>
                            <div class="day-column">Fri</div>
                            <div class="day-column">Sat</div>
                            <div class="day-column">Sun</div>
                        </div>
                        
                        <div class="schedule-grid-sch">
                            <div class="time-slots-sch" id="timeSlots">
                                <!-- Time slots will be generated by JavaScript -->
                            </div>
                            
                            <div class="day-slots-sch" id="daySlots">
                                <!-- Slots will be generated by JavaScript -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Booking Modal -->
            <div id="bookingModal" class="modal-sch">
                <div class="modal-content-sch">
                    <span class="close-sch">&times;</span>
                    <h3 id="modalTitle">Book a Slot</h3>
                    <form id="bookingForm">
                        <div class="form-group-sch">
                            <label for="slotDate">Date</label>
                            <input type="text" id="slotDate" readonly>
                        </div>
                        <div class="form-group-sch">
                            <label for="slotTime">Time</label>
                            <input type="text" id="slotTime" readonly>
                        </div>
                        <div class="form-group-sch">
                            <label for="teamSelect">Select Team</label>
                            <select id="teamSelect">
                                <option value="">Select your team</option>
                                <option value="team1">Thunderbolts</option>
                                <option value="team2">Strikers</option>
                                <option value="team3">Royal Challengers</option>
                            </select>
                        </div>
                        <div class="form-group-sch">
                            <label for="opponents">Opponents</label>
                            <select id="opponents">
                                <option value="">Open Challenge (Anyone can accept)</option>
                                <option value="team1">Thunderbolts</option>
                                <option value="team2">Strikers</option>
                                <option value="team3">Royal Challengers</option>
                            </select>
                        </div>
                        <button type="submit" class="btn-sch">Confirm Booking</button>
                    </form>
                </div>
            </div>
            
            <!-- Toast Notification -->
            <div id="toast" class="toast-sch">Slot booked successfully!</div>
            
       

       
    <!-- Services -->

    <section class="Service Section" id="Service">
      <body-service>
        <div class="container-services">
            <h2 style=" color:  #2ecc71; border-bottom: 2px solid  #2ecc71; padding-bottom: 5px;">Our Services</h2>
            <ul>
                <li>Online Team Registration</li>
                <li>Match Scheduling</li>
                <li>Booking Management</li>
                <li>Real-time Notifications</li>
                <li>Secure Payment Integration</li>
            </ul>
        </div>
        
    <!-- Footer Portion -->
    <footer>
        <div class="container-foot">
            <div class="footer-content">
                <div class="footer-column">
                    <a href="#" class="logo">
                        <img src="photos/footer-logo.jpg" alt="Cricket Logo" style="width: 60px;
                        height: 60px; border-radius: 90%;">
                        Box<span>Cricket</span>
                    </a>
                    <p>Your one-stop solution for box cricket tournament bookings, team registrations, and match scheduling. Join thousands of cricket enthusiasts on our platform.</p>
                    <div class="social-links">
                        
                    </div>
                </div>
                <div class="footer-column">
                    <h3>Quick Links</h3>
                    <ul class="footer-links">
                            <li><a href="#home">Home</a></li>
                            <li><a href="#about">About Us</a></li>
                            <li><a href="#schedule">Schedule</a></li>
                            <li><a href="#Service">Services</a></li>
                    </ul>
                </div>
                <div class="footer-column">
                    <h3>Online Shopping</h3>
                    <ul class="footer-links">
                        <li><a href="amazon.html">Amazon</a></li>
                        <li><a href="flipkart.html">Flipkart</a></li>
                    </ul>
                </div>
                
                <div class="footer-column">
                    <h3>Contact Us</h3>
                    <div class="footer-contact">
                        <p><i>📍</i>85-B-111,Patan-Harij HighwaySudama Chowkdi,Patan - 384265</br></p>
                        <p><i>📞</i> +91 9316724240</p>
                        <p><i>✉</i> 7starboxcricket@gmail.com</p>
                        <p><i>⏰</i> Mon-Sat: 10:00 AM - 12:00 AM</p>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2025 Box Cricket Tournament Booking System. All Rights Reserved.</p>
                <p>Designed and Developed by <a href="#" style="color: var(--primary);">Your Company</a></p>
            </div>
        </div>
    </footer>
        
        </main>
        <script src="./js/booking-script.js"></script>
        <script src="./js/sch.js"></script>
    <script src="./js/script.js"></script>
    <script src="./js/pay.js"></script>
    

<!-- players in a add type of a players entry regarding js -->

</body>
</html>