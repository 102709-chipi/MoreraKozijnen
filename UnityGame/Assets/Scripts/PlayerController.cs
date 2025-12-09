using UnityEngine;

/// <summary>
/// PlayerController - Beheert speler beweging en springen
/// Automatisch naar rechts bewegen (endless runner stijl)
/// </summary>
public class PlayerController : MonoBehaviour
{
    [Header("Beweging")]
    [Tooltip("Snelheid waarmee speler automatisch naar rechts beweegt")]
    public float moveSpeed = 5f;

    [Header("Springen")]
    [Tooltip("Kracht van de sprong")]
    public float jumpForce = 10f;
    
    [Tooltip("Is speler op de grond?")]
    private bool isGrounded = false;
    
    [Header("Ground Check")]
    [Tooltip("Transform positie onder speler voor ground check")]
    public Transform groundCheck;
    
    [Tooltip("Straal van ground check cirkel")]
    public float groundCheckRadius = 0.2f;
    
    [Tooltip("Layer voor grond objecten")]
    public LayerMask groundLayer;

    // Referenties
    private Rigidbody2D rb;

    void Start()
    {
        // Haal Rigidbody2D component op
        rb = GetComponent<Rigidbody2D>();
        
        // Check of Rigidbody2D aanwezig is
        if (rb == null)
        {
            Debug.LogError("Rigidbody2D component niet gevonden op " + gameObject.name + "!");
        }
    }

    void Update()
    {
        // Check of speler op grond is
        CheckGround();
        
        // Spacebar input voor springen
        if (Input.GetKeyDown(KeyCode.Space) && isGrounded)
        {
            Jump();
        }
    }

    void FixedUpdate()
    {
        // Automatisch naar rechts bewegen
        if (rb != null)
        {
            rb.velocity = new Vector2(moveSpeed, rb.velocity.y);
        }
    }

    /// <summary>
    /// Voer sprong uit
    /// Kan aangeroepen worden door spacebar OF Arduino input
    /// </summary>
    public void Jump()
    {
        // Alleen springen als op de grond en Rigidbody2D beschikbaar is
        if (isGrounded && rb != null)
        {
            rb.velocity = new Vector2(rb.velocity.x, jumpForce);
        }
    }

    /// <summary>
    /// Check of speler op de grond staat
    /// Gebruikt Physics2D overlap circle
    /// </summary>
    void CheckGround()
    {
        // Check overlap met grond layer (alleen als groundCheck ingesteld is)
        if (groundCheck != null)
        {
            isGrounded = Physics2D.OverlapCircle(groundCheck.position, groundCheckRadius, groundLayer);
        }
    }

    /// <summary>
    /// Teken ground check radius in editor (voor debugging)
    /// </summary>
    void OnDrawGizmosSelected()
    {
        if (groundCheck != null)
        {
            Gizmos.color = Color.red;
            Gizmos.DrawWireSphere(groundCheck.position, groundCheckRadius);
        }
    }
}
