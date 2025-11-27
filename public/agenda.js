// Agenda JavaScript
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api' 
    : '/api';

let currentDate = new Date();
let currentView = 'calendar';
let appointments = [];
let customers = [];
let editingAppointmentId = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    loadCustomers();
    loadAppointments();
});

function initializeEventListeners() {
    // View toggle
    document.getElementById('calendarViewBtn').addEventListener('click', () => switchView('calendar'));
    document.getElementById('listViewBtn').addEventListener('click', () => switchView('list'));

    // Calendar navigation
    document.getElementById('prevMonth').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    document.getElementById('nextMonth').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    // Filters
    document.getElementById('statusFilter').addEventListener('change', filterAppointments);
    document.getElementById('typeFilter').addEventListener('change', filterAppointments);

    // Modal
    document.getElementById('newAppointmentBtn').addEventListener('click', () => openModal());
    document.getElementById('cancelBtn').addEventListener('click', closeModal);
    document.getElementById('deleteBtn').addEventListener('click', deleteAppointment);
    document.getElementById('appointmentForm').addEventListener('submit', saveAppointment);

    // Close modal on outside click
    document.getElementById('appointmentModal').addEventListener('click', (e) => {
        if (e.target.id === 'appointmentModal') closeModal();
    });
}

function switchView(view) {
    currentView = view;
    
    document.getElementById('calendarViewBtn').classList.toggle('active', view === 'calendar');
    document.getElementById('listViewBtn').classList.toggle('active', view === 'list');
    
    document.getElementById('calendarSection').style.display = view === 'calendar' ? 'block' : 'none';
    document.getElementById('listSection').classList.toggle('active', view === 'list');

    if (view === 'calendar') {
        renderCalendar();
    } else {
        renderList();
    }
}

async function loadCustomers() {
    try {
        const response = await fetch(`${API_URL}/customers`);
        customers = await response.json();
        populateCustomerSelect();
    } catch (error) {
        console.error('Error loading customers:', error);
        alert('Kon klanten niet laden');
    }
}

function populateCustomerSelect() {
    const select = document.getElementById('customerId');
    select.innerHTML = '<option value="">Selecteer klant...</option>';
    
    customers.forEach(customer => {
        const option = document.createElement('option');
        option.value = customer.id;
        option.textContent = `${customer.name} (${customer.email})`;
        select.appendChild(option);
    });
}

async function loadAppointments() {
    showLoading(true);
    try {
        const response = await fetch(`${API_URL}/appointments`);
        appointments = await response.json();
        
        if (currentView === 'calendar') {
            renderCalendar();
        } else {
            renderList();
        }
    } catch (error) {
        console.error('Error loading appointments:', error);
        alert('Kon afspraken niet laden');
    } finally {
        showLoading(false);
    }
}

function filterAppointments() {
    const status = document.getElementById('statusFilter').value;
    const type = document.getElementById('typeFilter').value;

    if (currentView === 'calendar') {
        renderCalendar();
    } else {
        renderList();
    }
}

function getFilteredAppointments() {
    const status = document.getElementById('statusFilter').value;
    const type = document.getElementById('typeFilter').value;

    return appointments.filter(apt => {
        if (status && apt.status !== status) return false;
        if (type && apt.appointment_type !== type) return false;
        return true;
    });
}

function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Update header
    const monthNames = ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni',
                       'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'];
    document.getElementById('currentMonth').textContent = `${monthNames[month]} ${year}`;

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevLastDay = new Date(year, month, 0);
    
    const firstDayOfWeek = firstDay.getDay() === 0 ? 7 : firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    const daysInPrevMonth = prevLastDay.getDate();

    let html = '';
    
    // Headers
    const dayNames = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'];
    dayNames.forEach(day => {
        html += `<div class="calendar-header">${day}</div>`;
    });

    // Previous month days
    for (let i = firstDayOfWeek - 1; i > 0; i--) {
        html += `<div class="calendar-day other-month">
            <div class="day-number">${daysInPrevMonth - i + 1}</div>
        </div>`;
    }

    // Current month days
    const today = new Date();
    const filteredAppointments = getFilteredAppointments();

    for (let day = 1; day <= daysInMonth; day++) {
        const currentDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
        
        const dayAppointments = filteredAppointments.filter(apt => 
            apt.appointment_date && apt.appointment_date.startsWith(currentDateStr)
        );

        html += `<div class="calendar-day ${isToday ? 'today' : ''}" data-date="${currentDateStr}">
            <div class="day-number">${day}</div>`;
        
        dayAppointments.forEach(apt => {
            html += `<div class="appointment-item ${apt.status}" onclick="viewAppointment(${apt.id})" title="${apt.title}">
                ${apt.start_time ? apt.start_time.substring(0, 5) : ''} ${apt.title}
            </div>`;
        });
        
        html += '</div>';
    }

    // Next month days
    const remainingDays = 42 - (firstDayOfWeek - 1 + daysInMonth);
    for (let i = 1; i <= remainingDays; i++) {
        html += `<div class="calendar-day other-month">
            <div class="day-number">${i}</div>
        </div>`;
    }

    document.getElementById('calendarView').innerHTML = html;
}

