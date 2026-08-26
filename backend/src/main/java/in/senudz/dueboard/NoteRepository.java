package in.senudz.dueboard;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findByTenantIdOrderByIdDesc(Long tenantId);
    List<Note> findByTenantIdAndKindAndRefId(Long tenantId, String kind, Long refId);
}
