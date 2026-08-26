package in.senudz.dueboard;
import org.springframework.web.bind.annotation.*;
import java.time.Instant;
import java.util.Map;
@RestController @RequestMapping("/api/import")
public class ImportController {
    private final ClientRepository clients;
    public ImportController(ClientRepository clients) { this.clients = clients; }
    @PostMapping("/clients")
    public Map<String,Integer> clients(@RequestBody Map<String,String> body) {
        int n = 0; Long tid = TenantContext.getTenantId();
        for (Map<String,String> row : Csv.parse(body.get("csv"))) {
            Client c = new Client();
            c.setTenantId(tid);
            c.setName(row.getOrDefault("name", row.get("Name")));
            c.setGstin(row.getOrDefault("gstin", row.get("GSTIN")));
            c.setPhone(row.getOrDefault("phone", row.get("Phone")));
            c.setFilingType(row.getOrDefault("filingType", "regular"));
            c.setStatus("active");
            c.setCreatedAt(Instant.now().toString());
            clients.save(c); n++;
        }
        return Map.of("imported", n);
    }
}
