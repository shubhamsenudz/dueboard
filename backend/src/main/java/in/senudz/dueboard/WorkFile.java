package in.senudz.dueboard;
import jakarta.persistence.*;
@Entity @Table(name="work_files")
public class WorkFile {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    private Long tenantId;
    private Long taskId;
    private String fileName;
    private String kind;
    private String createdAt;
    public Long getId(){return id;} public void setId(Long id){this.id=id;}
    public Long getTenantId(){return tenantId;}
    public void setTenantId(Long tenantId){this.tenantId=tenantId;}
    public Long getTaskId(){return taskId;}
    public void setTaskId(Long taskId){this.taskId=taskId;}
    public String getFileName(){return fileName;}
    public void setFileName(String fileName){this.fileName=fileName;}
    public String getKind(){return kind;}
    public void setKind(String kind){this.kind=kind;}
    public String getCreatedAt(){return createdAt;}
    public void setCreatedAt(String createdAt){this.createdAt=createdAt;}
}
