// Publieke Afspraak Maken Functionaliteit
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api' 
    : '/api';

let currentDate = new Date();
let selectedDate = null;
let selectedTime = null;
let availableSlots = {};

// Standaard werktijden (kan later uit database komen)
const WORK_HOURS = {
    start: 9,
    end: 17,
    slotDuration: 60, // minuten
    breakStart: 12,
    breakEnd: 13
};

// Werkdagen (1 = maandag, 5 = vrijdag)
const WORK_DAYS = [1, 2, 3, 4, 5];

const monthNames = ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni',
                   'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'];

const dayNames = ['Zo', 'Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za'];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    renderCalendar();
    loadAvailableSlots();
});

function initializeEventListeners() {
    document.getElementById('prevMonth').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
        loadAvailableSlots();
    });

    document.getElementById('nextMonth').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
        loadAvailableSlots();
    });

    document.getElementById('appointmentRequestForm').addEventListener('submit', submitAppointment);
}

async function loadAvailableSlots() {
    try {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        const startDate = firstDay.toISOString().split('T')[0];
        const endDate = lastDay.toISOString().split('T')[0];

        // Haal geboekte afspraken op voor deze maand
        const response = await fetch(`${API_URL}/appointments?start_date=${startDate}&end_date=${endDate}`);
        
        if (!response.ok) {
            console.error('Failed to fetch appointments:', response.status);
            // Als de API faalt, toon alle werkdagen als beschikbaar
            createDefaultAvailableSlots(year, month, lastDay.getDate());
            renderCalendar();
            return;
        }
        
        const appointments = await response.json();
        console.log('Loaded appointments:', appointments);

        // Bereken beschikbare slots per dag
        availableSlots = {};
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let day = 1; day <= lastDay.getDate(); day++) {
            const date = new Date(year, month, day);
            
            // Skip alleen weekenden (niet verleden tijd voor test doeleinden)
            if (!WORK_DAYS.includes(date.getDay())) {
                continue;
            }

            const dateStr = date.toISOString().split('T')[0];
            const slots = generateTimeSlots();
            
            // Filter uit geboekte slots
            const bookedSlots = appointments
                .filter(apt => apt.appointment_date && apt.appointment_date.startsWith(dateStr))
                .map(apt => apt.start_time ? apt.start_time.substring(0, 5) : null)
                .filter(Boolean);

            const available = slots.filter(slot => !bookedSlots.includes(slot));
            
            if (available.length > 0) {
                availableSlots[dateStr] = {
                    total: slots.length,
                    available: available,
                    booked: bookedSlots
                };
            }
        }

        renderCalendar();
    } catch (error) {
        console.error('Error loading available slots:', error);
        // Fallback: maak default slots aan
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const lastDay = new Date(year, month + 1, 0);
        createDefaultAvailableSlots(year, month, lastDay.getDate());
        renderCalendar();
    }
}

function generateTimeSlots() {
    const slots = [];
    
    for (let hour = WORK_HOURS.start; hour < WORK_HOURS.end; hour++) {
        // Skip lunchpauze
        if (hour >= WORK_HOURS.breakStart && hour < WORK_HOURS.breakEnd) {
            continue;
        }
        
        const timeStr = `${String(hour).padStart(2, '0')}:00`;
        slots.push(timeStr);
    }
    
    return slots;
}

function createDefaultAvailableSlots(year, month, totalDays) {
    availableSlots = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let day = 1; day <= totalDays; day++) {
        const date = new Date(year, month, day);
        
        // Skip weekenden
        if (!WORK_DAYS.includes(date.getDay())) {
            continue;
        }
        
        const dateStr = date.toISOString().split('T')[0];
        const slots = generateTimeSlots();
        
        availableSlots[dateStr] = {
            total: slots.length,
            available: slots,
            booked: []
        };
    }
    console.log('Created default available slots:', availableSlots);
}

function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    document.getElementById('calendarMonth').textContent = `${monthNames[month]} ${year}`;

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevLastDay = new Date(year, month, 0);
    
    const firstDayOfWeek = firstDay.getDay() === 0 ? 7 : firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    const daysInPrevMonth = prevLastDay.getDate();

    let html = '';
    
    // Day headers
    dayNames.slice(1).concat(dayNames[0]).forEach(day => {
        html += `<div class="day-header">${day}</div>`;
    });

    // Previous month days
    for (let i = firstDayOfWeek - 1; i > 0; i--) {
        html += `<div class="calendar-day other-month">${daysInPrevMonth - i + 1}</div>`;
    }

    // Current month days
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dateStr = date.toISOString().split('T')[0];
        const isToday = date.getTime() === today.getTime();
        const isPast = date < today;
        const isWeekend = !WORK_DAYS.includes(date.getDay());
        const isSelected = selectedDate === dateStr;
        
        let classes = ['calendar-day'];
        if (isToday) classes.push('today');
        if (isSelected) classes.push('selected');
        if (isPast || isWeekend) classes.push('other-month');
        
        const slots = availableSlots[dateStr];
        if (slots && slots.available.length > 0) {
            classes.push('has-slots');
        } else if (!isPast && !isWeekend) {
            classes.push('fully-booked');
        }

        const clickable = !isPast && !isWeekend && slots && slots.available.length > 0;
        
        html += `<div class="${classes.join(' ')}" ${clickable ? `onclick="selectDate('${dateStr}')"` : ''}>
            ${day}
        </div>`;
    }

    // Next month days
    const totalCells = Math.ceil((firstDayOfWeek - 1 + daysInMonth) / 7) * 7;
    const remainingDays = totalCells - (firstDayOfWeek - 1 + daysInMonth);
    for (let i = 1; i <= remainingDays; i++) {
        html += `<div class="calendar-day other-month">${i}</div>`;
    }

    document.getElementById('miniCalendar').innerHTML = html;
}

