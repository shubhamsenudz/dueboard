package in.senudz.dueboard;
import jakarta.persistence.*;
@Entity @Table(name="activity_logs")
public class ActivityLog {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    private Long tenantId; private String actor; private String action; private String detail; private String createdAt;
    public Long getId(){return id;} public void setId(Long id){this.id=id;}
    public Long getTenantId(){return tenantId;} public void setTenantId(Long tenantId){this.tenantId=tenantId;}
    public String getActor(){return actor;} public void setActor(String actor){this.actor=actor;}
    public String getAction(){return action;} public void setAction(String action){this.action=action;}
    public String getDetail(){return detail;} public void setDetail(String detail){this.detail=detail;}
    public String getCreatedAt(){return createdAt;} public void setCreatedAt(String createdAt){this.createdAt=createdAt;}
}
