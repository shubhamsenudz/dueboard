package in.senudz.dueboard;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.*;
@RestController @RequestMapping("/api/work")
public class WorkController {
    private final ClientRepository clients;
    private final TaskRepository tasks;
    private final TenantRepository tenants;
    public WorkController(ClientRepository clients, TaskRepository tasks, TenantRepository tenants) {
        this.clients = clients; this.tasks = tasks; this.tenants = tenants;
    }
    @GetMapping
    public Map<String,Object> today() {
        Long tid = TenantContext.getTenantId();
        Tenant firm = tenants.findById(tid).orElseThrow();
        LocalDate today = LocalDate.now();
        Map<Long, Client> cmap = new HashMap<>();
        clients.findByTenantId(tid).forEach(c -> cmap.put(c.getId(), c));
        List<Map<String,Object>> overdue = new ArrayList<>();
        List<Map<String,Object>> soon = new ArrayList<>();
        for (Task t : tasks.findByTenantId(tid)) {
            if ("DONE".equalsIgnoreCase(t.getStatus()) || "FILED".equalsIgnoreCase(t.getStatus())) continue;
            Client c = cmap.get(t.getClientId());
            String name = c==null||c.getName()==null?"":c.getName();
            String phone = c==null||c.getPhone()==null?"":c.getPhone();
            String fallback = "Namaste " + name + ", please share books for " + t.getServiceCode() + " " + t.getPeriod()
                + " due " + t.getDueOn() + " so we can file on time.";
            String msg = IndiaLinks.applyTemplate(firm.getReminderTemplate(), fallback, name, t.getServiceCode(), t.getDueOn());
            Map<String,Object> row = new LinkedHashMap<>();
            row.put("id", t.getId());
            row.put("clientId", t.getClientId());
            row.put("clientName", name);
            row.put("phone", phone);
            row.put("serviceCode", t.getServiceCode());
            row.put("period", t.getPeriod());
            row.put("dueOn", t.getDueOn());
            row.put("status", t.getStatus());
            row.put("reminder", msg);
            row.put("waLink", IndiaLinks.wa(phone, msg));
            try {
                LocalDate due = LocalDate.parse(t.getDueOn());
                if (due.isBefore(today)) overdue.add(row);
                else if (!due.isAfter(today.plusDays(7))) soon.add(row);
            } catch (Exception e) { soon.add(row); }
        }
        return Map.of("overdue", overdue, "dueSoon", soon, "open", overdue.size() + soon.size());
    }
    @PostMapping("/seed-month")
    public Map<String,Object> seedMonth() {
        Long tid = TenantContext.getTenantId();
        String period = YearMonth.now().toString();
        int created = 0;
        for (Client c : clients.findByTenantId(tid)) {
            created += ensure(tid, c.getId(), "GSTR-1", period, period + "-11");
            created += ensure(tid, c.getId(), "GSTR-3B", period, period + "-20");
        }
        return Map.of("period", period, "created", created);
    }
    private int ensure(Long tid, Long clientId, String code, String period, String dueOn) {
        boolean exists = tasks.findByTenantId(tid).stream().anyMatch(t ->
            Objects.equals(t.getClientId(), clientId) && code.equals(t.getServiceCode()) && period.equals(t.getPeriod()));
        if (exists) return 0;
        Task t = new Task();
        t.setTenantId(tid); t.setClientId(clientId); t.setServiceCode(code);
        t.setPeriod(period); t.setDueOn(dueOn); t.setStatus("OPEN");
        t.setCreatedAt(java.time.Instant.now().toString());
        tasks.save(t);
        return 1;
    }
}
