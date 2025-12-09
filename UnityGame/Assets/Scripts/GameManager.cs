using UnityEngine;
using UnityEngine.SceneManagement;

/// <summary>
/// GameManager - Beheert game state en score
/// Simpele tijd-gebaseerde score en game over functionaliteit
/// </summary>
public class GameManager : MonoBehaviour
{
    [Header("Score")]
    [Tooltip("Punten per seconde")]
    public float scorePerSecond = 10f;
    
    private float currentScore = 0f;
    private bool gameIsOver = false;

    [Header("UI Referenties (optioneel)")]
    [Tooltip("UI Text voor score display (optioneel)")]
    public UnityEngine.UI.Text scoreText;
    
    [Tooltip("UI Panel voor game over scherm (optioneel)")]
    public GameObject gameOverPanel;

    void Start()
    {
        // Verberg game over panel bij start
        if (gameOverPanel != null)
        {
            gameOverPanel.SetActive(false);
        }

        // Reset time scale
        Time.timeScale = 1f;
    }

    void Update()
    {
        // Alleen score updaten als game niet over is
        if (!gameIsOver)
        {
            // Verhoog score gebaseerd op tijd
            currentScore += scorePerSecond * Time.deltaTime;

            // Update UI als scoreText beschikbaar is
            UpdateScoreUI();
        }

        // R toets om opnieuw te starten (handig voor testen)
        if (Input.GetKeyDown(KeyCode.R))
        {
            RestartGame();
        }
    }

    /// <summary>
    /// Update score display in UI
    /// </summary>
    void UpdateScoreUI()
    {
        if (scoreText != null)
        {
            scoreText.text = "Score: " + Mathf.FloorToInt(currentScore).ToString();
        }
    }

    /// <summary>
    /// Game Over - Aangeroepen wanneer speler golf raakt
    /// </summary>
    public void GameOver()
    {
        if (!gameIsOver)
        {
            gameIsOver = true;
            
            Debug.Log("GAME OVER! Eindscore: " + Mathf.FloorToInt(currentScore));
            
            // Toon game over panel als beschikbaar
            if (gameOverPanel != null)
            {
                gameOverPanel.SetActive(true);
            }

            // Pauzeer game (optioneel - verwijder deze regel om game door te laten lopen)
            // Time.timeScale = 0f;
        }
    }

    /// <summary>
    /// Herstart de huidige scene
    /// </summary>
    public void RestartGame()
    {
        // Reset time scale
        Time.timeScale = 1f;
        
        // Herlaad huidige scene
        SceneManager.LoadScene(SceneManager.GetActiveScene().name);
    }

    /// <summary>
    /// Geef huidige score terug (voor andere scripts)
    /// </summary>
    public float GetScore()
    {
        return currentScore;
    }

    /// <summary>
    /// Check of game over is (voor andere scripts)
    /// </summary>
    public bool IsGameOver()
    {
        return gameIsOver;
    }
}
