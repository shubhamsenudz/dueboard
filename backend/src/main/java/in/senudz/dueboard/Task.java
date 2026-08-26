package in.senudz.dueboard;
import jakarta.persistence.*;
@Entity @Table(name="tasks")
public class Task {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    private Long tenantId;
    private Long clientId;
    private String serviceCode;
    private String period;
    private String dueOn;
    private String status;
    private String createdAt;
    public Long getId(){return id;} public void setId(Long id){this.id=id;}
    public Long getTenantId(){return tenantId;}
    public void setTenantId(Long tenantId){this.tenantId=tenantId;}
    public Long getClientId(){return clientId;}
    public void setClientId(Long clientId){this.clientId=clientId;}
    public String getServiceCode(){return serviceCode;}
    public void setServiceCode(String serviceCode){this.serviceCode=serviceCode;}
    public String getPeriod(){return period;}
    public void setPeriod(String period){this.period=period;}
    public String getDueOn(){return dueOn;}
    public void setDueOn(String dueOn){this.dueOn=dueOn;}
    public String getStatus(){return status;}
    public void setStatus(String status){this.status=status;}
    public String getCreatedAt(){return createdAt;}
    public void setCreatedAt(String createdAt){this.createdAt=createdAt;}
}
