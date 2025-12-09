# Arduino Jump Button

Simpel Arduino programma voor jump button besturing in Unity game.

## 🔧 Hardware Setup

### Benodigdheden
- Arduino Uno/Nano (of compatible)
- Drukknop (push button)
- Jumper wires
- USB kabel

### Schakeling (Simpel - Geen externe weerstand nodig!)

```
  Arduino                Knop
  -------              --------
    
    Pin 2 ------------- Pin 1
    
    GND --------------- Pin 2
```

De code gebruikt `INPUT_PULLUP`, dus je hebt geen externe weerstand nodig!

### Alternatieve Schakeling (Met externe weerstand)

```
  +5V --- 10kΩ --- Pin 2 --- Knop --- GND
```

## 📤 Uploaden

1. Open **Arduino IDE**
2. Open `JumpButton.ino`
3. Selecteer je board: **Tools** → **Board** → **Arduino Uno** (of jouw board)
4. Selecteer de poort: **Tools** → **Port** → **COMx** (jouw Arduino poort)
5. Klik **Upload** (pijl knop)
6. Wacht tot "Done uploading" verschijnt

## 🧪 Testen

### In Arduino IDE
1. Open **Serial Monitor** (Ctrl+Shift+M of Tools → Serial Monitor)
2. Zet Baud Rate op **9600**
3. Je zou moeten zien: `Arduino Jump Button Ready!`
4. Druk op de knop
5. Je zou moeten zien: `JUMP`

### LED Feedback
- De ingebouwde LED (pin 13) gaat aan wanneer je de knop indrukt
- Dit geeft visuele feedback dat de knop werkt

## 🔌 COM Poort Vinden

### Windows
- Arduino IDE → **Tools** → **Port** (bijv. COM3, COM4, COM5)
- Of: **Device Manager** → **Ports (COM & LPT)**

### Mac
- Arduino IDE → **Tools** → **Port** (bijv. /dev/cu.usbserial-XXXX)
- Of Terminal: `ls /dev/cu.*`

### Linux  
- Arduino IDE → **Tools** → **Port** (bijv. /dev/ttyUSB0, /dev/ttyACM0)
- Of Terminal: `ls /dev/ttyUSB*` of `ls /dev/ttyACM*`

## 🐛 Troubleshooting

### Upload mislukt
- Check USB kabel (sommige kabels zijn alleen voor opladen!)
- Check of juiste board geselecteerd is
- Check of juiste COM poort geselecteerd is
- Probeer Arduino uit te trekken en opnieuw in te pluggen

### "JUMP" verschijnt niet in Serial Monitor
- Check of baud rate op 9600 staat
- Check bekabeling - vooral GND verbinding
- Probeer andere knop (misschien defect)
- Check of LED pin 13 wel aangaat bij drukken

### Meerdere "JUMP" bij één druk
- Dit is normaal bij oude/slechte knoppen (contact bounce)
- De code heeft basic debounce (50ms)
- Voor betere resultaten: gebruik hardware debounce capacitor (0.1µF)

### Unity krijgt geen JUMP commando
- Check of Serial Monitor in Arduino IDE **gesloten** is!
  - Unity en Arduino IDE kunnen niet tegelijk verbinden
- Check COM poort nummer in Unity ArduinoInput script
- Check of Arduino wel aangesloten is

## ⚙️ Code Uitleg

### Belangrijke Onderdelen

```cpp
const int BUTTON_PIN = 2;        // Knop op pin 2
const int DEBOUNCE_DELAY = 50;   // 50ms debounce
```

### Debounce
Wanneer je een fysieke knop indrukt, "bounce" de contacten een beetje. Dit kan meerdere signalen geven. Debounce voorkomt dit door alleen veranderingen te accepteren na een korte wachttijd (50ms).

### INPUT_PULLUP
```cpp
pinMode(BUTTON_PIN, INPUT_PULLUP);
```
Dit activeert een interne weerstand die de pin naar HIGH trekt. Wanneer je de knop indrukt, gaat de pin naar GND (LOW). Daarom is er geen externe weerstand nodig!

### Serial Communicatie
```cpp
Serial.begin(9600);       // Start met 9600 baud
Serial.println("JUMP");   // Stuur "JUMP" + newline
```

## 🎨 Aanpassingen

### Andere Pin Gebruiken
Verander deze regel:
```cpp
const int BUTTON_PIN = 2;  // Verander naar jouw pin nummer
```

### Andere Baud Rate
Verander beide bestanden (Arduino én Unity):
```cpp
Serial.begin(9600);  // Verander naar bijv. 115200
```

### Ander Commando Sturen
Verander deze regel:
```cpp
Serial.println("JUMP");  // Verander naar "CUSTOM"
```
En pas ArduinoInput.cs in Unity aan om hetzelfde commando te verwachten.

## 📚 Meer Leren

### Arduino Basics
- [Arduino Official Tutorials](https://www.arduino.cc/en/Tutorial/HomePage)
- [Arduino Button Tutorial](https://www.arduino.cc/en/Tutorial/BuiltInExamples/Button)

### Serial Communicatie
- [Arduino Serial Guide](https://www.arduino.cc/reference/en/language/functions/communication/serial/)

## 💡 Tips

1. **Test eerst in Serial Monitor** voordat je met Unity gaat verbinden
2. **Sluit Serial Monitor** in Arduino IDE voordat je Unity start
3. **LED feedback** helpt om te zien of knop werkt
4. **Kortere kabels** geven betrouwbaardere verbinding

Veel plezier met je game! 🎮
