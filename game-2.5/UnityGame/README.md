# Unity Wave Jumping Game - Tropisch Waterpark

Een simpele 2.5D endless runner game met Arduino knop besturing. Tropical waterpark thema.

## 🎮 Game Concept

- Speler beweegt automatisch naar rechts
- Spring over golf obstakels
- Score stijgt met tijd
- Game over bij aanraking met golf
- Besturing: Spacebar OF Arduino knop

## 📁 Project Structuur

```
UnityGame/
├── Assets/
│   └── Scripts/
│       ├── PlayerController.cs    - Speler beweging en springen
│       ├── ArduinoInput.cs        - Arduino communicatie
│       ├── WaveSpawner.cs         - Golf obstakels spawnen
│       └── GameManager.cs         - Score en game state
Arduino/
└── JumpButton.ino                 - Arduino knop code
```

## 🚀 Unity Setup

### 1. Maak Nieuw Unity Project
1. Open Unity Hub
2. Maak nieuw **2D** project
3. Naam: "WaveJumpingGame"

### 2. Importeer Scripts
1. Kopieer alle `.cs` bestanden uit `UnityGame/Assets/Scripts/` naar je Unity project `Assets/Scripts/` folder
2. Unity zal de scripts automatisch compileren

### 3. Scene Setup

#### A. Player Object
1. **Create** → **2D Object** → **Sprite** (of gebruik een cirkel/vierkant)
2. Naam: "Player"
3. Tag: "Player" (belangrijk!)
4. **Add Component** → **Rigidbody2D**
   - Gravity Scale: 2
   - Constraints: Freeze Rotation Z
5. **Add Component** → **Box Collider 2D** (of Circle Collider 2D)
6. **Add Component** → **PlayerController** (script)
7. Maak empty GameObject als child: "GroundCheck"
   - Positioneer net onder player (bij de voeten)
   - Sleep GroundCheck naar PlayerController → Ground Check field
8. PlayerController instellingen:
   - Move Speed: 5
   - Jump Force: 10
   - Ground Check Radius: 0.2
   - Ground Layer: "Ground" (zie hieronder)

#### B. Ground Object
1. **Create** → **2D Object** → **Sprite**
2. Naam: "Ground"
3. Layer: Maak nieuwe layer "Ground"
4. **Add Component** → **Box Collider 2D**
5. Schaal het om een platform te maken waar speler op loopt

#### C. Wave Prefab
1. **Create** → **2D Object** → **Sprite**
2. Naam: "Wave"
3. Geef het een blauwe kleur (voor water)
4. **Add Component** → **Box Collider 2D**
   - Is Trigger: ✓ (aanvinken!)
5. **Add Component** → **Wave** (script - wordt automatisch toegevoegd door WaveSpawner)
6. Sleep naar Assets folder om Prefab te maken
7. Verwijder uit scene

#### D. Wave Spawner
1. **Create Empty** GameObject
2. Naam: "WaveSpawner"
3. **Add Component** → **WaveSpawner** (script)
4. Positioneer rechts van scherm (buiten camera view)
5. WaveSpawner instellingen:
   - Wave Prefab: Sleep Wave prefab hierheen
   - Spawn Interval: 2 (elke 2 seconden)
   - Wave Speed: 5
   - Destroy Time: 10

#### E. Game Manager
1. **Create Empty** GameObject
2. Naam: "GameManager"
3. **Add Component** → **GameManager** (script)
4. GameManager instellingen:
   - Score Per Second: 10

#### F. Arduino Input (Optioneel)
1. **Create Empty** GameObject
2. Naam: "ArduinoInput"
3. **Add Component** → **ArduinoInput** (script)
4. ArduinoInput instellingen:
   - Port Name: "COM3" (of jouw Arduino poort)
   - Baud Rate: 9600
   - Player Controller: Sleep Player object hierheen

### 4. Camera Instelling
1. Selecteer Main Camera
2. Positioneer zodat Ground en Player zichtbaar zijn
3. Size: 5-10 (afhankelijk van je schaal)

### 5. Layers Setup
1. **Edit** → **Project Settings** → **Tags and Layers**
2. Voeg "Ground" layer toe
3. Zorg dat Ground object deze layer heeft
4. Stel Ground Layer in PlayerController in op "Ground"

## 🔌 Arduino Setup

### Hardware Benodigdheden
- Arduino (Uno, Nano, of compatible)
- Drukknop (push button)
- 10kΩ weerstand (optioneel - Arduino heeft interne pull-up)
- Jumper wires
- USB kabel

### Breadboard Schakeling
```
Arduino Pin 2 -----> Knop -----> GND
                      |
                   (interne pull-up weerstand)
```

**Simpele aansluiting:**
- Knop pin 1 → Arduino pin 2
- Knop pin 2 → GND
- Code gebruikt INPUT_PULLUP, dus geen externe weerstand nodig!

