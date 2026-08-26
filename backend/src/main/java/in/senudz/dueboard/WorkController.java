package in.senudz.dueboard;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.*;
@RestController @RequestMapping("/api/work")
public class WorkController {
    private final ClientRepository clients;
    private final TaskRepository tasks;
    public WorkController(ClientRepository clients, TaskRepository tasks) {
        this.clients = clients; this.tasks = tasks;
    }
    @GetMapping
    public Map<String,Object> today() {
        Long tid = TenantContext.getTenantId();
        LocalDate today = LocalDate.now();
        List<Map<String,Object>> overdue = new ArrayList<>();
        List<Map<String,Object>> soon = new ArrayList<>();
        for (Task t : tasks.findByTenantId(tid)) {
            if ("DONE".equalsIgnoreCase(t.getStatus()) || "FILED".equalsIgnoreCase(t.getStatus())) continue;
            Map<String,Object> row = new LinkedHashMap<>();
            row.put("id", t.getId());
            row.put("clientId", t.getClientId());
            row.put("serviceCode", t.getServiceCode());
            row.put("period", t.getPeriod());
            row.put("dueOn", t.getDueOn());
            row.put("status", t.getStatus());
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
