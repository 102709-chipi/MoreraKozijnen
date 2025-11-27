// Test datum parsing
const dateStr = "2025-11-27";

// Oude methode (geeft timezone problemen)
const oldWay = new Date(dateStr);
console.log("OLD WAY (fout):");
console.log("Date object:", oldWay);
console.log("Locale string:", oldWay.toLocaleDateString('nl-NL', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
}));

console.log("\n---\n");

// Nieuwe methode (correct)
const [year, month, day] = dateStr.split('-').map(Number);
const newWay = new Date(year, month - 1, day);
console.log("NEW WAY (goed):");
console.log("Date object:", newWay);
console.log("Locale string:", newWay.toLocaleDateString('nl-NL', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
}));
