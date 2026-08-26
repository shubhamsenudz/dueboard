package in.senudz.dueboard;
import org.springframework.web.bind.annotation.*;
import java.time.Instant;
import java.util.List;
@RestController @RequestMapping("/api/work_files")
public class WorkFileController {
    private final WorkFileRepository repo;
    public WorkFileController(WorkFileRepository repo){ this.repo = repo; }
    @GetMapping public List<WorkFile> list(){ return repo.findByTenantId(TenantContext.getTenantId()); }
    @PostMapping public WorkFile create(@RequestBody WorkFile body){
        body.setId(null); body.setTenantId(TenantContext.getTenantId()); body.setCreatedAt(Instant.now().toString());
        return repo.save(body);
    }
    @PutMapping("/{id}") public WorkFile update(@PathVariable Long id, @RequestBody WorkFile body){
        WorkFile e = repo.findById(id).orElseThrow();
        if(!e.getTenantId().equals(TenantContext.getTenantId())) throw new RuntimeException("forbidden");
        if(body.getTaskId()!=null) e.setTaskId(body.getTaskId());
        if(body.getFileName()!=null) e.setFileName(body.getFileName());
        if(body.getKind()!=null) e.setKind(body.getKind());
        return repo.save(e);
    }
    @DeleteMapping("/{id}") public void delete(@PathVariable Long id){
        WorkFile e = repo.findById(id).orElseThrow();
        if(!e.getTenantId().equals(TenantContext.getTenantId())) throw new RuntimeException("forbidden");
        repo.delete(e);
    }
}
