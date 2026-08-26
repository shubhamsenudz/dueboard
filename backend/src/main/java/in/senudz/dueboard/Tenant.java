package in.senudz.dueboard;
import jakarta.persistence.*;
@Entity @Table(name="tenants")
public class Tenant {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    private String name; private String city; private String createdAt;
    public Long getId(){return id;} public void setId(Long id){this.id=id;}
    public String getName(){return name;} public void setName(String name){this.name=name;}
    public String getCity(){return city;} public void setCity(String city){this.city=city;}
    public String getCreatedAt(){return createdAt;} public void setCreatedAt(String createdAt){this.createdAt=createdAt;}
}
