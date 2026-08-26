package in.senudz.dueboard;
import org.springframework.web.bind.annotation.*;
import java.time.Instant;
import java.util.List;
@RestController @RequestMapping("/api/notes")
public class NoteController {
    private final NoteRepository notes;
    public NoteController(NoteRepository notes) { this.notes = notes; }
    @GetMapping public List<Note> list(@RequestParam(required=false) String kind, @RequestParam(required=false) Long refId) {
        Long tid = TenantContext.getTenantId();
        if (kind != null && refId != null) return notes.findByTenantIdAndKindAndRefId(tid, kind, refId);
        return notes.findByTenantIdOrderByIdDesc(tid);
    }
    @PostMapping public Note create(@RequestBody Note body) {
        body.setId(null); body.setTenantId(TenantContext.getTenantId()); body.setCreatedAt(Instant.now().toString());
        return notes.save(body);
    }
}
