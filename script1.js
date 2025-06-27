document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const bookingModal = document.getElementById('bookingModal');
    const paymentModal = document.getElementById('paymentModal');
    const confirmationModal = document.getElementById('confirmationModal');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const closeButtons = document.querySelectorAll('.close-sch, .close-payment');
    const prevWeekBtn = document.getElementById('prevWeek');
    const nextWeekBtn = document.getElementById('nextWeek');
    const currentWeekEl = document.getElementById('currentWeek');
    const timeSlots = document.getElementById('timeSlots');
    const daySlots = document.getElementById('daySlots');
    const slotDateInput = document.getElementById('slotDate');
    const slotTimeInput = document.getElementById('slotTime');
    const bookingForm = document.getElementById('bookingForm');
    const paymentForm = document.getElementById('paymentForm');
    const durationSelect = document.getElementById('duration');
    const toast = document.getElementById('toast');
    const returnToHomeBtn = document.getElementById('returnToHome');
    
    // Payment Method Elements
    const paymentMethodRadios = document.getElementsByName('paymentMethod');
    const onlinePaymentDetails = document.getElementById('onlinePaymentDetails');
    const cardTypeRadios = document.getElementsByName('cardType');
    const cardDetails = document.getElementById('cardDetails');
    const upiDetails = document.getElementById('upiDetails');
    
    // Global Variables
    let currentDate = new Date();
    let currentWeekStart = getWeekStart(currentDate);
    let selectedSlot = null;
    let selectedDate = null;
    
    // Price for each duration
    const prices = {
        '1': 400,
        '2': 700,
        '3': 900
    };
    
    // Initialize Schedule
    updateWeekDisplay();
    generateTimeSlots();
    generateSchedule();
    
    // Event Listeners
    prevWeekBtn.addEventListener('click', navigatePrevWeek);
    nextWeekBtn.addEventListener('click', navigateNextWeek);
    bookingForm.addEventListener('submit', handleBookingSubmit);
    paymentForm.addEventListener('submit', handlePaymentSubmit);
    returnToHomeBtn.addEventListener('click', returnToHome);
    
    // Close modals when clicking close button
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            bookingModal.style.display = 'none';
            paymentModal.style.display = 'none';
        });
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === bookingModal) {
            bookingModal.style.display = 'none';
        }
        if (event.target === paymentModal) {
            paymentModal.style.display = 'none';
        }
        if (event.target === confirmationModal) {
            confirmationModal.style.display = 'none';
        }
    });
    
    // Payment method change handlers
    paymentMethodRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            onlinePaymentDetails.style.display = this.value === 'online' ? 'block' : 'none';
        });
    });
    
    // Card type change handlers
    cardTypeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            cardDetails.style.display = (this.value === 'credit' || this.value === 'debit') ? 'block' : 'none';
            upiDetails.style.display = this.value === 'upi' ? 'block' : 'none';
        });
    });
    
    // Format expiry date input
    const expiryInput = document.getElementById('expiry');
    if (expiryInput) {
        expiryInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });
    }
    
    // Card number validation
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '').substring(0, 16);
        });
    }
    
    // CVV validation
    const cvvInput = document.getElementById('cvv');
    if (cvvInput) {
        cvvInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '').substring(0, 3);
        });
    }
    
    // Mobile number validation
    const mobileInput = document.getElementById('mobile');
    if (mobileInput) {
        mobileInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '').substring(0, 10);
        });
    }
    
    // Functions
    function getWeekStart(date) {
        const newDate = new Date(date);
        const day = newDate.getDay(); // 0 for Sunday, 1 for Monday, etc.
        const diff = newDate.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
        newDate.setDate(diff);
        return newDate;
    }
    
    function formatDate(date) {
        const options = { weekday: 'short', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }
    
    function formatWeekRange(startDate) {
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 6);
        
        const startMonth = startDate.toLocaleDateString('en-US', { month: 'short' });
        const endMonth = endDate.toLocaleDateString('en-US', { month: 'short' });
        
        const startDay = startDate.getDate();
        const endDay = endDate.getDate();
        
        if (startMonth === endMonth) {
            return `${startMonth} ${startDay} - ${endDay}, ${startDate.getFullYear()}`;
        } else {
            return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${startDate.getFullYear()}`;
        }
    }
    
    function updateWeekDisplay() {
        currentWeekEl.textContent = formatWeekRange(currentWeekStart);
        generateSchedule();
    }
    
    function navigatePrevWeek() {
        const prevWeek = new Date(currentWeekStart);
        prevWeek.setDate(prevWeek.getDate() - 7);
        currentWeekStart = prevWeek;
        updateWeekDisplay();
    }
    
    function navigateNextWeek() {
        const nextWeek = new Date(currentWeekStart);
        nextWeek.setDate(nextWeek.getDate() + 7);
        currentWeekStart = nextWeek;
        updateWeekDisplay();
    }
    
    function generateTimeSlots() {
        const times = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', 
                     '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'];
        
        timeSlots.innerHTML = '';
        const headerRow = document.createElement('div');
        headerRow.className = 'time-header-row';
        
        const emptyCell = document.createElement('div');
        emptyCell.className = 'time-header-cell empty';
        headerRow.appendChild(emptyCell);
        
        for (let i = 0; i < 7; i++) {
            const dayDate = new Date(currentWeekStart);
            dayDate.setDate(dayDate.getDate() + i);
            
            const dayHeaderCell = document.createElement('div');
            dayHeaderCell.className = 'day-header-cell';
            dayHeaderCell.textContent = formatDate(dayDate);
            headerRow.appendChild(dayHeaderCell);
        }
        
        timeSlots.appendChild(headerRow);
        
        times.forEach(time => {
            const row = document.createElement('div');
            row.className = 'time-row';
            
            const timeCell = document.createElement('div');
            timeCell.className = 'time-cell';
            timeCell.textContent = time;
            row.appendChild(timeCell);
            
            for (let i = 0; i < 7; i++) {
                const slotDate = new Date(currentWeekStart);
                slotDate.setDate(slotDate.getDate() + i);
                
                const cell = document.createElement('div');
                cell.className = 'slot-cell';
                
                // Check if slot is available (mock data - in real app, check from database)
                const isAvailable = Math.random() > 0.3; // 70% chance of being available
                
                if (isAvailable) {
                    cell.classList.add('available');
                    cell.addEventListener('click', () => {
                        selectSlot(slotDate, time);
                    });
                } else {
                    cell.classList.add('unavailable');
                }
                
                row.appendChild(cell);
            }
            
            timeSlots.appendChild(row);
        });
    }
    
    function generateSchedule() {
        daySlots.innerHTML = '';
        
        for (let i = 0; i < 7; i++) {
            const date = new Date(currentWeekStart);
            date.setDate(date.getDate() + i);
            
            const dayCol = document.createElement('div');
            dayCol.className = 'day-column';
            
            const dayHeader = document.createElement('div');
            dayHeader.className = 'day-header';
            dayHeader.textContent = formatDate(date);
            dayCol.appendChild(dayHeader);
            
            // Generate random available slots for demo
            const availableHours = [];
            for (let h = 9; h <= 18; h++) {
                if (Math.random() > 0.4) { // 60% chance slot is available
                    availableHours.push(h);
                }
            }
            
            availableHours.forEach(hour => {
                const slot = document.createElement('div');
                slot.className = 'slot available';
                const ampm = hour >= 12 ? 'PM' : 'AM';
                const hour12 = hour > 12 ? hour - 12 : hour;
                const timeString = `${hour12}:00 ${ampm}`;
                slot.textContent = timeString;
                
                slot.addEventListener('click', () => {
                    selectSlot(date, timeString);
                });
                
                dayCol.appendChild(slot);
            });
            
            daySlots.appendChild(dayCol);
        }
    }
    
    function selectSlot(date, time) {
        // Remove previous selection
        const previouslySelected = document.querySelectorAll('.slot.selected');
        previouslySelected.forEach(el => el.classList.remove('selected'));
        
        // Add selection to clicked element
        event.target.classList.add('selected');
        
        // Store selected date and time
        selectedDate = date;
        selectedSlot = time;
        
        // Set form values
        slotDateInput.value = date.toISOString().split('T')[0];
        slotTimeInput.value = time;
        
        // Show booking modal
        bookingModal.style.display = 'block';
        
        // Update price display
        updatePrice();
    }
    
    function updatePrice() {
        const duration = durationSelect.value;
        const priceElement = document.getElementById('price');
        if (priceElement) {
            priceElement.textContent = `₹${prices[duration]}`;
        }
    }
    
    // Update price when duration changes
    durationSelect.addEventListener('change', updatePrice);
    
    function handleBookingSubmit(e) {
        e.preventDefault();
        
        // Validate form
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const mobile = document.getElementById('mobile').value;
        
        if (!name || !email || !mobile || mobile.length !== 10) {
            showToast('Please fill in all required fields correctly.');
            return;
        }
        
        // Hide booking modal and show payment modal
        bookingModal.style.display = 'none';
        paymentModal.style.display = 'block';
        
        // Update payment amount
        const duration = durationSelect.value;
        const paymentAmountEl = document.getElementById('paymentAmount');
        if (paymentAmountEl) {
            paymentAmountEl.textContent = `₹${prices[duration]}`;
        }
    }
    
    function handlePaymentSubmit(e) {
        e.preventDefault();
        
        // Show loading overlay
        loadingOverlay.style.display = 'flex';
        
        // Simulate payment processing
        setTimeout(() => {
            // Hide loading overlay
            loadingOverlay.style.display = 'none';
            
            // Hide payment modal
            paymentModal.style.display = 'none';
            
            // Show confirmation modal
            confirmationModal.style.display = 'block';
            
            // Generate booking reference
            const bookingRef = generateBookingReference();
            document.getElementById('bookingReference').textContent = bookingRef;
            
            // Display booking details
            const bookingDate = document.getElementById('bookingDate');
            const bookingTime = document.getElementById('bookingTime');
            const bookingDuration = document.getElementById('bookingDuration');
            
            if (bookingDate && bookingTime && bookingDuration) {
                bookingDate.textContent = selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                });
                bookingTime.textContent = selectedSlot;
                bookingDuration.textContent = `${durationSelect.value} hour(s)`;
            }
        }, 1500);
    }
    
    function generateBookingReference() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 8; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return 'BK-' + result;
    }
    
    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
    
    function returnToHome() {
        // Reset the view
        confirmationModal.style.display = 'none';
        
        // Clear selected slot
        selectedSlot = null;
        selectedDate = null;
        
        // Reset forms
        bookingForm.reset();
        paymentForm.reset();
        
        // Regenerate schedule
        generateSchedule();
    }
});