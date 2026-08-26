package in.senudz.dueboard;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface WorkFileRepository extends JpaRepository<WorkFile, Long> {
    List<WorkFile> findByTenantId(Long tenantId);
}
