using UnityEngine;
using System.IO.Ports;
using System;

/// <summary>
/// ArduinoInput - Leest input van Arduino via Serial communicatie
/// Luistert naar "JUMP" commando en roept Jump functie aan
/// </summary>
public class ArduinoInput : MonoBehaviour
{
    [Header("Serial Poort Instellingen")]
    [Tooltip("COM poort naam (bijv. COM3 of /dev/ttyUSB0)")]
    public string portName = "COM3";
    
    [Tooltip("Baud rate (moet overeenkomen met Arduino)")]
    public int baudRate = 9600;

    [Header("Referenties")]
    [Tooltip("Referentie naar PlayerController")]
    public PlayerController playerController;

    // Serial poort object
    private SerialPort serialPort;

    void Start()
    {
        try
        {
            // Maak nieuwe SerialPort aan
            serialPort = new SerialPort(portName, baudRate);
            serialPort.ReadTimeout = 50; // Timeout in milliseconden
            
            // Open de poort
            serialPort.Open();
            
            Debug.Log("Arduino verbonden op " + portName);
        }
        catch (Exception e)
        {
            Debug.LogWarning("Kon geen verbinding maken met Arduino: " + e.Message);
            Debug.LogWarning("Spel werkt alleen met spacebar input.");
        }

        // Check of playerController is toegewezen
        if (playerController == null)
        {
            Debug.LogError("PlayerController niet toegewezen in ArduinoInput!");
        }
    }

    void Update()
    {
        // Alleen lezen als poort open is
        if (serialPort != null && serialPort.IsOpen)
        {
            try
            {
                // Probeer data te lezen van Arduino
                if (serialPort.BytesToRead > 0)
                {
                    string data = serialPort.ReadLine().Trim();
                    
                    // Check of "JUMP" commando ontvangen is
                    if (data == "JUMP")
                    {
                        Debug.Log("JUMP commando ontvangen van Arduino");
                        
                        // Roep Jump functie aan op player
                        if (playerController != null)
                        {
                            playerController.Jump();
                        }
                    }
                }
            }
            catch (TimeoutException)
            {
                // Normaal - geen data beschikbaar
            }
            catch (Exception e)
            {
                Debug.LogWarning("Fout bij lezen Arduino data: " + e.Message);
            }
        }
    }

    /// <summary>
    /// Sluit serial poort wanneer applicatie afgesloten wordt
    /// </summary>
    void OnApplicationQuit()
    {
        if (serialPort != null && serialPort.IsOpen)
        {
            serialPort.Close();
            Debug.Log("Serial poort gesloten");
        }
    }

    /// <summary>
    /// Sluit ook bij disable (voor editor)
    /// </summary>
    void OnDisable()
    {
        if (serialPort != null && serialPort.IsOpen)
        {
            serialPort.Close();
        }
    }
}