function selectDate(dateStr) {
    selectedDate = dateStr;
    selectedTime = null;
    renderCalendar();
    renderTimeSlots();
    
    const date = new Date(dateStr);
    const dateDisplay = date.toLocaleDateString('nl-NL', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    document.getElementById('selectedDateDisplay').textContent = `Beschikbare tijden voor ${dateDisplay}`;
    document.getElementById('bookingForm').style.display = 'none';
}

function renderTimeSlots() {
    const container = document.getElementById('slotsContainer');
    
    if (!selectedDate || !availableSlots[selectedDate]) {
        container.innerHTML = '<div class="no-slots-message">Geen beschikbare tijden</div>';
        return;
    }

    const slots = availableSlots[selectedDate];
    let html = '';

    const allSlots = generateTimeSlots();
    allSlots.forEach(time => {
        const isAvailable = slots.available.includes(time);
        const isSelected = selectedTime === time;
        
        let classes = ['time-slot'];
        if (!isAvailable) classes.push('booked');
        if (isSelected) classes.push('selected');
        
        html += `<div class="${classes.join(' ')}" ${isAvailable ? `onclick="selectTime('${time}')"` : ''}>
            ${time}
        </div>`;
    });

    container.innerHTML = html;
}

function selectTime(time) {
    selectedTime = time;
    renderTimeSlots();
    showBookingForm();
}

function showBookingForm() {
    const form = document.getElementById('bookingForm');
    form.style.display = 'block';
    
    const date = new Date(selectedDate);
    const dateStr = date.toLocaleDateString('nl-NL', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    const endTime = calculateEndTime(selectedTime);
    
    document.getElementById('appointmentSummary').innerHTML = `
        <strong>Datum:</strong> ${dateStr}<br>
        <strong>Tijd:</strong> ${selectedTime} - ${endTime}
    `;
    
    // Scroll to form
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function calculateEndTime(startTime) {
    const [hours, minutes] = startTime.split(':').map(Number);
    const endHours = hours + 1;
    return `${String(endHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

async function submitAppointment(e) {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime) {
        showError('Selecteer eerst een datum en tijd');
        return;
    }

    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Bezig met aanvragen...';

    const name = document.getElementById('customerName').value;
    const email = document.getElementById('customerEmail').value;
    const phone = document.getElementById('customerPhone').value;
    const appointmentType = document.getElementById('appointmentType').value;
    const address = document.getElementById('customerAddress').value;
    const materialPreference = document.getElementById('materialPreference').value;
    const additionalInfo = document.getElementById('additionalInfo').value;

    try {
        // 1. Maak of vind klant
        let customer;
        const existingCustomer = await fetch(`${API_URL}/customers`);
        const customers = await existingCustomer.json();
        const found = customers.find(c => c.email === email);

        if (found) {
            customer = found;
        } else {
            const createCustomer = await fetch(`${API_URL}/customers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    email,
                    phone,
                    address,
                    notes: additionalInfo
                })
            });
            customer = await createCustomer.json();
        }

        // 2. Maak afspraak
        const endTime = calculateEndTime(selectedTime);
        const appointmentData = {
            customer_id: customer.id,
            title: `${appointmentType.charAt(0).toUpperCase() + appointmentType.slice(1)} - ${name}`,
            description: additionalInfo,
            appointment_date: selectedDate,
            start_time: selectedTime,
            end_time: endTime,
            status: 'gepland',
            appointment_type: appointmentType,
            location: address || 'Nader te bepalen',
            material_type: materialPreference || null,
            notes: `Aanvraag via website. Tel: ${phone}`
        };

        const createAppointment = await fetch(`${API_URL}/appointments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(appointmentData)
        });

        if (createAppointment.ok) {
            showSuccess(`Uw afspraak is succesvol aangevraagd! We sturen een bevestiging naar ${email}`);
            resetForm();
            await loadAvailableSlots();
        } else {
            throw new Error('Kon afspraak niet aanmaken');
        }

    } catch (error) {
        console.error('Error submitting appointment:', error);
        showError('Er is iets misgegaan. Probeer het opnieuw of neem contact met ons op.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Afspraak Aanvragen';
    }
}

function showSuccess(message) {
    const successDiv = document.getElementById('successMessage');
    successDiv.textContent = message;
    successDiv.style.display = 'block';
    
    setTimeout(() => {
        successDiv.style.display = 'none';
    }, 10000);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

function resetForm() {
    document.getElementById('appointmentRequestForm').reset();
    document.getElementById('bookingForm').style.display = 'none';
    selectedDate = null;
    selectedTime = null;
    renderCalendar();
    document.getElementById('slotsContainer').innerHTML = '';
    document.getElementById('selectedDateDisplay').textContent = 'Selecteer eerst een datum in de kalender';
}
