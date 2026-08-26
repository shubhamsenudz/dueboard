package in.senudz.dueboard;
import org.springframework.web.bind.annotation.*;
import java.time.Instant;
import java.util.List;
@RestController @RequestMapping("/api/activity")
public class ActivityController {
    private final ActivityLogRepository logs;
    private final UserRepository users;
    public ActivityController(ActivityLogRepository logs, UserRepository users) {
        this.logs = logs; this.users = users;
    }
    @GetMapping public List<ActivityLog> list() {
        List<ActivityLog> all = logs.findByTenantIdOrderByIdDesc(TenantContext.getTenantId());
        return all.size() > 80 ? all.subList(0, 80) : all;
    }
    public static void record(ActivityLogRepository logs, UserRepository users, String action, String detail) {
        ActivityLog a = new ActivityLog();
        a.setTenantId(TenantContext.getTenantId());
        a.setAction(action); a.setDetail(detail); a.setCreatedAt(Instant.now().toString());
        try { users.findById(TenantContext.getUserId()).ifPresent(u -> a.setActor(u.getEmail())); }
        catch (Exception ignored) {}
        logs.save(a);
    }
}
