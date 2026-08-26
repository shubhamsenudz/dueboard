package in.senudz.dueboard;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
@RestController @RequestMapping("/api/dashboard")
public class DashboardController {
    private final TenantRepository tenants;
    public DashboardController(TenantRepository tenants){ this.tenants=tenants; }
    @GetMapping public Map<String,Object> stats(){
        Tenant t = tenants.findById(TenantContext.getTenantId()).orElseThrow();
        return Map.of("product", "DueBoard", "tenant", t.getName(), "tag", "GST, TDS, ITR and ROC due board for 2-8 person CA / GSTP shops.");
    }
}
