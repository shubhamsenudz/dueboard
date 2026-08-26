package in.senudz.dueboard;
import org.springframework.web.bind.annotation.*;
import java.time.Instant;
import java.util.List;
@RestController @RequestMapping("/api/clients")
public class ClientController {
    private final ClientRepository repo;
    public ClientController(ClientRepository repo){ this.repo = repo; }
    @GetMapping public List<Client> list(){ return repo.findByTenantId(TenantContext.getTenantId()); }
    @PostMapping public Client create(@RequestBody Client body){
        body.setId(null); body.setTenantId(TenantContext.getTenantId()); body.setCreatedAt(Instant.now().toString());
        return repo.save(body);
    }
    @PutMapping("/{id}") public Client update(@PathVariable Long id, @RequestBody Client body){
        Client e = repo.findById(id).orElseThrow();
        if(!e.getTenantId().equals(TenantContext.getTenantId())) throw new RuntimeException("forbidden");
        if(body.getName()!=null) e.setName(body.getName());
        if(body.getGstin()!=null) e.setGstin(body.getGstin());
        if(body.getPhone()!=null) e.setPhone(body.getPhone());
        if(body.getFilingType()!=null) e.setFilingType(body.getFilingType());
        if(body.getStatus()!=null) e.setStatus(body.getStatus());
        return repo.save(e);
    }
    @DeleteMapping("/{id}") public void delete(@PathVariable Long id){
        Client e = repo.findById(id).orElseThrow();
        if(!e.getTenantId().equals(TenantContext.getTenantId())) throw new RuntimeException("forbidden");
        repo.delete(e);
    }
}
