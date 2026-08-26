package in.senudz.dueboard;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.time.Instant;
import java.util.*;
@RestController
public class TeamController {
    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final ActivityLogRepository logs;
    public TeamController(UserRepository users, PasswordEncoder encoder, ActivityLogRepository logs) {
        this.users = users; this.encoder = encoder; this.logs = logs;
    }
    @GetMapping("/api/team") public List<Map<String,Object>> list() {
        List<Map<String,Object>> out = new ArrayList<>();
        for (AppUser u : users.findByTenantId(TenantContext.getTenantId())) {
            Map<String,Object> row = new LinkedHashMap<>();
            row.put("id", u.getId()); row.put("fullName", u.getFullName());
            row.put("email", u.getEmail()); row.put("role", u.getRole());
            out.add(row);
        }
        return out;
    }
    @PostMapping("/api/team") public Map<String,Object> invite(@RequestBody Map<String,String> body) {
        AppUser me = users.findById(TenantContext.getUserId()).orElseThrow();
        if (!"OWNER".equalsIgnoreCase(me.getRole())) throw new RuntimeException("Only owner can add staff");
        String email = body.getOrDefault("email","").toLowerCase().trim();
        if (email.isBlank() || body.get("password")==null || body.get("password").length()<8)
            throw new RuntimeException("Email and 8+ character password required");
        if (users.findByEmail(email).isPresent()) throw new RuntimeException("Email already registered");
        AppUser u = new AppUser();
        u.setTenantId(TenantContext.getTenantId());
        u.setFullName(body.getOrDefault("fullName","Staff"));
        u.setEmail(email);
        u.setPasswordHash(encoder.encode(body.get("password")));
        u.setRole("STAFF"); u.setCreatedAt(Instant.now().toString());
        users.save(u);
        ActivityController.record(logs, users, "invite", email);
        return Map.of("id", u.getId(), "email", u.getEmail(), "role", u.getRole());
    }
    @PostMapping("/api/me/password") public Map<String,String> password(@RequestBody Map<String,String> body) {
        AppUser me = users.findById(TenantContext.getUserId()).orElseThrow();
        if (!encoder.matches(body.getOrDefault("oldPassword",""), me.getPasswordHash()))
            throw new RuntimeException("Current password is wrong");
        String next = body.get("newPassword");
        if (next==null || next.length()<8) throw new RuntimeException("New password must be 8+ characters");
        me.setPasswordHash(encoder.encode(next));
        users.save(me);
        return Map.of("ok","changed");
    }
}
