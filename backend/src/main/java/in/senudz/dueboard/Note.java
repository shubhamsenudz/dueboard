package in.senudz.dueboard;
import jakarta.persistence.*;
@Entity @Table(name="notes")
public class Note {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    private Long tenantId; private String kind; private Long refId; private String body; private String followUpOn; private String createdAt;
    public Long getId(){return id;} public void setId(Long id){this.id=id;}
    public Long getTenantId(){return tenantId;} public void setTenantId(Long tenantId){this.tenantId=tenantId;}
    public String getKind(){return kind;} public void setKind(String kind){this.kind=kind;}
    public Long getRefId(){return refId;} public void setRefId(Long refId){this.refId=refId;}
    public String getBody(){return body;} public void setBody(String body){this.body=body;}
    public String getFollowUpOn(){return followUpOn;} public void setFollowUpOn(String followUpOn){this.followUpOn=followUpOn;}
    public String getCreatedAt(){return createdAt;} public void setCreatedAt(String createdAt){this.createdAt=createdAt;}
}
