document.getElementById('year').textContent = new Date().getFullYear();

// Simple gallery (placeholder images). Replace with real project photos
const gallery = document.getElementById('gallery');
const images = [
  'https://images.unsplash.com/photo-1523419409543-a3374a631b2b?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1596867559249-23fa3a2242ba?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600585154340-1e8e8e6b3d9b?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1200&auto=format&fit=crop'
];
images.forEach(src => {
  const img = document.createElement('img');
  img.src = src;
  img.alt = 'Kozijn project';
  gallery.appendChild(img);
});

// Price calculator
const surfaceAreaInput = document.getElementById('surface-area');
const doorsInput = document.getElementById('doors');
const glassTypeSelect = document.getElementById('glass-type');
function calculatePrices() {
  const surfaceAreaValue = surfaceAreaInput.value.trim();
  const doorsValue = doorsInput.value.trim();
  
  const glassType = glassTypeSelect.value;
  
  // If surface area is empty, show default base prices (no surface area)
  if (surfaceAreaValue === '') {
    // Same base prices for both glass types when no surface area
    document.getElementById('plastic-price').textContent = '€ 2.348';
    document.getElementById('wood-price').textContent = '€ 2.589';
    document.getElementById('aluminum-price').textContent = '€ 2.709';
    document.getElementById('wood-diff').textContent = '+10%';
    document.getElementById('aluminum-diff').textContent = '+15%';
    return;
  }
  
  const surfaceArea = parseFloat(surfaceAreaValue);
  const doors = parseInt(doorsValue) || 1;
  
  // Base prices (starting price with 1 door, no surface area) for HR++
  const basePricesHRPlus = {
    kunststof: 2348,
    hout: 2589,
    aluminium: 2709
  };
  
  // Base prices for HR+++ (same as HR++ base)
  const basePricesHRPlusPlus = {
    kunststof: 2348,
    hout: 2589,
    aluminium: 2709
  };
  
  // Cost per m² of surface area for HR++
  const pricePerM2HRPlus = {
    kunststof: 917,   // (20688 - 2348) / 20 = 917
    hout: 1032,       // (23229 - 2589) / 20 = 1032
    aluminium: 1090   // (24509 - 2709) / 20 = 1090
  };
  
  // Cost per m² of surface area for HR+++ (calculated from 1m² data)
  const pricePerM2HRPlusPlus = {
    kunststof: 974,   // 3322 - 2348 = 974 per m²
    hout: 1089,       // 3678 - 2589 = 1089 per m²
    aluminium: 1147   // Exact value to match OKS website
  };
  
  // Select the right prices based on glass type
  const basePrices = glassType === 'hr-plus-plus' ? basePricesHRPlusPlus : basePricesHRPlus;
  const pricePerM2 = glassType === 'hr-plus-plus' ? pricePerM2HRPlusPlus : pricePerM2HRPlus;
  
  // Calculate prices: (base price * doors) + (surface area * price per m²)
  const kunststofPrice = Math.round(basePrices.kunststof * doors + pricePerM2.kunststof * surfaceArea);
  const houtPrice = Math.round(basePrices.hout * doors + pricePerM2.hout * surfaceArea);
  const aluminiumPrice = Math.round(basePrices.aluminium * doors + pricePerM2.aluminium * surfaceArea);
  
  // Calculate differences
  const houtDiff = Math.round(((houtPrice - kunststofPrice) / kunststofPrice) * 100);
  const aluminiumDiff = Math.round(((aluminiumPrice - kunststofPrice) / kunststofPrice) * 100);
  
  // Update display
  document.getElementById('plastic-price').textContent = `€ ${kunststofPrice.toLocaleString('nl-NL')}`;
  document.getElementById('wood-price').textContent = `€ ${houtPrice.toLocaleString('nl-NL')}`;
  document.getElementById('aluminum-price').textContent = `€ ${aluminiumPrice.toLocaleString('nl-NL')}`;
  document.getElementById('wood-diff').textContent = `+${houtDiff}%`;
  document.getElementById('aluminum-diff').textContent = `+${aluminiumDiff}%`;
}

// Add event listeners
surfaceAreaInput.addEventListener('input', calculatePrices);
doorsInput.addEventListener('input', calculatePrices);
glassTypeSelect.addEventListener('change', calculatePrices);

// Initial calculation
calculatePrices();

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
  const houtPrice = document.getElementById('wood-price').textContent;
  const aluminiumPrice = document.getElementById('aluminum-price').textContent;
  const subsidyTotal = document.getElementById('subsidy-total').textContent;
  
  const formData = new FormData(priceEmailForm);
  const payload = {
    email: formData.get('email'),
    surfaceArea,
    doors,
    glassType: glassType === 'hr-plus-plus' ? 'HR+++' : 'HR++',
    kunststofPrice,
    houtPrice,
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


