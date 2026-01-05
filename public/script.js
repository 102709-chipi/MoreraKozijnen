document.getElementById('year').textContent = new Date().getFullYear();

// Hamburger menu
const hamburger = document.getElementById('hamburger');
const mainNav = document.getElementById('mainNav');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mainNav.classList.toggle('active');
  });

  // Close menu when clicking on a link
  const navLinks = mainNav.querySelectorAll('a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mainNav.classList.remove('active');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mainNav.contains(e.target)) {
      hamburger.classList.remove('active');
      mainNav.classList.remove('active');
    }
  });
}

// Lightbox functionality
function openLightbox(imgSrc) {
  document.getElementById('lightbox').style.display = 'block';
  document.getElementById('lightbox-img').src = imgSrc;
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').style.display = 'none';
  document.body.style.overflow = 'auto';
}

// Add click event to gallery images
const galleryImages = document.querySelectorAll('.gallery img');
galleryImages.forEach(img => {
  img.addEventListener('click', () => openLightbox(img.src));
});

//calculator
const surfaceAreaInput = document.getElementById('surface-area');
const doorsInput = document.getElementById('doors');
const glassTypeSelect = document.getElementById('glass-type');
function calculatePrices() {
  const surfaceAreaValue = surfaceAreaInput.value.trim();
  const doorsValue = doorsInput.value.trim();
  
  const glassType = glassTypeSelect.value;
  
  // Parse values
  const surfaceArea = surfaceAreaValue === '' ? 0 : parseFloat(surfaceAreaValue);
  const doors = parseInt(doorsValue) || 0;
  
  // Validatie - minimaal oppervlakte OF deuren moet ingevuld zijn
  if ((surfaceAreaValue === '' && doors === 0) || surfaceArea < 0 || doors < 0) {
    alert('⚠️ Vul minimaal een oppervlakte (m²) of aantal deuren in');
    document.getElementById('results').style.display = 'none';
    return;
  }
  
  if (surfaceArea === 0 && doors === 0) {
    alert('⚠️ Vul minimaal een oppervlakte (m²) of aantal deuren in');
    document.getElementById('results').style.display = 'none';
    return;
  }
  
  // Base prices (starting price with 1 door, no surface area) for HR++
  const basePricesHRPlus = {
    kunststof: 2348,
    aluminium: 2709
  };
  
  // Base prices for HR+++ (same as HR++ base)
  const basePricesHRPlusPlus = {
    kunststof: 2348,
    aluminium: 2709
  };
  
  // Cost per m² of surface area for HR++
  const pricePerM2HRPlus = {
    kunststof: 917,
    aluminium: 1090
  };
  
  // Cost per m² of surface area for HR+++
  const pricePerM2HRPlusPlus = {
    kunststof: 974,
    aluminium: 1147
  };
  
  // Select the right prices based on glass type
  const basePrices = glassType === 'hr-plus-plus' ? basePricesHRPlusPlus : basePricesHRPlus;
  const pricePerM2 = glassType === 'hr-plus-plus' ? pricePerM2HRPlusPlus : pricePerM2HRPlus;
  
  // Calculate prices: (base price * doors) + (surface area * price per m²)
  const kunststofPrice = Math.round(basePrices.kunststof * doors + pricePerM2.kunststof * surfaceArea);
  const aluminiumPrice = Math.round(basePrices.aluminium * doors + pricePerM2.aluminium * surfaceArea);
  
  // Calculate differences
  const aluminiumDiff = Math.round(((aluminiumPrice - kunststofPrice) / kunststofPrice) * 100);
  
  // Update display
  document.getElementById('plastic-price').textContent = kunststofPrice.toLocaleString('nl-NL');
  document.getElementById('aluminum-price').textContent = aluminiumPrice.toLocaleString('nl-NL');
  document.getElementById('aluminum-diff').textContent = `+${aluminiumDiff}%`;
  
  // Show results with animation
  const resultsSection = document.getElementById('results');
  resultsSection.style.display = 'block';
  resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Verwijder automatische event listeners - alleen berekenen bij klik op knop
// surfaceAreaInput.addEventListener('input', calculatePrices);
// doorsInput.addEventListener('input', calculatePrices);
// glassTypeSelect.addEventListener('change', calculatePrices);

// Subsidy calculation
function calculateSubsidy() {
  const surfaceArea = parseFloat(surfaceAreaInput.value) || 0;
  const glassType = glassTypeSelect.value;
  
  // Subsidy only for HR+++ (triple glass)
  if (glassType === 'hr-plus-plus' && surfaceArea > 0) {
    const subsidyPerM2 = 111; // €111 per m²
    const totalSubsidy = Math.min(subsidyPerM2 * surfaceArea, 5000); // Max €5000
    
    document.getElementById('subsidy-glass-type').textContent = 'HR+++';
    document.getElementById('subsidy-per-m2').textContent = `€ ${subsidyPerM2} per m2 glas`;
    document.getElementById('subsidy-total').textContent = `Totaal subsidie: € ${Math.round(totalSubsidy).toLocaleString('nl-NL')}`;
    document.getElementById('subsidy-section').style.display = 'block';
  } else {
    document.getElementById('subsidy-section').style.display = 'none';
  }
}

// Update subsidy on input change
surfaceAreaInput.addEventListener('input', calculateSubsidy);
glassTypeSelect.addEventListener('change', calculateSubsidy);
calculateSubsidy();

// Price email form
const priceEmailForm = document.getElementById('price-email-form');
const emailStatusEl = document.getElementById('email-status');
priceEmailForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  emailStatusEl.textContent = 'Verzenden...';
  
  // Gather current price data
  const surfaceArea = parseFloat(surfaceAreaInput.value) || 0;
  const doors = parseInt(doorsInput.value) || 1;
  const glassType = glassTypeSelect.value;
  const kunststofPrice = document.getElementById('plastic-price').textContent;
  const aluminiumPrice = document.getElementById('aluminum-price').textContent;
  const subsidyTotal = document.getElementById('subsidy-total').textContent;
  
  const formData = new FormData(priceEmailForm);
  const payload = {
    email: formData.get('email'),
    surfaceArea,
    doors,
    glassType: glassType === 'hr-plus-plus' ? 'HR+++' : 'HR++',
    kunststofPrice,
    aluminiumPrice,
    subsidyTotal
  };
  
  try {
    const res = await fetch('/api/send-price', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Er ging iets mis bij verzenden');
    emailStatusEl.textContent = 'Prijsindicatie verzonden! Check je inbox.';
    priceEmailForm.reset();
  } catch (err) {
    emailStatusEl.textContent = err.message;
  }
});

// Contact form
const contactForm = document.getElementById('contact-form');
const statusEl = document.getElementById('contact-status');
contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  statusEl.textContent = 'Verzenden...';
  const formData = new FormData(contactForm);
  const payload = Object.fromEntries(formData.entries());
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Er ging iets mis bij verzenden');
    statusEl.textContent = 'Bedankt! We nemen spoedig contact op.';
    contactForm.reset();
  } catch (err) {
    statusEl.textContent = err.message;
  }
});


