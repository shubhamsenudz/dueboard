package in.senudz.dueboard;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
@RestController @RequestMapping("/api/settings")
public class SettingsController {
    private final TenantRepository tenants;
    public SettingsController(TenantRepository tenants) { this.tenants = tenants; }
    @GetMapping public Tenant get() { return tenants.findById(TenantContext.getTenantId()).orElseThrow(); }
    @PutMapping public Tenant save(@RequestBody Map<String,String> body) {
        Tenant t = tenants.findById(TenantContext.getTenantId()).orElseThrow();
        if (body.get("name") != null) t.setName(body.get("name"));
        if (body.get("city") != null) t.setCity(body.get("city"));
        if (body.get("phone") != null) t.setPhone(body.get("phone"));
        if (body.get("gstin") != null) t.setGstin(body.get("gstin"));
        if (body.get("upiVpa") != null) t.setUpiVpa(body.get("upiVpa"));
        if (body.get("whatsapp") != null) t.setWhatsapp(body.get("whatsapp"));
        if (body.get("address") != null) t.setAddress(body.get("address"));
        if (body.get("reminderTemplate") != null) t.setReminderTemplate(body.get("reminderTemplate"));
        return tenants.save(t);
    }
}
