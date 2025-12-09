# 🎮 Unity Wave Jumping Game - Quick Start

Dit project bevat een **simpele 2.5D wave jumping game** met Arduino button besturing.

## 📂 Project Overzicht

Dit repository bevat:
- **UnityGame/**: Unity wave jumping game scripts en documentatie
- **Arduino/**: Arduino jump button code
- **Web app**: Kozijnen website (bestaande functionaliteit)

## 🚀 Snel Starten

### Unity Game
1. Ga naar `UnityGame/` folder
2. Lees `UnityGame/README.md` voor volledige setup instructies
3. Kopieer scripts naar je Unity project
4. Volg de setup stappen in de README

### Arduino
1. Ga naar `Arduino/` folder
2. Lees `Arduino/README.md` voor hardware setup
3. Upload `JumpButton.ino` naar je Arduino
4. Test met Serial Monitor

## 📋 Benodigdheden

### Software
- Unity 2020.3 LTS of nieuwer (2D template)
- Arduino IDE
- (Optioneel) Visual Studio Code voor code editing

### Hardware
- Arduino Uno/Nano of compatible
- Drukknop (push button)
- Jumper wires
- USB kabel

## 📖 Documentatie

- **[Unity Game Setup](UnityGame/README.md)** - Volledige Unity setup en code uitleg
- **[Arduino Setup](Arduino/README.md)** - Hardware schakeling en code uploaden

## 🎯 Game Features

- ✅ Automatische beweging naar rechts (endless runner)
- ✅ Jump met Spacebar OF Arduino knop
- ✅ Golf obstakels die gespawned worden
- ✅ Tijd-gebaseerde score
- ✅ Game over bij collision
- ✅ Simpel en beginner-vriendelijk
- ✅ Tropisch waterpark thema

## 🛠️ Unity Scripts

| Script | Functie |
|--------|---------|
| `PlayerController.cs` | Speler beweging, jumping, ground check |
| `ArduinoInput.cs` | Serial communicatie met Arduino |
| `WaveSpawner.cs` | Spawnt golf obstakels op interval |
| `GameManager.cs` | Score bijhouden en game over logica |

## 🔌 Arduino Code

| Bestand | Functie |
|---------|---------|
| `JumpButton.ino` | Leest knop input en stuurt "JUMP" commando |

## 💡 Belangrijk

- Code is **simpel en barebones** gehouden voor beginners
- Veel **comments** in Nederlandse taal
- **Makkelijk uit te breiden** met extra features
- Geen complexe dependencies of systemen

## 🎓 Voor Beginners

Deze game is speciaal gemaakt om:
- Unity basics te leren (2D physics, scripts, prefabs)
- Arduino communicatie te begrijpen
- Serial communicatie te oefenen
- Een volledig werkend spel te maken

## 🆘 Hulp Nodig?

Check de troubleshooting secties in:
- `UnityGame/README.md` voor Unity problemen
- `Arduino/README.md` voor Arduino problemen

## 📝 Licentie

Educational project - vrij te gebruiken voor leren en experimenteren.

---

**Happy Coding! 🚀**
