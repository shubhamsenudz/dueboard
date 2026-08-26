package in.senudz.dueboard;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.time.Instant;
import java.util.Map;
@RestController @RequestMapping("/api/auth")
public class AuthController {
    private static final Logger log = LoggerFactory.getLogger(AuthController.class);
    private final TenantRepository tenants; private final UserRepository users;
    private final PasswordEncoder encoder; private final JwtService jwt;
    public AuthController(TenantRepository tenants, UserRepository users, PasswordEncoder encoder, JwtService jwt){
        this.tenants=tenants; this.users=users; this.encoder=encoder; this.jwt=jwt;
    }
    public record RegisterReq(String tenantName, String city, String fullName, String email, String password){}
    public record LoginReq(String email, String password){}
    @PostMapping("/register") public Map<String,Object> register(@RequestBody RegisterReq req){
        if (req.email()==null || req.password()==null || req.password().length()<8) throw new RuntimeException("Password must be at least 8 characters");
        if (req.tenantName()==null || req.tenantName().isBlank()) throw new RuntimeException("Workspace name is required");
        String email = req.email().toLowerCase().trim();
        if(users.findByEmail(email).isPresent()) throw new RuntimeException("Email already registered");
        Tenant t=new Tenant(); t.setName(req.tenantName()); t.setCity(req.city()); t.setCreatedAt(Instant.now().toString()); tenants.save(t);
        AppUser u=new AppUser(); u.setTenantId(t.getId()); u.setFullName(req.fullName()); u.setEmail(email);
        u.setPasswordHash(encoder.encode(req.password())); u.setRole("OWNER"); u.setCreatedAt(Instant.now().toString()); users.save(u);
        log.info("register tenant={} email={}", t.getId(), email);
        return Map.of("token", jwt.issue(u), "tenant", t.getName(), "name", u.getFullName());
    }
    @PostMapping("/login") public Map<String,Object> login(@RequestBody LoginReq req){
        String email = req.email()==null?"":req.email().toLowerCase().trim();
        AppUser u=users.findByEmail(email).orElseThrow(()->new RuntimeException("Invalid login"));
        if(!encoder.matches(req.password(), u.getPasswordHash())) {
            log.warn("login failed email={}", email);
            throw new RuntimeException("Invalid login");
        }
        Tenant t=tenants.findById(u.getTenantId()).orElseThrow();
        log.info("login tenant={} email={}", t.getId(), email);
        return Map.of("token", jwt.issue(u), "tenant", t.getName(), "name", u.getFullName());
    }
}
