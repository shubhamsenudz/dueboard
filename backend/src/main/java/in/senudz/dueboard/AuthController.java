package in.senudz.dueboard;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.time.Instant; import java.util.Map;
@RestController @RequestMapping("/api/auth")
public class AuthController {
    private final TenantRepository tenants; private final UserRepository users;
    private final PasswordEncoder encoder; private final JwtService jwt;
    public AuthController(TenantRepository tenants, UserRepository users, PasswordEncoder encoder, JwtService jwt){
        this.tenants=tenants; this.users=users; this.encoder=encoder; this.jwt=jwt;
    }
    public record RegisterReq(String tenantName, String city, String fullName, String email, String password){}
    public record LoginReq(String email, String password){}
    @PostMapping("/register") public Map<String,Object> register(@RequestBody RegisterReq req){
        if(users.findByEmail(req.email().toLowerCase()).isPresent()) throw new RuntimeException("Email already registered");
        Tenant t=new Tenant(); t.setName(req.tenantName()); t.setCity(req.city()); t.setCreatedAt(Instant.now().toString()); tenants.save(t);
        AppUser u=new AppUser(); u.setTenantId(t.getId()); u.setFullName(req.fullName()); u.setEmail(req.email().toLowerCase());
        u.setPasswordHash(encoder.encode(req.password())); u.setRole("OWNER"); u.setCreatedAt(Instant.now().toString()); users.save(u);
        return Map.of("token", jwt.issue(u), "tenant", t.getName(), "name", u.getFullName());
    }
    @PostMapping("/login") public Map<String,Object> login(@RequestBody LoginReq req){
        AppUser u=users.findByEmail(req.email().toLowerCase()).orElseThrow(()->new RuntimeException("Invalid login"));
        if(!encoder.matches(req.password(), u.getPasswordHash())) throw new RuntimeException("Invalid login");
        Tenant t=tenants.findById(u.getTenantId()).orElseThrow();
        return Map.of("token", jwt.issue(u), "tenant", t.getName(), "name", u.getFullName());
    }
}
