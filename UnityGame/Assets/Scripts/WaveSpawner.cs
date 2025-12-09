using UnityEngine;

/// <summary>
/// WaveSpawner - Spawnt golf obstakels op regelmatige intervallen
/// Golven bewegen naar links en worden na tijd vernietigd
/// </summary>
public class WaveSpawner : MonoBehaviour
{
    [Header("Wave Instellingen")]
    [Tooltip("Prefab van golf obstakel")]
    public GameObject wavePrefab;
    
    [Tooltip("Tijd tussen spawns (in seconden)")]
    public float spawnInterval = 2f;
    
    [Tooltip("Positie waar golven gespawnt worden")]
    public Transform spawnPoint;

    [Header("Wave Beweging")]
    [Tooltip("Snelheid waarmee golven naar links bewegen")]
    public float waveSpeed = 5f;

    [Header("Wave Cleanup")]
    [Tooltip("Tijd voordat golf automatisch vernietigd wordt (in seconden)")]
    public float destroyTime = 10f;

    // Timer voor spawn interval
    private float spawnTimer = 0f;

    void Start()
    {
        // Check of wavePrefab is toegewezen
        if (wavePrefab == null)
        {
            Debug.LogError("Wave Prefab niet toegewezen in WaveSpawner!");
        }

        // Check of spawnPoint is toegewezen
        if (spawnPoint == null)
        {
            Debug.LogWarning("SpawnPoint niet toegewezen, gebruik spawner positie");
            spawnPoint = transform;
        }
    }

    void Update()
    {
        // Update spawn timer
        spawnTimer += Time.deltaTime;

        // Check of het tijd is om nieuwe golf te spawnen
        if (spawnTimer >= spawnInterval)
        {
            SpawnWave();
            spawnTimer = 0f; // Reset timer
        }
    }

    /// <summary>
    /// Spawn een nieuwe golf obstakel
    /// </summary>
    void SpawnWave()
    {
        if (wavePrefab != null && spawnPoint != null)
        {
            // Maak nieuwe golf aan op spawn positie
            GameObject wave = Instantiate(wavePrefab, spawnPoint.position, Quaternion.identity);
            
            // Voeg Wave component toe als deze niet bestaat
            Wave waveScript = wave.GetComponent<Wave>();
            if (waveScript == null)
            {
                waveScript = wave.AddComponent<Wave>();
            }
            
            // Stel wave instellingen in
            waveScript.moveSpeed = waveSpeed;
            
            // Vernietig golf na bepaalde tijd
            Destroy(wave, destroyTime);
        }
    }
}

/// <summary>
/// Wave - Simpel script voor golf beweging
/// Beweegt automatisch naar links
/// </summary>
public class Wave : MonoBehaviour
{
    [HideInInspector]
    public float moveSpeed = 5f;

    void Update()
    {
        // Beweeg naar links
        transform.Translate(Vector3.left * moveSpeed * Time.deltaTime);
    }

    /// <summary>
    /// Collision met speler zorgt voor game over
    /// GameManager handelt dit af
    /// </summary>
    void OnTriggerEnter2D(Collider2D collision)
    {
        if (collision.CompareTag("Player"))
        {
            // Roep game over aan via GameManager
            GameManager gameManager = FindObjectOfType<GameManager>();
            if (gameManager != null)
            {
                gameManager.GameOver();
            }
        }
    }
}
