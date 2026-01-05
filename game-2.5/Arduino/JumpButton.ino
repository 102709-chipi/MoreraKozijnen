/*
 * JumpButton.ino
 * Simpele Arduino code voor jump knop besturing
 * Stuurt "JUMP" commando via Serial wanneer knop ingedrukt wordt
 */

// Pin configuratie
const int BUTTON_PIN = 2;        // Knop aangesloten op pin 2
const int LED_PIN = 13;          // Ingebouwde LED (optioneel voor feedback)

// Debounce instellingen
const int DEBOUNCE_DELAY = 50;   // Debounce tijd in milliseconden
int lastButtonState = HIGH;      // Vorige staat van knop (HIGH = niet ingedrukt)
int buttonState;                 // Huidige staat van knop
unsigned long lastDebounceTime = 0;  // Laatste tijd dat knop veranderde

void setup() {
  // Initialiseer Serial communicatie
  Serial.begin(9600);
  
  // Configureer pins
  pinMode(BUTTON_PIN, INPUT_PULLUP);  // Knop met interne pull-up weerstand
  pinMode(LED_PIN, OUTPUT);           // LED als output
  
  // LED uit bij start
  digitalWrite(LED_PIN, LOW);
  
  // Wacht tot Serial verbinding klaar is
  while (!Serial) {
    ; // Wacht op Serial poort verbinding (alleen nodig voor native USB boards)
  }
  
  Serial.println("Arduino Jump Button Ready!");
}

void loop() {
  // Lees de knop staat
  int reading = digitalRead(BUTTON_PIN);
  
  // Check of knop staat veranderd is
  if (reading != lastButtonState) {
    // Reset debounce timer
    lastDebounceTime = millis();
  }
  
  // Check of debounce tijd verstreken is
  if ((millis() - lastDebounceTime) > DEBOUNCE_DELAY) {
    // Als knop staat werkelijk veranderd is
    if (reading != buttonState) {
      buttonState = reading;
      
      // Als knop is ingedrukt (LOW omdat we INPUT_PULLUP gebruiken)
      if (buttonState == LOW) {
        // Stuur JUMP commando
        Serial.println("JUMP");
        
        // LED aan als visuele feedback
        digitalWrite(LED_PIN, HIGH);
      } else {
        // LED uit wanneer knop losgelaten wordt
        digitalWrite(LED_PIN, LOW);
      }
    }
  }
  
  // Bewaar huidige staat voor volgende loop
  lastButtonState = reading;
}