function renderList() {
    const filtered = getFilteredAppointments();
    const sorted = filtered.sort((a, b) => {
        const dateA = new Date(a.appointment_date + ' ' + a.start_time);
        const dateB = new Date(b.appointment_date + ' ' + b.start_time);
        return dateB - dateA;
    });

    let html = '';

    if (sorted.length === 0) {
        html = '<p style="text-align: center; padding: 40px; color: #666;">Geen afspraken gevonden</p>';
    } else {
        sorted.forEach(apt => {
            const date = new Date(apt.appointment_date);
            const dateStr = date.toLocaleDateString('nl-NL', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });

            html += `
                <div class="appointment-card ${apt.status}" onclick="viewAppointment(${apt.id})">
                    <div class="appointment-header">
                        <div>
                            <div class="appointment-title">${apt.title}</div>
                            <div style="color: #666; font-size: 14px; margin-top: 5px;">
                                ${apt.customer_name || 'Geen klant'}
                            </div>
                        </div>
                        <span class="appointment-status status-${apt.status}">${apt.status}</span>
                    </div>
                    <div class="appointment-details">
                        <div>📅 ${dateStr}</div>
                        <div>🕐 ${apt.start_time ? apt.start_time.substring(0, 5) : ''} - ${apt.end_time ? apt.end_time.substring(0, 5) : ''}</div>
                        ${apt.appointment_type ? `<div>📋 ${apt.appointment_type}</div>` : ''}
                        ${apt.location ? `<div>📍 ${apt.location}</div>` : ''}
                        ${apt.material_type ? `<div>🪟 ${apt.material_type}</div>` : ''}
                        ${apt.estimated_price ? `<div>💰 €${parseFloat(apt.estimated_price).toFixed(2)}</div>` : ''}
                        ${apt.description ? `<div style="margin-top: 10px;">${apt.description}</div>` : ''}
                    </div>
                </div>
            `;
        });
    }

    document.getElementById('appointmentList').innerHTML = html;
}

function openModal(appointmentId = null) {
    editingAppointmentId = appointmentId;
    const modal = document.getElementById('appointmentModal');
    const form = document.getElementById('appointmentForm');
    const deleteBtn = document.getElementById('deleteBtn');

    form.reset();

    if (appointmentId) {
        const appointment = appointments.find(a => a.id === appointmentId);
        if (appointment) {
            document.getElementById('modalTitle').textContent = 'Afspraak Bewerken';
            document.getElementById('customerId').value = appointment.customer_id || '';
            document.getElementById('appointmentTitle').value = appointment.title || '';
            document.getElementById('appointmentType').value = appointment.appointment_type || 'opname';
            document.getElementById('appointmentDate').value = appointment.appointment_date || '';
            document.getElementById('startTime').value = appointment.start_time || '';
            document.getElementById('endTime').value = appointment.end_time || '';
            document.getElementById('appointmentStatus').value = appointment.status || 'gepland';
            document.getElementById('location').value = appointment.location || '';
            document.getElementById('materialType').value = appointment.material_type || '';
            document.getElementById('estimatedPrice').value = appointment.estimated_price || '';
            document.getElementById('description').value = appointment.description || '';
            document.getElementById('notes').value = appointment.notes || '';
            deleteBtn.style.display = 'block';
        }
    } else {
        document.getElementById('modalTitle').textContent = 'Nieuwe Afspraak';
        deleteBtn.style.display = 'none';
        
        // Set default date to today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('appointmentDate').value = today;
    }

    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('appointmentModal').classList.remove('active');
    editingAppointmentId = null;
}

async function saveAppointment(e) {
    e.preventDefault();

    const data = {
        customer_id: parseInt(document.getElementById('customerId').value),
        title: document.getElementById('appointmentTitle').value,
        appointment_type: document.getElementById('appointmentType').value,
        appointment_date: document.getElementById('appointmentDate').value,
        start_time: document.getElementById('startTime').value,
        end_time: document.getElementById('endTime').value,
        status: document.getElementById('appointmentStatus').value,
        location: document.getElementById('location').value,
        material_type: document.getElementById('materialType').value || null,
        estimated_price: document.getElementById('estimatedPrice').value || null,
        description: document.getElementById('description').value,
        notes: document.getElementById('notes').value,
    };

    try {
        const url = editingAppointmentId 
            ? `${API_URL}/appointments/${editingAppointmentId}`
            : `${API_URL}/appointments`;
        
        const method = editingAppointmentId ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            closeModal();
            await loadAppointments();
            alert('Afspraak opgeslagen!');
        } else {
            const error = await response.json();
            alert(`Fout: ${error.error || 'Kon afspraak niet opslaan'}`);
        }
    } catch (error) {
        console.error('Error saving appointment:', error);
        alert('Kon afspraak niet opslaan');
    }
}

async function deleteAppointment() {
    if (!editingAppointmentId) return;

    if (!confirm('Weet u zeker dat u deze afspraak wilt verwijderen?')) return;

    try {
        const response = await fetch(`${API_URL}/appointments/${editingAppointmentId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            closeModal();
            await loadAppointments();
            alert('Afspraak verwijderd!');
        } else {
            alert('Kon afspraak niet verwijderen');
        }
    } catch (error) {
        console.error('Error deleting appointment:', error);
        alert('Kon afspraak niet verwijderen');
    }
}

function viewAppointment(id) {
    openModal(id);
}

function showLoading(show) {
    document.getElementById('loadingIndicator').style.display = show ? 'block' : 'none';
}
