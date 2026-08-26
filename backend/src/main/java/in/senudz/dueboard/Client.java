package in.senudz.dueboard;
import jakarta.persistence.*;
@Entity @Table(name="clients")
public class Client {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    private Long tenantId;
    private String name;
    private String gstin;
    private String phone;
    private String filingType;
    private String status;
    private String createdAt;
    public Long getId(){return id;} public void setId(Long id){this.id=id;}
    public Long getTenantId(){return tenantId;}
    public void setTenantId(Long tenantId){this.tenantId=tenantId;}
    public String getName(){return name;}
    public void setName(String name){this.name=name;}
    public String getGstin(){return gstin;}
    public void setGstin(String gstin){this.gstin=gstin;}
    public String getPhone(){return phone;}
    public void setPhone(String phone){this.phone=phone;}
    public String getFilingType(){return filingType;}
    public void setFilingType(String filingType){this.filingType=filingType;}
    public String getStatus(){return status;}
    public void setStatus(String status){this.status=status;}
    public String getCreatedAt(){return createdAt;}
    public void setCreatedAt(String createdAt){this.createdAt=createdAt;}
}