### Arduino Code Uploaden
1. Open Arduino IDE
2. Open `Arduino/JumpButton.ino`
3. Selecteer juiste **Board** en **Port** in Tools menu
4. Klik **Upload**
5. Open **Serial Monitor** (Ctrl+Shift+M) om te testen
6. Druk op knop - je zou "JUMP" moeten zien

### COM Poort Vinden
**Windows:**
- Arduino IDE → Tools → Port (bijv. COM3, COM4)
- Of: Device Manager → Ports (COM & LPT)

**Mac:**
- Arduino IDE → Tools → Port (bijv. /dev/cu.usbserial)
- Of: Terminal → `ls /dev/cu.*`

**Linux:**
- Arduino IDE → Tools → Port (bijv. /dev/ttyUSB0)
- Of: Terminal → `ls /dev/ttyUSB*`

## 🎨 Tropisch Waterpark Thema (Optioneel)

### Visuele Aanpassingen
1. **Achtergrond**: Lichtblauwe kleur voor lucht/water
2. **Speler**: Gebruik sprite van surfboard of zwemband
3. **Golven**: Blauwe sprites met wave pattern
4. **Ground**: Gele/beige kleur voor zandstrand
5. **Palmbomen**: Voeg decoratieve sprites toe op achtergrond

### Assets Zoeken
- Unity Asset Store (gratis 2D sprites)
- OpenGameArt.org
- Itch.io (gratis game assets)
- Kenney.nl (gratis game assets)

## ✅ Testen

### Zonder Arduino
1. Druk **Play** in Unity
2. Gebruik **Spacebar** om te springen
3. Ontwijt de golven
4. Druk **R** om opnieuw te starten

### Met Arduino
1. Zorg dat Arduino verbonden is en JumpButton.ino draait
2. Stel juiste COM poort in ArduinoInput
3. Druk **Play** in Unity
4. Check Console voor "Arduino verbonden op COMx"
5. Gebruik Arduino knop OF spacebar om te springen

## 🐛 Troubleshooting

### Player valt door grond
- Check of Ground Collider 2D aanstaat
- Check of Player Rigidbody2D collision detection op "Continuous"

### Jump werkt niet
- Check of isGrounded = true in Inspector tijdens gameplay
- Check Ground Check positie (moet net onder player zijn)
- Check Ground Layer instellingen

### Arduino verbindt niet
- Check COM poort nummer in ArduinoInput
- Check of Arduino IDE Serial Monitor gesloten is (kan conflict geven)
- Check of JumpButton.ino geüpload is
- Check Serial Monitor in Arduino IDE - zie je "JUMP" bij knop drukken?

### Golven spawnen niet
- Check of Wave Prefab toegewezen is in WaveSpawner
- Check of WaveSpawner actief is (vinkje aan)
- Check Console voor error messages

### Game over werkt niet
- Check of Wave Collider2D "Is Trigger" aanstaat
- Check of Player tag correct is ("Player")

## 📝 Code Uitleg (Voor Beginners)

### PlayerController.cs
- `moveSpeed`: Hoe snel speler naar rechts beweegt
- `jumpForce`: Hoe hoog speler springt
- `Jump()`: Public functie - kan aangeroepen worden door andere scripts
- `CheckGround()`: Kijkt of speler grond raakt

### ArduinoInput.cs
- `SerialPort`: Verbinding met Arduino
- `ReadLine()`: Leest tekst van Arduino
- Als "JUMP" ontvangen → roep `player.Jump()` aan

### WaveSpawner.cs
- Spawnt elke X seconden een golf
- Golven bewegen naar links met vaste snelheid
- Oude golven worden automatisch verwijderd

### GameManager.cs
- `currentScore`: Huidige score (stijgt met tijd)
- `GameOver()`: Wordt aangeroepen bij collision met golf
- `RestartGame()`: Herstart de scene

### JumpButton.ino
- `digitalRead()`: Leest knop status (HIGH/LOW)
- Debounce: Voorkomt meerdere triggers bij één druk
- `Serial.println("JUMP")`: Stuurt commando naar Unity

## 🎓 Volgende Stappen (Uitbreidingen)

1. **UI Toevoegen**: Score display, Game Over scherm
2. **Moeilijkheidsgraad**: Verhoog spawn rate over tijd
3. **Power-ups**: Dubbele jump, slow-motion
4. **Animaties**: Sprite animations voor speler en golven
5. **Geluid**: Jump sound, achtergrond muziek, splash effects
6. **Meerdere obstakels**: Verschillende soorten golven
7. **High Score**: Sla beste score op met PlayerPrefs

## 📄 Licentie

Simpel educational project - vrij te gebruiken voor leren en experimenteren.

## 🤝 Credits

Gemaakt voor beginnende Unity en Arduino ontwikkelaars.
