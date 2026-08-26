package in.senudz.dueboard;
import org.springframework.web.bind.annotation.*;
import java.time.Instant;
import java.util.List;
@RestController @RequestMapping("/api/tasks")
public class TaskController {
    private final TaskRepository repo;
    public TaskController(TaskRepository repo){ this.repo = repo; }
    @GetMapping public List<Task> list(){ return repo.findByTenantId(TenantContext.getTenantId()); }
    @PostMapping public Task create(@RequestBody Task body){
        body.setId(null); body.setTenantId(TenantContext.getTenantId()); body.setCreatedAt(Instant.now().toString());
        return repo.save(body);
    }
    @PutMapping("/{id}") public Task update(@PathVariable Long id, @RequestBody Task body){
        Task e = repo.findById(id).orElseThrow();
        if(!e.getTenantId().equals(TenantContext.getTenantId())) throw new RuntimeException("forbidden");
        if(body.getClientId()!=null) e.setClientId(body.getClientId());
        if(body.getServiceCode()!=null) e.setServiceCode(body.getServiceCode());
        if(body.getPeriod()!=null) e.setPeriod(body.getPeriod());
        if(body.getDueOn()!=null) e.setDueOn(body.getDueOn());
        if(body.getStatus()!=null) e.setStatus(body.getStatus());
        return repo.save(e);
    }
    @DeleteMapping("/{id}") public void delete(@PathVariable Long id){
        Task e = repo.findById(id).orElseThrow();
        if(!e.getTenantId().equals(TenantContext.getTenantId())) throw new RuntimeException("forbidden");
        repo.delete(e);
    }
}
